export default `
(function() {
  // TODO
  // Get all "data-sync-tabs" elements
  // Get the hash & groupId from each element
  // See if there is anything in local storage
  //   If not:
  //     See if there is a "data-default-value" item, if so, set it as the default
  //     If there is no value, use the first child "data" key
  //   If yes:
  //     Loop over each child and apply the styles (see below) based on that value

  
  for (let i = 0; i < localStorage.length; i += 1) {
    const storageKey = localStorage.key(i);
    if (storageKey.startsWith('docs.page.tabs')) {
      const value = localStorage.getItem(storageKey);
      const els = document.querySelectorAll("[data-tabs-id='" + storageKey + "']");

      if (els.length) {
        els.forEach((el) => {
          const [tabs, panes] = el.children;
          console.log('value', value);
          if (!value) {
            console.log('adding to 0 index');
            tabs[0].classList.add('active');
          } else {
            for (let element of tabs.children) {
              if (element.dataset.tabValue === value) {
                element.classList.add('active');
              }
            }
          }

          let pi = 0;
          for (let element of panes.children) {
            if (!value && pi > 0) {
              element.classList.add('hidden');
            } else if (element.dataset.paneValue !== value) {
              element.classList.add('hidden');
            }

            pi++;
          }
        });
      }
    }
  }

})();
`;
