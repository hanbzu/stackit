/*global chrome*/
import bglog from "bglog";
import { useState, useEffect } from "react";

export default function useStackedTabs() {
  const [stackedTabs, setStackedTabs] = useState([]);

  const stackActiveTab = () =>
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTab = tabs[0];
      // Add it to the stack
      chrome.storage.sync.set({ tabs: [activeTab, ...stackedTabs] });
      // Close it in the browser
      chrome.tabs.remove(activeTab.id);
    });

  const restoreTab = id =>
    // Remove it from the stack
    chrome.storage.sync.set(
      { tabs: stackedTabs.filter(d => d.id !== id) },
      // Open it in the browser
      () => chrome.tabs.create({ url: stackedTabs.find(d => d.id === id).url })
    );

  const clearAll = () => chrome.storage.sync.set({ tabs: [] });

  useEffect(() => {
    // Initial read, as pop-up will close on update, we don't need to update more times
    chrome.storage.sync.get(["tabs"], result =>
      setStackedTabs(result.tabs || [])
    );
  }, []);

  bglog(`stackedTabs: ${JSON.stringify(stackedTabs)}`);

  return [stackedTabs, stackActiveTab, restoreTab, clearAll];
}

// Mock chrome API for dev mode
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line no-native-reassign
  chrome = {
    tabs: {
      query: (props, callback) => {
        callback([{ id: "active", title: "Active tab", url: "http://active" }]);
      },
      create: props => console.info("Creating tab", props),
      remove: id => console.info(`Removing tab ${id}`)
    },
    storage: {
      sync: {
        set: (props, callback) => {
          console.info(`Setting ${JSON.stringify(props)}`);
          if (callback) callback();
        },
        get: (props, callback) => {
          callback({
            tabs: [
              {
                id: "one",
                title: "One of the tabs is this one",
                url: "http://one"
              },
              {
                id: "two",
                title: "This is tab num. two and I like it a lot",
                url: "http://two"
              },
              {
                id: "three",
                title: "Here goes a third one",
                url: "http://three"
              },
              {
                id: "four",
                title: "Four, tab num. four",
                url: "http://four"
              },
              {
                id: "five",
                title: "Here goes the fifth",
                url: "http://five"
              },
              {
                id: "six",
                title: "And yet another one, num. six",
                url: "http://six"
              }
            ]
          });
        }
      }
    }
  };
}
