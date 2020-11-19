export default `
(function() {
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
})();
`;
