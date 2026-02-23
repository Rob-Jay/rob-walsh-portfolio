import { EXTERNAL_LINK_PROPS } from "../constants/appConstants";

function DiagramCard({ diagram }) {
  return (
    <article className="diagram-card">
      <h3>{diagram.title}</h3>
      <p>{diagram.summary}</p>
      <div className="diagram-stats">
        <span>{diagram.lines} lines</span>
        <span>{diagram.components} components</span>
        <span>{diagram.flows} flows</span>
        <span>{diagram.complexity}</span>
      </div>
      <ul className="diagram-value-list">
        {diagram.valueProps.map((value) => (
          <li key={`${diagram.id}-${value}`}>{value}</li>
        ))}
      </ul>
      <div className="diagram-actions">
        <a href={diagram.renderedSrc} className="button ghost" {...EXTERNAL_LINK_PROPS}>
          View Diagram
        </a>
        <details>
          <summary>View Source</summary>
          <pre>{diagram.source}</pre>
        </details>
      </div>
      <div className="toolkit">
        {diagram.tags.map((tag) => (
          <span key={`${diagram.id}-${tag}`}>{tag}</span>
        ))}
      </div>
      <p className="diagram-meta">PlantUML source included for technical review.</p>
    </article>
  );
}

export default DiagramCard;
