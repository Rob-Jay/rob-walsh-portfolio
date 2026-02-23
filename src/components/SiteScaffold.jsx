function SiteScaffold({ side }) {
  return (
    <div className={`site-scaffold ${side}`} aria-hidden="true">
      <div className="build-ground" />
      <div className="construction-label">WIP BUILD</div>
      <div className="building-frame">
        <div className="tower-rail left" />
        <div className="tower-rail right" />
        <div className="tower-floor f1" />
        <div className="tower-floor f2" />
        <div className="tower-floor f3" />
        <div className="tower-panel p1" />
        <div className="tower-panel p2" />
        <div className="tower-panel p3" />
        <div className="crane-line" />
        <div className="crane-hook" />
        <div className="worker hammering wa">
          <span className="hammer" />
        </div>
        <div className="worker hammering wb">
          <span className="hammer" />
        </div>
      </div>
    </div>
  );
}

export default SiteScaffold;
