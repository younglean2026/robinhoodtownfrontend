export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
export const NFT_CONTRACT =
  import.meta.env.VITE_NFT_CONTRACT || "0x0000000000000000000000000000000000000000";
export const RPC_URL = import.meta.env.VITE_RPC_URL || "https://rpc.robinhood-chain.example";
export const EXPLORER_URL =
  import.meta.env.VITE_EXPLORER_URL || "https://explorer.robinhood-chain.example";
export const TRADE_URL = import.meta.env.VITE_TRADE_URL || "#";

export const CHAIN = {
  chainId: 4663,
  chainIdHex: "0x1237",
  chainName: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: [EXPLORER_URL]
};

export const MAX_SLOTS = 2;

export const TIERS = [
  {
    tier: 0,
    key: "common",
    name: "Common Lumberjack",
    rarity: "Common",
    wpr: 50,
    priceEth: "0.005",
    cap: 10000,
    image: "/lumberjacks/common.png",
    perks: ["Steady, reliable chopping", "Cheapest way into the forest", "Backbone of every operation"]
  },
  {
    tier: 1,
    key: "rare",
    name: "Rare Frog",
    rarity: "Rare",
    wpr: 200,
    priceEth: "0.01",
    cap: 2000,
    image: "/lumberjacks/rare.png",
    perks: ["4x the output of a Common", "Amphibious axe technique", "Only 2,000 will ever exist"]
  },
  {
    tier: 2,
    key: "legendary",
    name: "Legendary CashCat",
    rarity: "Legendary",
    wpr: 550,
    priceEth: "0.02",
    cap: 500,
    image: "/lumberjacks/legendary.png",
    perks: ["11x the output of a Common", "Golden paws, golden logs", "Ultra scarce: 500 supply"]
  },
  {
    tier: 3,
    key: "mythic",
    name: "Mythic Vlad",
    rarity: "Mythic",
    wpr: 1200,
    priceEth: "0.03",
    cap: 100,
    image: "/lumberjacks/mythic.png",
    perks: ["24x the output of a Common", "Apex predator of the forest", "Just 100 in existence"]
  }
];
