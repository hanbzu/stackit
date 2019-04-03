import React from "react";
import ReactDOM from "react-dom";
import chroma from "chroma-js";
import useStackedTabs from "useStackedTabs";
import "./index.css";
import stackTabIcon from "icons/outline-add_circle_outline-24px.svg";
import clearAllIcon from "icons/outline-delete_sweep-24px.svg";

function App() {
  const [stackedTabs, stackActiveTab, restoreTab, clearAll] = useStackedTabs();

  const colors = chroma
    .cubehelix()
    .start(200)
    .rotations(-0.35)
    .gamma(0.7)
    .lightness([0.7, 0.9])
    .scale() // convert to chroma.scale
    .correctLightness()
    .colors(stackedTabs.length);

  const stackTabButton = (
    <img
      id="stack-tab-button"
      src={stackTabIcon}
      alt="Add to stack"
      title="Move current tab to stack"
      onClick={stackActiveTab}
    />
  );

  const clearAllButton = (
    <img
      id="clear-all-button"
      src={clearAllIcon}
      alt="Clear all"
      title="Empty out stack"
      onClick={() => {
        if (
          window.confirm("All tabs in the stack will be removed. Are you sure?")
        )
          clearAll();
      }}
    />
  );

  return (
    <>
      {stackTabButton}
      {clearAllButton}

      <div id="stack" className={stackedTabs.length > 3 ? "large-stack" : ""}>
        {stackedTabs.map(({ id, title }, i) => (
          <div
            className="tab"
            key={id}
            onClick={() => restoreTab(id)}
            title={title}
            style={{
              backgroundColor: colors[i]
            }}
          >
            {title}
          </div>
        ))}
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
