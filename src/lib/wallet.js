import { BrowserProvider, Contract } from "ethers";
import { CHAIN, NFT_CONTRACT } from "../config.js";

export const NFT_ABI = [
  "function mint(uint8 tier, uint32 qty) payable",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tierOf(uint256 tokenId) view returns (uint8)",
  "function tiers(uint256 i) view returns (uint32 wpr, uint128 price, uint32 cap, uint32 minted)"
];

export function hasWallet() {
  return typeof window !== "undefined" && !!window.ethereum;
}

export async function ensureRobinhoodChain() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN.chainIdHex }]
    });
  } catch (err) {
    const code = err?.code ?? err?.data?.originalError?.code;
    if (code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CHAIN.chainIdHex,
            chainName: CHAIN.chainName,
            nativeCurrency: CHAIN.nativeCurrency,
            rpcUrls: CHAIN.rpcUrls,
            blockExplorerUrls: CHAIN.blockExplorerUrls
          }
        ]
      });
    } else {
      throw err;
    }
  }
}

export async function connectWallet() {
  if (!hasWallet()) {
    throw new Error("No wallet found. Install MetaMask (or another EVM wallet) to play.");
  }
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  await ensureRobinhoodChain();
  return accounts[0].toLowerCase();
}

export async function getSigner() {
  const provider = new BrowserProvider(window.ethereum);
  return provider.getSigner();
}

export async function getNftContract(withSigner = false) {
  if (!/^0x[0-9a-fA-F]{40}$/.test(NFT_CONTRACT) || /^0x0{40}$/.test(NFT_CONTRACT)) {
    throw new Error("NFT contract not configured yet. Set VITE_NFT_CONTRACT and redeploy.");
  }
  const provider = new BrowserProvider(window.ethereum);
  const runner = withSigner ? await provider.getSigner() : provider;
  return new Contract(NFT_CONTRACT, NFT_ABI, runner);
}

/** All tokens owned by `address`, via ERC721Enumerable. */
export async function fetchOwnedTokens(address) {
  const nft = await getNftContract();
  const balance = Number(await nft.balanceOf(address));
  const tokens = [];
  for (let i = 0; i < balance; i++) {
    const tokenId = Number(await nft.tokenOfOwnerByIndex(address, i));
    const tier = Number(await nft.tierOf(tokenId));
    tokens.push({ tokenId, tier });
  }
  return tokens.sort((a, b) => a.tokenId - b.tokenId);
}
