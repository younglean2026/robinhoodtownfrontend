import { useEffect, useState } from "react";
import { DOCS_FLOW, DOCS_SECTIONS } from "../content/docs.js";

function Block({ block }) {
  switch (block.type) {
    case "p":
      return <p className="docs-p">{block.text}</p>;

    case "sub":
      return <h3 className="docs-sub-title">{block.text}</h3>;

    case "note":
      return <p className="docs-note">{block.text}</p>;

    case "steps":
      return (
        <div className="docs-steps">
          {block.items.map((s) => (
            <div className="docs-step" key={s.num}>
              <span className="step-num">{s.num}</span>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      );

    case "tiers":
      return (
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Lumberjack</th>
                <th>Rarity</th>
                <th>WPR</th>
                <th>Mint Price</th>
                <th>Supply Cap</th>
              </tr>
            </thead>
            <tbody>
              {block.items.map((t) => (
                <tr key={t.key}>
                  <td>{t.name}</td>
                  <td>
                    <span className={`badge badge-${t.key}`}>{t.rarity}</span>
                  </td>
                  <td>{t.wpr}</td>
                  <td>{t.price}</td>
                  <td>{t.cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "code":
      return (
        <div className="docs-code">
          {block.lines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      );

    case "list":
      return (
        <ul className="docs-list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );

    case "xlist":
      return (
        <ul className="docs-xlist">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );

    case "kv":
      return (
        <div className="docs-kv">
          {block.items.map((row) => (
            <div className="docs-kv-row" key={row.label}>
              <span className="docs-kv-label">{row.label}</span>
              <span className="docs-kv-value">{row.value}</span>
            </div>
          ))}
        </div>
      );

    case "flow":
      return (
        <div className="docs-loop">
          {block.items.map((item, i) => (
            <div className="docs-loop-item" key={item}>
              <div className="docs-loop-box">{item}</div>
              {i < block.items.length - 1 && <div className="docs-loop-arrow">▼</div>}
            </div>
          ))}
        </div>
      );

    case "ladder":
      return (
        <div className="docs-ladder">
          {block.items.map((step, i) => (
            <div
              className={`docs-ladder-step badge-${step.key}`}
              style={{ "--stair": i }}
              key={step.key}
            >
              <span className="docs-ladder-rarity">{step.rarity}</span>
              <span className="docs-ladder-name">{step.name}</span>
              <span className="docs-ladder-wpr">{step.wpr}</span>
            </div>
          ))}
        </div>
      );

    case "features":
      return (
        <>
          <div className="docs-features">
            {block.items.map((item) => (
              <div className="docs-feature" key={item}>
                <h4>{item}</h4>
                <span className="soon-tag">COMING SOON</span>
              </div>
            ))}
          </div>
          {block.note && <p className="docs-note">{block.note}</p>}
        </>
      );

    default:
      return null;
  }
}

export default function Docs() {
  const [activeId, setActiveId] = useState(DOCS_SECTIONS[0].id);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      // Fire when a section's top crosses the upper quarter of the viewport.
      { rootMargin: "-25% 0px -65% 0px" }
    );
    DOCS_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="docs-page">
      <div className="docs-flowbar">
        {DOCS_FLOW.map((step, i) => (
          <span className="docs-flow-step" key={step}>
            {step}
            {i < DOCS_FLOW.length - 1 && <span className="docs-flow-arrow"> → </span>}
          </span>
        ))}
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <button
            className="docs-toc-toggle"
            onClick={() => setMenuOpen((open) => !open)}
          >
            CONTENTS {menuOpen ? "▲" : "▼"}
          </button>
          <nav className={`docs-toc ${menuOpen ? "open" : ""}`}>
            <h3 className="docs-toc-title">CONTENTS</h3>
            {DOCS_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={activeId === s.id ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                § {s.num} — {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="docs-content">
          {DOCS_SECTIONS.map((s) => (
            <section className="card docs-section" id={s.id} key={s.id}>
              <span className="docs-section-num">§ {s.num}</span>
              <h2 className="docs-section-title">{s.title}</h2>
              {s.blocks.map((block, i) => (
                <Block block={block} key={i} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
