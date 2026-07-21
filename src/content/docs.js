// RobinHood Town — documentation content.
// Edit texts here freely; the layout lives in pages/Docs.jsx and renders
// each section's blocks by `type`:
//   p        { text }                       plain paragraph
//   sub      { text }                       subsection heading
//   note     { text }                       small muted note
//   steps    { items: [{ num, text }] }     numbered card grid
//   tiers    { items: [{ name, rarity, key, wpr, price, cap }] }  tier table
//   code     { lines: [string] }            dark formula block
//   list     { items: [string] }            ▸ bullet list
//   xlist    { items: [string] }            ✗ blocker list
//   kv       { items: [{ label, value }] }  key/value fact rows
//   flow     { items: [string] }            vertical loop with arrows
//   ladder   { items: [{ rarity, key, name, wpr }] }  progression stair
//   features { items: [string], note }      coming-soon card grid

export const DOCS_FLOW = ["HIRE", "DEPLOY", "HARVEST", "EARN $RHT", "GROW"];

export const DOCS_SECTIONS = [
  {
    id: "quick-start",
    num: "01",
    title: "QUICK START",
    blocks: [
      {
        type: "p",
        text: "RobinHood Town is an onchain idle lumberjack game built on Robinhood Chain (Arbitrum Orbit L2). Hire lumberjacks, send them into the forest, and earn your share of the global $RHT emission stream. Here is the whole game in seven steps:"
      },
      {
        type: "steps",
        items: [
          { num: "01", text: "Connect your wallet (MetaMask, Robinhood Chain — chainId 4663, gas paid in ETH)." },
          { num: "02", text: "Mint your first lumberjack." },
          { num: "03", text: "Deploy your lumberjack to the forest." },
          { num: "04", text: "Your lumberjack begins contributing WPR." },
          { num: "05", text: "Earn your share of global $RHT emissions." },
          { num: "06", text: "Claim your accumulated $RHT." },
          { num: "07", text: "Mint stronger and rarer lumberjacks." }
        ]
      }
    ]
  },
  {
    id: "core-gameplay",
    num: "02",
    title: "CORE GAMEPLAY",
    blocks: [
      {
        type: "p",
        text: "Your objective: build the strongest lumber operation in town."
      },
      {
        type: "p",
        text: "Every lumberjack has a WPR — Wood Production Rate. The combined WPR of all your deployed lumberjacks is your Player WPR. Your Player WPR, measured against the total WPR of the entire network, defines your network share — and that share defines exactly how much of the global $RHT emissions flow to you. More WPR, bigger share, more $RHT."
      }
    ]
  },
  {
    id: "lumberjacks",
    num: "03",
    title: "LUMBERJACKS",
    blocks: [
      {
        type: "p",
        text: "Four tiers of lumberjacks roam the forest. Higher rarity means higher WPR — and a much smaller supply."
      },
      {
        type: "tiers",
        items: [
          { name: "Wood Lumberjack", rarity: "COMMON", key: "common", wpr: "50", price: "0.01 ETH", cap: "10,000" },
          { name: "Frog Lumberjack", rarity: "RARE", key: "rare", wpr: "200", price: "0.02 ETH", cap: "2,000" },
          { name: "CashCat Lumberjack", rarity: "LEGENDARY", key: "legendary", wpr: "550", price: "0.04 ETH", cap: "500" },
          { name: "Vlad Lumberjack", rarity: "MYTHIC", key: "mythic", wpr: "1,200", price: "0.06 ETH", cap: "100" }
        ]
      },
      {
        type: "p",
        text: "Total Player WPR = the sum of all your actively deployed lumberjacks."
      }
    ]
  },
  {
    id: "the-forest",
    num: "04",
    title: "THE FOREST",
    blocks: [
      {
        type: "p",
        text: "Lumberjacks must be deployed to the forest to produce. A lumberjack sitting idle in your inventory contributes zero WPR — no deploy, no share, no $RHT."
      },
      {
        type: "p",
        text: "Your starting forest has 2 deploy slots. Forest upgrades: coming soon."
      }
    ]
  },
  {
    id: "wpr",
    num: "05",
    title: "WPR — WOOD PRODUCTION RATE",
    blocks: [
      {
        type: "p",
        text: "WPR is the single stat that matters. Your slice of the network is calculated as:"
      },
      {
        type: "code",
        lines: ["Player Network Share = Player WPR ÷ Total Network WPR"]
      },
      {
        type: "p",
        text: "Example: if your deployed lumberjacks total 10,000 WPR and the whole network totals 1,000,000 WPR, your network share is 10,000 ÷ 1,000,000 = 1%."
      }
    ]
  },
  {
    id: "rht-rewards",
    num: "06",
    title: "$RHT REWARDS",
    blocks: [
      {
        type: "p",
        text: "RobinHood Town runs on a fixed global emission model. The amount of $RHT distributed per period does not increase when more lumberjacks join the network — instead, players compete for their share of the same stream."
      },
      {
        type: "code",
        lines: ["Player Reward = (Player WPR ÷ Total Network WPR) × Global $RHT Emissions"]
      },
      {
        type: "p",
        text: "Example: with a 1% network share, you earn 1% of every $RHT emitted while your lumberjacks are deployed. If the network's total WPR grows and yours stays the same, your share — and your rewards — shrink."
      }
    ]
  },
  {
    id: "claiming",
    num: "07",
    title: "CLAIMING REWARDS",
    blocks: [
      {
        type: "p",
        text: "Claiming is manual: hit CLAIM in the game interface and your accumulated $RHT is sent straight to your connected wallet. Claims cost a small gas fee in ETH on Robinhood Chain."
      },
      {
        type: "p",
        text: "What determines how much you have to claim:"
      },
      {
        type: "list",
        items: [
          "Your active (deployed) WPR",
          "Total network WPR",
          "The global emission rate",
          "How long your lumberjacks have been deployed"
        ]
      }
    ]
  },
  {
    id: "rht-token",
    num: "08",
    title: "$RHT TOKEN",
    blocks: [
      {
        type: "p",
        text: "$RHT is the utility and reward token of RobinHood Town. It launched on the Pons launchpad (Robinhood Chain) with a fixed supply and liquidity locked at graduation."
      },
      {
        type: "kv",
        items: [
          { label: "Launchpad", value: "Pons (Robinhood Chain)" },
          { label: "Total supply", value: "1,000,000,000 (fixed)" },
          { label: "Decimals", value: "18" },
          { label: "Liquidity", value: "Locked at graduation" },
          { label: "Initial rewards pool", value: "5% of supply" },
          { label: "Emission", value: "Linear over gameplay" }
        ]
      },
      {
        type: "p",
        text: "Initial rewards pool: 5% of the supply was acquired at launch and allocated to the game rewards wallet, emitted linearly over gameplay."
      },
      {
        type: "p",
        text: "Current utility: gameplay rewards. Future utility: marriage fees (burned), upgrades, and new areas."
      },
      {
        type: "sub",
        text: "MINT REVENUE FLYWHEEL"
      },
      {
        type: "list",
        items: [
          "50% of all ETH from lumberjack mints is used to market-buy $RHT and added to the rewards pool.",
          "50% goes to the project treasury (liquidity, operations, development)."
        ]
      },
      {
        type: "p",
        text: "The effect: the rewards pool grows with adoption — more lumberjacks minted means more $RHT flowing back into gameplay emissions, extending the reward runway beyond the initial allocation."
      },
      {
        type: "flow",
        items: [
          "Mint (ETH)",
          "50% buyback $RHT",
          "Rewards Pool",
          "Emissions",
          "Players",
          "Mint more lumberjacks ↺"
        ]
      },
      {
        type: "note",
        text: "Transparency: buybacks are executed periodically from the treasury wallet and are visible on-chain."
      }
    ]
  },
  {
    id: "economic-loop",
    num: "09",
    title: "ECONOMIC LOOP",
    blocks: [
      {
        type: "flow",
        items: [
          "Lumberjacks generate WPR",
          "WPR determines your network share",
          "Share determines $RHT rewards",
          "Players claim $RHT",
          "Total network WPR grows",
          "Competition increases",
          "NFT mints fund $RHT buybacks",
          "Rewards pool grows"
        ]
      }
    ]
  },
  {
    id: "progression",
    num: "10",
    title: "PROGRESSION",
    blocks: [
      {
        type: "p",
        text: "The climb is simple: rarer lumberjacks, higher WPR, bigger share."
      },
      {
        type: "ladder",
        items: [
          { rarity: "COMMON", key: "common", name: "Wood Lumberjack", wpr: "50 WPR" },
          { rarity: "RARE", key: "rare", name: "Frog Lumberjack", wpr: "200 WPR" },
          { rarity: "LEGENDARY", key: "legendary", name: "CashCat Lumberjack", wpr: "550 WPR" },
          { rarity: "MYTHIC", key: "mythic", name: "Vlad Lumberjack", wpr: "1,200 WPR" }
        ]
      }
    ]
  },
  {
    id: "common-blockers",
    num: "11",
    title: "COMMON BLOCKERS",
    blocks: [
      {
        type: "p",
        text: "Something not working? It is almost always one of these:"
      },
      {
        type: "xlist",
        items: [
          "Wallet not connected",
          "Wrong network — you are not on Robinhood Chain",
          "Not enough ETH for gas",
          "Incorrect mint value",
          "Tier sold out (supply cap reached)",
          "Lumberjack not deployed",
          "No pending $RHT to claim"
        ]
      }
    ]
  },
  {
    id: "road-ahead",
    num: "12",
    title: "ROAD AHEAD",
    blocks: [
      {
        type: "p",
        text: "The town keeps growing. On the roadmap:"
      },
      {
        type: "features",
        items: [
          "Marriage & Family",
          "Marketplace",
          "Forest Upgrades",
          "Equipment & Axes",
          "Leaderboards",
          "Community Events"
        ],
        note: "Future features are not considered active until officially released."
      }
    ]
  }
];
