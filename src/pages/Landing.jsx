import { useState } from "react";
import { Link } from "react-router-dom";
import { parseEther } from "ethers";
import { TIERS, TRADE_URL } from "../config.js";
import { connectWallet, getNftContract } from "../lib/wallet.js";

const STEPS = [
  {
    title: "HIRE",
    text: "Mint a lumberjack NFT on Robinhood Chain. Four tiers, from Common to Mythic."
  },
  {
    title: "DEPLOY",
    text: "Send your crew into the forest. Each deployed jack adds his WPR to your camp."
  },
  {
    title: "EARN",
    text: "$RHT streams every second, split across the whole network by WPR share."
  },
  {
    title: "CLAIM",
    text: "Cash out your unclaimed $RHT to your wallet whenever you like."
  }
];

export default function Landing() {
  const [mintState, setMintState] = useState({}); // tier -> {busy, msg, err}

  const setTierState = (tier, patch) =>
    setMintState((s) => ({ ...s, [tier]: { ...s[tier], ...patch } }));

  async function handleMint(tierInfo) {
    const { tier, priceEth } = tierInfo;
    setTierState(tier, { busy: true, msg: null, err: null });
    try {
      await connectWallet();
      const nft = await getNftContract(true);
      const tx = await nft.mint(tier, 1, { value: parseEther(priceEth) });
      setTierState(tier, { msg: "Minting... waiting for confirmation" });
      await tx.wait();
      setTierState(tier, { busy: false, msg: `Minted! Tx: ${tx.hash.slice(0, 14)}…`, err: null });
    } catch (err) {
      setTierState(tier, {
        busy: false,
        msg: null,
        err: err?.shortMessage || err?.message || "Mint failed"
      });
    }
  }

  return (
    <main>
      <section className="hero">
        <h1>ROBINHOOD TOWN</h1>
        <p className="subtitle">The On-Chain Idle Lumber Game</p>
        <div className="hero-buttons">
          <Link to="/play" className="btn btn-gold">
            ▶ PLAY NOW
          </Link>
          <Link to="/docs" className="btn btn-outline">
            READ THE DOCS
          </Link>
          <a href={TRADE_URL} className="btn" target="_blank" rel="noreferrer">
            TRADE $RHT
          </a>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Build Your Lumber Operation</h2>
        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <div className="card step-card" key={step.title}>
              <span className="step-num">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Four Tiers. One Goal. More WPR.</h2>
        <div className="tiers-grid">
          {TIERS.map((t) => {
            const st = mintState[t.tier] || {};
            return (
              <div className="card tier-card" key={t.tier}>
                <img src={t.image} alt={t.name} />
                <span className={`badge badge-${t.key}`}>{t.rarity.toUpperCase()}</span>
                <h3>{t.name}</h3>
                <div className="tier-wpr">{t.wpr} WPR</div>
                <ul className="tier-perks">
                  {t.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                <div className="tier-price">{t.priceEth} ETH</div>
                <button
                  className="btn"
                  disabled={st.busy}
                  onClick={() => handleMint(t)}
                >
                  {st.busy ? "MINTING…" : "MINT"}
                </button>
                {st.msg && <span className="ok-text">{st.msg}</span>}
                {st.err && <span className="error-text">{st.err}</span>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="formula-box card">
          <h2>How Earnings Work</h2>
          <p className="formula">
            your $RHT / sec = (your WPR ÷ network WPR) × emission
          </p>
          <p className="muted" style={{ color: "#cdbf9d" }}>
            Everyone shares one global emission stream. The more WPR you deploy — and the
            less everyone else does — the bigger your slice of every second.
          </p>
        </div>
      </section>

      <section className="section cta-section">
        <h2 className="section-title">The forest is waiting.</h2>
        <Link to="/play" className="btn btn-gold">
          ▶ START CHOPPING
        </Link>
      </section>
    </main>
  );
}
