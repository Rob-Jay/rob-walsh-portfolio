import { CONTACT_MAILTO } from "../constants/appConstants";
import { getTimelineBadgeText } from "../data/content";

function TimelineMiniItem({ step, isLast }) {
  const logoClassName = `timeline-logo ${step.company} ${isLast ? "is-future" : ""}`;

  return (
    <div className="timeline-mini-item" tabIndex={0}>
      <div className="timeline-mini-line" aria-hidden="true" />
      {step.company === "next" ? (
        <a className={logoClassName} href={CONTACT_MAILTO} aria-label={step.title}>
          <span className="timeline-logo-next-eyebrow">Your</span>
          <span className="timeline-logo-next-title">Company</span>
          <span className="timeline-logo-next-tail">next?</span>
          <small>{step.role}</small>
        </a>
      ) : (
        <button type="button" className={logoClassName} aria-label={`${step.period} ${step.title}`}>
          <span>{getTimelineBadgeText(step.company)}</span>
          <small>{step.role}</small>
        </button>
      )}
      <p className={`timeline-mini-date ${step.company === "next" ? "is-next-label" : ""}`}>{step.period}</p>
      <div className="timeline-mini-pop">
        <h3>{step.title}</h3>
        {step.detail ? <p>{step.detail}</p> : null}
        <ul>
          {step.workedOn.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TimelineMiniItem;
