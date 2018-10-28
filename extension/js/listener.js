/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

// TODO show hide tab container (think about design)

// show current window tabs list on new-session button click
document.getElementById(config.elements.newSessionButton).addEventListener("click", () => {
  // save all tabs of current window on current state
  tab.setTabs().then(() => {
    // add tabs inside tab list container
    DOM.setTabList(tab.getAll);
    DOM.toggleSaveButton(true);
  });
});

document.getElementById(config.elements.saveSessionButton).addEventListener("click", () => {
  const tabIds = DOM.getSelectedTabIds();
  console.log('--------------------');
  console.log(tab.getAll);
  console.log(tabIds);
  console.log('--------------------');
});