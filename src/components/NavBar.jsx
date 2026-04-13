import { useEffect, useState } from "react";
import { CONTACT_MAILTO } from "../constants/appConstants";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#case-studies", label: "Case Studies" },
  { href: "#architecture", label: "Architecture" },
  { href: "#toolkit", label: "Toolkit" },
];

const SECTION_IDS = ["hero", "about", "experience", "projects", "case-studies", "architecture", "toolkit"];

function NavBar({ onTerminalOpen }) {
  const [activeId, setActiveId] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);

      const scrollY = window.scrollY + 80;
      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="site-nav" aria-label="Page navigation">
      <div className="nav-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <div className="site-nav-inner">
        <a href="#hero" className="site-nav-name">Rob Walsh</a>
        <div className="site-nav-links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`site-nav-link${activeId === link.href.slice(1) ? " active" : ""}`}
            >
              {link.label}
            </a>
          ))}
          <a className="site-nav-link site-nav-cta" href={CONTACT_MAILTO}>
            Contact
          </a>
          <button
            className="site-nav-link theme-toggle"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            type="button"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <button
            className="site-nav-link terminal-nav-btn"
            onClick={onTerminalOpen}
            aria-label="Open terminal"
            title="Open terminal  (~)"
            type="button"
          >
            {"</>"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;