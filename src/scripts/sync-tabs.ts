/**
 * This file should be loaded in as a blocking script, after content has been rendered but before
 * the client finishes loading.
 *
 * Since the server cannot access localStorage, without this there is a "flash" whereby the tabs show the
 * first element, then jump to anything loaded in via localStorage. This hacky script plucks out all
 * <Tabs /> elements on the page and applies any necessary CSS to the elements before being presented to the
 * user (client).
 *
 * Once the client has loaded, any interaction with the tabs is then managed via state and updated context
 * (to allow <Tabs /> to listen to changes) and also updates local storage (incase of a reload).
 *
 * Not sure if there's a better way to do this.
 */

export default `
function syncTabs() {
  // Get all elements with the "data-sync-tabs=true" property
  const tabElements = document.querySelectorAll("[data-sync-tabs=true");

  tabElements.forEach((tabElement) => {
    const groupId = tabElement.dataset.syncTabsGroup;
    const hash = tabElement.dataset.syncTabsHash;
    const key = "docs.page.tabs." + hash + "." + groupId;
    let localStorageItem;

    try {
      localStorageItem = localStorage.getItem(key);
    } catch (e) {}

    const [tabs, panes] = tabElement.children;

    // If an item in local storage exists for this key, update the tabs & panes
    if (localStorageItem) {
      for (let element of tabs.children) {
        if (element.dataset.tabValue === localStorageItem) {
          element.classList.add('active');
        }
      }

      for (let element of panes.children) {
        if (element.dataset.paneValue !== localStorageItem) {
          element.classList.add('hidden');
        }
      }
    }

    // If no local storage item exists, apply any defaults
    if (!localStorageItem) {
      const defaultValue = tabElement.dataset.syncTabsDefault;

      // If no default value, use the first element
      if (!defaultValue) {
        tabs[0].classList.add('active');

        for (let i = 0; i < panes.length; i++) {
          if (i > 0) panes[i].classList.add('hidden');
        }
      } else {
        for (let element of tabs.children) {
          if (element.dataset.tabValue === defaultValue) {
            element.classList.add('active');
          }
        }

        for (let element of panes.children) {
          if (element.dataset.paneValue !== defaultValue) {
            element.classList.add('hidden');
          }
        }
      }
    }
  });
}

window._docs_page = window._docs_page || {};
window._docs_page.syncTabs = syncTabs;
(syncTabs)();
`;
