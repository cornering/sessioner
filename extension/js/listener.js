/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

// show current window tabs list on new-session button click
/*document.getElementById(config.elements.newSessionButton).addEventListener("click", () => {
  // save all tabs of current window on current state
  tab.setTabs().then(() => {
    // add tabs inside tab list container
    DOM.setTabList(tab.getAll);
    DOM.toggleSaveBlock(true);
  });
});----------------------------------

// save list of selected tabs in chrome local storage
document.getElementById(config.elements.saveSessionButton).addEventListener("click", () => {
  const sessionName = DOM.getSessionName();
  
  if(!sessionName || !sessionName.length) return alert("provide session name!");
  // get chrome id's of selected tabs
  const tabsId = DOM.getSelectedTabIds();
  if(!tabsId || !tabsId.length) return alert("select al least one tab");
  
  // get data from tab ids
  const tabsData = tab.getTabsData(tabsId);
  
  // save tabs data in chrome local storage
  session.saveSession(tabsData, sessionName);
});*/