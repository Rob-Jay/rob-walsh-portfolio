import { useEffect, useMemo, useRef, useState } from "react";
import DiagramCard from "./components/DiagramCard";
import HeroActions from "./components/HeroActions";
import SiteScaffold from "./components/SiteScaffold";
import TimelineMiniItem from "./components/TimelineMiniItem";
import {
  COLLAPSE_RECOVERY_MS,
  GAME_UNLOCK_SCROLL_PERCENT,
  GLITCH_BEEP_CONFIG
} from "./constants/appConstants";
import {
  architecturePrinciples,
  architectureWorkItems,
  caseStudies,
  experience,
  externalTracks,
  impactHighlights,
  profileSignals,
  projectCards,
  reliabilitySnapshot,
  scenarios,
  timelineGraph,
  toolkit,
  valueTags
} from "./data/content";
function App() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [gameUnlocked, setGameUnlocked] = useState(false);

  const [detonated, setDetonated] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const collapseTimerRef = useRef(null);
  const [revealedPets, setRevealedPets] = useState({ cat: false, dog: false });

  const activeScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0],
    [scenarioId]
  );

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) {
        return;
      }
      const pct = Math.round((window.scrollY / max) * 100);
      if (pct >= GAME_UNLOCK_SCROLL_PERCENT) setGameUnlocked(true);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) window.clearTimeout(collapseTimerRef.current);
    };
  }, []);

  const playGlitchBeep = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = GLITCH_BEEP_CONFIG.frequency;
      gain.gain.value = GLITCH_BEEP_CONFIG.gain;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + GLITCH_BEEP_CONFIG.durationSeconds);
    } catch {
      // no-op for restricted audio environments
    }
  };

  const triggerCollapse = () => {
    if (detonated) return;
    setDetonated(true);
    setShowFailure(true);
    playGlitchBeep();
    collapseTimerRef.current = window.setTimeout(() => {
      setShowFailure(false);
    }, COLLAPSE_RECOVERY_MS);
  };

  const togglePetEgg = (pet) => {
    setRevealedPets((prev) => ({ ...prev, [pet]: !prev[pet] }));
  };

  return (
    <div className={`page-shell ${detonated ? "detonated" : ""} ${showFailure ? "show-failure" : ""}`}>
      <div className="grain" aria-hidden="true" />
      <main className="content">
        <section className="hero">
          <p className="eyebrow">Software Engineer | Backend + Platform</p>
          <h1>
            Rob Walsh
            <span>Java microservices, platform ownership, production reliability.</span>
          </h1>
          <p className="intro">
            Backend-focused engineer with financial-services experience building secure APIs,
            async systems, and internal developer platforms, with hands-on frontend delivery when needed.
          </p>
          <div className="hero-signals">
            {profileSignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
          <ul className="impact-highlights">
            {impactHighlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <HeroActions />
        </section>

        <section className="panel" id="playground">
          <div className="section-heading">
            <h2>Backend Scenario Switcher</h2>
            <p>Interactive view of how I work. These are role-focus summaries, not latency/SLO metrics.</p>
          </div>
          <div className="switcher">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                className={scenario.id === activeScenario.id ? "chip active" : "chip"}
                onClick={() => setScenarioId(scenario.id)}
                type="button"
              >
                {scenario.label}
              </button>
            ))}
          </div>

          <article className="scenario-card">
            <h3>{activeScenario.title}</h3>
            <p className="stack">{activeScenario.stack}</p>
            <div className="kpi-grid">
              <div>
                <span>Delivery Focus</span>
                <strong>{activeScenario.deliveryFocus}</strong>
              </div>
              <div>
                <span>Quality Signal</span>
                <strong>{activeScenario.qualitySignal}</strong>
              </div>
              <div>
                <span>Evidence</span>
                <strong>{activeScenario.proofPoint}</strong>
              </div>
            </div>
            <ul>
              {activeScenario.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>System Reliability Snapshot</h2>
            <p>How I keep backend systems stable, observable, and production-ready.</p>
          </div>
          <div className="reliability-grid">
            {reliabilitySnapshot.map((item) => (
              <article className="project-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel timeline-panel">
          <div className="section-heading">
            <h2>Career Timeline</h2>
            <p>Hover each logo for role highlights.</p>
          </div>
          <div className="timeline-mini">
            {timelineGraph.map((step, index) => (
              <TimelineMiniItem
                key={`${step.period}-${step.title}`}
                step={step}
                isLast={index === timelineGraph.length - 1}
              />
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Experience Snapshot</h2>
          </div>
          <div className="project-grid">
            {experience.map((item) => (
              <article className="project-card" key={`${item.company}-${item.period}`}>
                <h3>
                  {item.role} | {item.company}
                </h3>
                <p>{item.period}</p>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" id="projects">
          <div className="section-heading">
            <h2>Backend Project Highlights</h2>
          </div>
          <div className="project-grid">
            {projectCards.map((project) => (
              <article className="project-card" key={project.title}>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <span>{project.tech}</span>
                <strong>{project.impact}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Personal Project Lab</h2>
            <p>Add your repo links/details here later. Placeholder is ready now.</p>
          </div>
          <article className="scenario-card">
            <h3>LLM + RAG Developer Tooling (Personal Project)</h3>
            <p className="stack">Status: In Progress | Repo link coming soon</p>
            <ul>
              <li>Focus: ingestion, retrieval strategies, and practical backend integration</li>
              <li>Planned: architecture diagram, latency metrics, and lessons learned</li>
              <li>Planned: GitHub + live demo links once polished</li>
            </ul>
          </article>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Architecture Workbench</h2>
            <p>Selected PlantUML drafts from my workspace (kept the stronger diagrams, removed the simpler ones).</p>
          </div>
          <div className="diagram-grid">
            {architectureWorkItems.map((diagram) => (
              <DiagramCard key={diagram.id} diagram={diagram} />
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Architecture Playbook</h2>
            <p>Common patterns I use in production backend delivery.</p>
          </div>
          <div className="toolkit">
            {architecturePrinciples.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Hackathons & Competitions Radar</h2>
            <p>Current tracks I am exploring for future submissions.</p>
          </div>
          <div className="project-grid events-grid">
            {externalTracks.map((track) => (
              <article className={`project-card event-card ${track.easterPet ? "has-pet-egg" : ""}`} key={track.name}>
                <h3>{track.name}</h3>
                <p>{track.note}</p>
                {track.easterPet ? (
                  <button
                    type="button"
                    className="pet-egg-trigger"
                    onClick={() => togglePetEgg(track.easterPet)}
                    aria-label={`Reveal ${track.easterPet} easter egg`}
                    title="Easter egg"
                  >
                    {"\u{1F43E}"}
                  </button>
                ) : null}
                {track.easterPet ? (
                  <div className={`card-pet ${track.easterPet} ${revealedPets[track.easterPet] ? "open" : ""}`} aria-hidden="true">
                    <span className="pet-spark">zZ</span>
                  </div>
                ) : null}
                <a className="button ghost event-link" href={track.url} target="_blank" rel="noreferrer">
                  View Events
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Case Studies</h2>
            <p>How I think: challenge, decisions, ownership.</p>
          </div>
          <div className="project-grid">
            {caseStudies.map((study) => (
              <article className="project-card" key={study.title}>
                <h3>{study.title}</h3>
                <p>{study.challenge}</p>
                <ul>
                  {study.decisions.map((decision) => (
                    <li key={decision}>{decision}</li>
                  ))}
                </ul>
                <strong>What I Owned: {study.owned}</strong>
                <p>
                  <strong>Key Tradeoff:</strong> {study.tradeoff}
                </p>
                <p>
                  <strong>If I Had 2 More Weeks:</strong> {study.next}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Core Toolkit</h2>
          </div>
          <div className="toolkit">
            {toolkit.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="panel game-panel">
          <div className="section-heading">
            <h2>WIP</h2>
            <p>Current strengths and focus areas.</p>
            <div className="wip-value-tags">
              {valueTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          {!gameUnlocked ? (
            <div className="locked-game">Keep scrolling. Reward unlocks at 80%.</div>
          ) : (
            <div className="mini-game chaos-zone">
              <div className="wip-stage">
                <div className="wip-ribbon">UNDER CONSTRUCTION</div>
                <div className="wip-progress">Production-Minded | Architecture-Led | Delivery Focused</div>
                <div className="wip-blueprint">
                  <div className="wip-block large" />
                  <div className="wip-block mid" />
                  <div className="wip-block small" />
                  <div className="wip-block row" />
                </div>
                <button
                  type="button"
                  className="chaos-button launch-button"
                  onClick={triggerCollapse}
                  disabled={detonated}
                >
                  DO NOT PRESS
                </button>
                <SiteScaffold side="left" />
                <SiteScaffold side="right" />
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default App;



