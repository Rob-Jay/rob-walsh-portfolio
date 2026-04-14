import { useEffect, useState } from "react";

function TypingText({ text, delay = 700, speed = 36 }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || displayed.length >= text.length) return;
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="typing-cursor" aria-hidden="true" />
      )}
    </span>
  );
}

export default TypingText;