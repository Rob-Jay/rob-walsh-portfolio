import { useCallback, useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "../constants/appConstants";

const PROMPT = "rob@portfolio:~$";

const COMMANDS = {
  help: () => [
    { text: "Available commands:", cls: "ok" },
    { text: "" },
    { text: "  about        Who is Rob?" },
    { text: "  experience   Career timeline" },
    { text: "  skills       Tech stack + confidence levels" },
    { text: "  projects     Side projects + lab work" },
    { text: "  contact      Get in touch" },
    { text: "  github       Open GitHub profile" },
    { text: "  linkedin     Open LinkedIn profile" },
    { text: "  clear        Clear terminal" },
    { text: "  exit         Close terminal (or press ESC)" },
    { text: "" },
    { text: "  whoami / ls / pwd / date   Because why not.", cls: "warn" },
  ],

  about: () => [
    { text: "Rob Walsh — Senior Software Engineer", cls: "ok" },
    { text: "Dublin, Ireland · Mastercard (Feb 2026 → present)" },
    { text: "" },
    { text: "5 years in fintech:  J.P. Morgan (2021–23) → Mastercard (2023→)" },
    { text: "Backend:  Java · Spring Boot · Microservices · Event-Driven Systems" },
    { text: "Now:      Architecture leadership, mentoring, cross-team platform ownership" },
    { text: "" },
    { text: "Side projects:", cls: "warn" },
    { text: "  AI Training Engine — LLM-powered system I built to plan and adapt my UTMB prep" },
    { text: "  Sport Training Engine — full-stack adaptive mesocycle planner, end-to-end system design" },
    { text: "" },
    { text: "This portfolio is a live React project. You can view the code on GitHub." },
  ],

  experience: () => [
    { text: "Career Timeline", cls: "ok" },
    { text: "" },
    { text: "2026 →   Senior Software Engineer · Mastercard", cls: "ok" },
    { text: "         Architecture leadership · Cross-team standards · Mentoring" },
    { text: "" },
    { text: "2023–26  Software Engineer II · Mastercard" },
    { text: "         Profile/Identity platform · API Gateway · Java microservices" },
    { text: "" },
    { text: "2022–23  Software Engineer II · J.P. Morgan, Dublin" },
    { text: "         Regulated REST APIs · Async Java · Security + compliance" },
    { text: "" },
    { text: "2021–22  Software Engineer I · J.P. Morgan" },
    { text: "         Backend ownership · Spring Boot · CompletableFuture patterns" },
    { text: "" },
    { text: "Mar–Jun 2021  Intern · J.P. Morgan", cls: "warn" },
    { text: "         Frontend delivery · Promoted to SWE I in 3 months" },
  ],

  skills: () => [
    { text: "Tech Stack — Confidence Levels", cls: "ok" },
    { text: "" },
    { text: "  [Expert]       Java + Spring Boot" },
    { text: "  [Expert]       Microservice Architecture · REST API Design" },
    { text: "  [Expert]       Async Processing · Event-Driven Systems" },
    { text: "  [Expert]       Code Review · PR Quality · Delivery Standards" },
    { text: "" },
    { text: "  [Comfortable]  React + Vite · TypeScript · HTML/CSS" },
    { text: "  [Comfortable]  AWS + Azure · Docker · PostgreSQL · MongoDB" },
    { text: "  [Comfortable]  Kafka · OAuth2/JWT · API Gateway policies" },
    { text: "  [Comfortable]  Testcontainers · Contract Testing · Sonar" },
    { text: "" },
    { text: "  [Comfortable]  AI/LLM Integration · Search & Retrieval Systems" },
    { text: "  [Learning]     Kubernetes at depth · Prometheus + Grafana dashboarding", cls: "warn" },
  ],

  projects: () => [
    { text: "Side Projects + Lab Work", cls: "ok" },
    { text: "" },
    { text: "AI Training Engine  [in progress]", cls: "warn" },
    { text: "  LLM-powered backend I built to drive my UTMB ultramarathon training plan" },
    { text: "  Retrieval-augmented generation · prompt orchestration · adaptive planning logic" },
    { text: "  Real-world validation: I train with it daily." },
    { text: "" },
    { text: "Sport Training Engine  [in progress]", cls: "warn" },
    { text: "  Full-stack adaptive mesocycle planner + workout logger" },
    { text: "  Java backend · session state machines · relational data model" },
    { text: "  End-to-end system design from onboarding to progression feedback loop" },
    { text: "" },
    { text: "This Portfolio  [live]", cls: "ok" },
    { text: "  React + Vite · JetBrains Mono · PlantUML diagrams" },
    { text: "  You're inside it right now." },
  ],

  contact: () => [
    { text: "Contact", cls: "ok" },
    { text: "" },
    { text: `  Email     ${CONTACT_EMAIL}` },
    { text: `  LinkedIn  linkedin.com/in/robert-walsh-937703218/` },
    { text: `  GitHub    github.com/Rob-Jay` },
    { text: "" },
    { text: "Open to Senior Backend + Platform Engineering roles.", cls: "warn" },
  ],

  github: () => {
    window.open(GITHUB_URL, "_blank", "noreferrer");
    return [{ text: "Opening GitHub...", cls: "ok" }];
  },

  linkedin: () => {
    window.open(LINKEDIN_URL, "_blank", "noreferrer");
    return [{ text: "Opening LinkedIn...", cls: "ok" }];
  },

  whoami: () => [{ text: "rob", cls: "ok" }],

  ls: () => [
    { text: "about/    experience/    projects/    skills/    contact/    cv.pdf" },
  ],

  pwd: () => [{ text: "/home/rob/portfolio" }],

  date: () => [{ text: new Date().toLocaleString("en-IE") }],

  uname: () => [{ text: "Portfolio OS v1.0 — Dublin, Ireland" }],

  sudo: () => [
    { text: "Nice try. You're already root here.", cls: "warn" },
  ],

  "git log": () => [
    { text: "commit f3a9b1  Promoted to Senior SE at Mastercard (Feb 2026)", cls: "ok" },
    { text: "commit c8d2e4  Joined Mastercard as SWE II (May 2023)" },
    { text: "commit 7f1a3c  Promoted to SWE II at J.P. Morgan (2022)" },
    { text: "commit 4b9e2d  Promoted to SWE I at J.P. Morgan (Jun 2021)" },
    { text: "commit 0a1c5f  First commit: Intern at J.P. Morgan (Mar 2021)", cls: "warn" },
  ],

  "cat cv.pdf": () => [
    { text: "Binary file. Use the 'View CV' button like a normal person.", cls: "warn" },
  ],

  "rm -rf /": () => [
    { text: "Error: This portfolio is bulletproof.", cls: "warn" },
  ],
};

function Line({ text, cls }) {
  return (
    <div className={`terminal-line${cls ? ` ${cls}` : ""}`}>{text}</div>
  );
}

function TerminalWidget({ onClose }) {
  const [lines, setLines] = useState([
    { text: "Rob Walsh — Portfolio Terminal  v1.0", cls: "ok" },
    { text: 'Type "help" for available commands.  ESC to close.' },
    { text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const runCommand = useCallback(
    (raw) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const cmd = trimmed.toLowerCase();
      const echo = { text: `${PROMPT} ${raw}`, cls: "prompt-echo" };

      if (cmd === "clear") {
        setLines([]);
        setHistory((h) => [raw, ...h]);
        setHistIdx(-1);
        setInput("");
        return;
      }

      if (cmd === "exit" || cmd === "quit") {
        onClose();
        return;
      }

      const handler = COMMANDS[cmd];
      if (handler) {
        const output = handler();
        setLines((prev) => [...prev, echo, ...output, { text: "" }]);
      } else {
        setLines((prev) => [
          ...prev,
          echo,
          { text: `command not found: ${trimmed}  — try "help"`, cls: "warn" },
          { text: "" },
        ]);
      }

      setHistory((h) => [raw, ...h]);
      setHistIdx(-1);
      setInput("");
    },
    [onClose]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        runCommand(input);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.min(histIdx + 1, history.length - 1);
        setHistIdx(next);
        setInput(history[next] ?? "");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.max(histIdx - 1, -1);
        setHistIdx(next);
        setInput(next === -1 ? "" : (history[next] ?? ""));
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [input, history, histIdx, runCommand, onClose]
  );

  return (
    <div
      className="terminal-overlay"
      role="dialog"
      aria-label="Portfolio terminal"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="terminal-window">
        <div className="terminal-titlebar">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">rob@portfolio — bash</span>
          <button
            className="terminal-close"
            onClick={onClose}
            aria-label="Close terminal"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
          {lines.map((line, i) => (
            <Line key={i} text={line.text} cls={line.cls} />
          ))}
          <div className="terminal-input-row">
            <span className="terminal-prompt">{PROMPT}</span>
            <input
              ref={inputRef}
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-label="Terminal input"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

export default TerminalWidget;