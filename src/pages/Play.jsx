import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TIERS, MAX_SLOTS } from "../config.js";
import { connectWallet, getSigner, hasWallet, fetchOwnedTokens } from "../lib/wallet.js";
import { api, getSession, setSession, clearSession } from "../lib/api.js";

const POLL_MS = 10_000;

function tierInfo(tier) {
  return TIERS[tier] || TIERS[0];
}

function fmt(n, dp = 4) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("en-US", { maximumFractionDigits: dp });
}

export default function Play() {
  const [address, setAddress] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const [state, setState] = useState(null); // backend /state payload
  const [owned, setOwned] = useState([]); // [{tokenId, tier}]
  const [displayPending, setDisplayPending] = useState(0);

  const lastFetchRef = useRef({ pending: 0, ratePerSec: 0, at: Date.now() });

  // ---------- session bootstrap ----------
  useEffect(() => {
    const session = getSession();
    if (session?.address && session?.token) {
      setAddress(session.address);
      setLoggedIn(true);
    }
  }, []);

  // ---------- data loading ----------
  const refreshState = useCallback(async () => {
    try {
      const s = await api.getState();
      setState(s);
      const pending = Number(s.pending);
      const ratePerSec =
        Number(s.total_wpr) > 0
          ? (Number(s.active_wpr) / Number(s.total_wpr)) * Number(s.emission_per_sec)
          : 0;
      lastFetchRef.current = { pending, ratePerSec, at: Date.now() };
      setDisplayPending(pending);
      setError(null);
    } catch (err) {
      if (err.message === "NOT_LOGGED_IN" || err.message === "SESSION_EXPIRED") {
        setLoggedIn(false);
      } else {
        setError(err.message);
      }
    }
  }, []);

  const refreshOwned = useCallback(async (addr) => {
    try {
      setOwned(await fetchOwnedTokens(addr));
    } catch (err) {
      console.error("Failed to load NFTs:", err);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn || !address) return;
    refreshState();
    refreshOwned(address);
    const poll = setInterval(refreshState, POLL_MS);
    return () => clearInterval(poll);
  }, [loggedIn, address, refreshState, refreshOwned]);

  // Smooth per-second interpolation between polls.
  useEffect(() => {
    if (!loggedIn) return;
    const tick = setInterval(() => {
      const { pending, ratePerSec, at } = lastFetchRef.current;
      const elapsed = (Date.now() - at) / 1000;
      setDisplayPending(pending + ratePerSec * elapsed);
    }, 1000);
    return () => clearInterval(tick);
  }, [loggedIn]);

  // ---------- actions ----------
  async function handleConnect() {
    setBusy(true);
    setError(null);
    try {
      setAddress(await connectWallet());
    } catch (err) {
      setError(err?.shortMessage || err?.message || "Failed to connect");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin() {
    setBusy(true);
    setError(null);
    try {
      const { message } = await api.getNonce(address);
      const signer = await getSigner();
      const signature = await signer.signMessage(message);
      const { token } = await api.verify(address, signature);
      setSession({ address, token });
      setLoggedIn(true);
    } catch (err) {
      setError(err?.shortMessage || err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    clearSession();
    setLoggedIn(false);
    setState(null);
  }

  async function handleDeploy(tokenId) {
    setBusy(true);
    setError(null);
    try {
      const s = await api.deploy(tokenId);
      applyState(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleUndeploy(tokenId) {
    setBusy(true);
    setError(null);
    try {
      const s = await api.undeploy(tokenId);
      applyState(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleClaim() {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await api.claim();
      applyState(result.state);
      setNotice(`Claimed ${fmt(result.amount)} $RHT! Tx: ${result.txHash.slice(0, 14)}…`);
    } catch (err) {
      setError(
        err.message === "PENDING_BELOW_MINIMUM"
          ? `Not enough $RHT to claim yet${state?.claim_min ? ` — minimum is ${fmt(Number(state.claim_min))} $RHT` : ""}`
          : err.message
      );
    } finally {
      setBusy(false);
    }
  }

  function applyState(s) {
    if (!s) return;
    setState(s);
    const pending = Number(s.pending);
    const ratePerSec =
      Number(s.total_wpr) > 0
        ? (Number(s.active_wpr) / Number(s.total_wpr)) * Number(s.emission_per_sec)
        : 0;
    lastFetchRef.current = { pending, ratePerSec, at: Date.now() };
    setDisplayPending(pending);
  }

  // ---------- derived ----------
  const deployments = state?.deployments || [];
  const deployedIds = useMemo(() => new Set(deployments.map((d) => d.token_id)), [deployments]);
  const idleTokens = owned.filter((t) => !deployedIds.has(t.tokenId));
  const sharePct = state && Number(state.total_wpr) > 0
    ? (Number(state.active_wpr) / Number(state.total_wpr)) * 100
    : 0;

  // ---------- gates ----------
  if (!address) {
    return (
      <main className="play-page play-gate">
        <h2 className="section-title">Enter the Forest</h2>
        {!hasWallet() && (
          <p className="error-text">
            No EVM wallet detected. Install MetaMask to play RobinHood Town.
          </p>
        )}
        <button className="btn btn-gold" onClick={handleConnect} disabled={busy || !hasWallet()}>
          {busy ? "CONNECTING…" : "CONNECT WALLET"}
        </button>
        {error && <p className="error-text">{error}</p>}
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className="play-page play-gate">
        <h2 className="section-title">Sign In</h2>
        <p className="muted">
          {address.slice(0, 6)}…{address.slice(-4)} — sign a message to prove ownership. No gas
          required.
        </p>
        <button className="btn btn-gold" onClick={handleLogin} disabled={busy}>
          {busy ? "WAITING FOR SIGNATURE…" : "SIGN IN WITH WALLET"}
        </button>
        {error && <p className="error-text">{error}</p>}
      </main>
    );
  }

  return (
    <main className="play-page">
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <span className="muted">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <button className="btn btn-outline btn-small" onClick={handleLogout}>
          LOG OUT
        </button>
      </div>

      {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}
      {notice && <p className="ok-text" style={{ marginBottom: 12 }}>{notice}</p>}

      <div className="play-grid">
        {/* -------- left: crew -------- */}
        <div className="card">
          <h3 className="panel-title">🪓 ACTIVE CREW</h3>
          <div className="slots-row">
            {Array.from({ length: MAX_SLOTS }).map((_, i) => {
              const dep = deployments[i];
              if (!dep) {
                return (
                  <div className="slot" key={`empty-${i}`}>
                    <span className="muted">EMPTY SLOT</span>
                    <span className="muted">deploy a lumberjack</span>
                  </div>
                );
              }
              const info = tierInfo(dep.tier);
              return (
                <div className="slot filled" key={dep.token_id}>
                  <img src={info.image} alt={info.name} />
                  <span className="slot-name">
                    {info.name} #{dep.token_id}
                  </span>
                  <span className="muted">{dep.wpr} WPR</span>
                  <button
                    className="btn btn-red btn-small"
                    disabled={busy}
                    onClick={() => handleUndeploy(dep.token_id)}
                  >
                    UNDEPLOY
                  </button>
                </div>
              );
            })}
          </div>

          <h3 className="panel-title">YOUR LUMBERJACKS</h3>
          {owned.length === 0 ? (
            <p className="muted">
              No lumberjacks found in this wallet. Mint one on the home page to get started!
            </p>
          ) : idleTokens.length === 0 ? (
            <p className="muted">All of your lumberjacks are already deployed.</p>
          ) : (
            <div className="nft-grid">
              {idleTokens.map((t) => {
                const info = tierInfo(t.tier);
                return (
                  <div className="nft-item" key={t.tokenId}>
                    <img src={info.image} alt={info.name} />
                    <span>
                      {info.name}
                      <br />#{t.tokenId} · {info.wpr} WPR
                    </span>
                    <button
                      className="btn btn-small"
                      disabled={busy || deployments.length >= MAX_SLOTS}
                      onClick={() => handleDeploy(t.tokenId)}
                    >
                      DEPLOY
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <p style={{ marginTop: 14 }}>
            <button className="btn btn-outline btn-small" onClick={() => refreshOwned(address)}>
              ↻ REFRESH NFTS
            </button>
          </p>
        </div>

        {/* -------- right: claim + coming soon -------- */}
        <div className="side-col">
          <div className="card claim-card">
            <h3 className="panel-title">UNCLAIMED $RHT</h3>
            <div className="claim-amount">{fmt(displayPending, 4)}</div>
            <button className="btn btn-gold" onClick={handleClaim} disabled={busy}>
              {busy ? "…" : "CLAIM"}
            </button>
            {Number(state?.claim_min) > 0 && (
              <p className="muted" style={{ marginTop: 10 }}>
                Min claim: {fmt(Number(state.claim_min))} $RHT
              </p>
            )}
          </div>

          <div className="card soon-card">
            <h3 className="panel-title">🌲 UPGRADE FOREST</h3>
            <p className="muted">Boost your camp's output with forest upgrades.</p>
            <span className="soon-tag">COMING SOON</span>
          </div>

          <div className="card soon-card">
            <h3 className="panel-title">💍 MARRY SYSTEM</h3>
            <p className="muted">Pair up lumberjacks for combo bonuses.</p>
            <span className="soon-tag">COMING SOON</span>
          </div>
        </div>
      </div>

      {/* -------- bottom stats bar -------- */}
      <div className="statsbar">
        <div className="stat">
          <div className="stat-label">YOUR WPR</div>
          <div className="stat-value">{fmt(state?.active_wpr ?? 0, 0)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">NET SHARE</div>
          <div className="stat-value">{fmt(sharePct, 4)}%</div>
        </div>
        <div className="stat">
          <div className="stat-label">CLAIMED</div>
          <div className="stat-value">{fmt(state?.claimed ?? 0, 2)} $RHT</div>
        </div>
        <div className="stat">
          <div className="stat-label">NETWORK WPR</div>
          <div className="stat-value">{fmt(state?.total_wpr ?? 0, 0)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">EMISSION/SEC</div>
          <div className="stat-value">{fmt(state?.emission_per_sec ?? 0, 4)}</div>
        </div>
      </div>
    </main>
  );
}
