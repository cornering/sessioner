/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

// sync the list of saved sessions
session.syncSessionList().then(() => {
  DOM.setSessionList(session.getAll);
  DOM.toggleLoading(
    config.prefixes.class,
    config.elements.sessionListContainer,
    false
  );
});

// show current window tabs list on new-session button click
DOM.setListenerToElement(config.elements.newSessionButton, Dom.SELECTION.id, "click", () => {
  // hide tab list container data and show loader
  DOM.toggleLoading(
    config.prefixes.class,
    config.elements.tabListContainer,
    true
  );
  // save all tabs of current window on current state
  tab.setTabs().then(() => {
    // set save new session state
    DOM._saveButton.disabled = true;
    // add tabs inside tab list container
    DOM.setTabList(tab.getAll);
  
    // reset form
    DOM.resetNewSessionForm();
    
    // hide loader and show tab list
    DOM.toggleLoading(
      config.prefixes.class,
      config.elements.tabListContainer,
      false
    );
    
    // add new session form validation on checkbox selection
    DOM.setListenerToElement(config.elements.tabCheckbox, Dom.SELECTION.class, "change", () => {
      DOM.setSelectedTabs();
      DOM.toggleSaveButton();
    });
  
    // add new session form validation on input edit
    DOM.setListenerToElement(config.elements.saveSessionInput, Dom.SELECTION.id, "input", event => {
      DOM.setSessionName(event.target.value);
      DOM.toggleSaveButton();
    });
  });
});

// card-wrapper toggling system
DOM.setListenerToElement(config.elements.toggleCard, Dom.SELECTION.class, "click", event => {
  const wrapper_class = event.target.getAttribute("card") || event.target.parentNode.getAttribute("card");
  if(wrapper_class) document.getElementById("wrapper").className = "wrapper " + wrapper_class;
});

// save new session
DOM.setListenerToElement(config.elements.saveSessionButton, Dom.SELECTION.id, "click", () => {
  DOM.setSelectedTabs();
  DOM.setSessionName(document.getElementById(config.elements.saveSessionInput).value);
  
  const tabsData = tab.getTabsData(DOM.selectedTabs);
  session.saveSession(tabsData, DOM.sessionName).then(() => {
    DOM.saveSessionCallback();
  });
  //TODO save tab list in local storage
});