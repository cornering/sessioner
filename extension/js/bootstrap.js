/**
 * Created by David Nazaryan on 10/28/2018
 */

// sync the list of saved sessions
session.syncSessionList().then(() => {
  DOM.setSessionList(session.getAll);
  DOM.toggleLoading(
    config.prefixes.class,
    config.elements.sessionListContainer,
    false
  );
  DOM.resizePopup();
});

// get configs form storage
menu.syncSettings().then(() => {
  // set lightning mode switcher
  DOM.syncLightningSwitcher();
  // sync all settings in settings card
  DOM.syncSettings();
  // turn off settings card loading
  DOM.toggleLoading(
    config.prefixes.class,
    config.elements.settingsContainer,
    false
  );
  DOM.resizePopup();
});

// show current window tabs list on new-session button click
DOM.setListenerToElement(config.elements.newSessionButton, Dom.SELECTION.id, "click", e => {
  // check if lightning mode enabled
  if(menu.settings.lightningMode) {
    // sync tabs
    tab.setTabs().then(() => {
      // lightning save them inside session using same function
      session.saveSession(tab.allTabs, menu.getLightningSessionName()).then(updated => DOM.saveSessionCallback(updated));
    });
  } else {
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
    
      // resize popup
      DOM.resizePopup();
    
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
  }
});

// card-wrapper toggling system
DOM.setListenerToElement(config.elements.toggleCard, Dom.SELECTION.class, "click", e => DOM.toggleCard(e.target));

// save new session
DOM.setListenerToElement(config.elements.saveSessionButton, Dom.SELECTION.id, "click", () => {
  DOM.setSelectedTabs();
  DOM.setSessionName(document.getElementById(config.elements.saveSessionInput).value);
  
  const tabsData = tab.getTabsData(DOM.selectedTabs);
  session.saveSession(tabsData, DOM.sessionName).then(updated => DOM.saveSessionCallback(updated));
});

// select/deselect all tabs for saving in new session
DOM.setListenerToElement(config.elements.tabSelectAll, Dom.SELECTION.id, "click", () => DOM.toggleSelectAll());

// hide tooltip on click and reset tooltip every time after hide animation ends
DOM.setListenerToElement(config.elements.sessionTooltip, Dom.SELECTION.class, "click", e => DOM.hideTooltip(e.target));
DOM.setListenerToElement(config.elements.sessionTooltip, Dom.SELECTION.class, "transitionend", e => DOM.resetTooltip(e.target));

// detect lightning mode switcher change
DOM.setListenerToElement(config.elements.lightningSwitcher, Dom.SELECTION.id, "change", e => {
  // lock/unlock new session card
  setTimeout(() => {
    DOM.cardsLock["new-session"] = e.target.checked;
    menu.updateSetting("lightningMode", e.target.checked);
  });
});

// change lightning mode name on input blur
DOM.setListenerToElement(config.elements.lightningSessionInput, Dom.SELECTION.id, "blur", e => {
  // prevent action if text is same (not changed)
  if(e.target.value === menu.settings.lightningSaveDefaultName) return;
  // update config in localstorage
  menu.updateSetting("lightningSaveDefaultName", e.target.value);
});

// dialog actions
DOM.setListenerToElement(config.elements.dialogReject, Dom.SELECTION.id, "click", () => DOM.closeDialog());
DOM.setListenerToElement(config.elements.dialogOpen, Dom.SELECTION.class, "click", e => DOM.prepareAndOpenDialog(e.target));
DOM.setListenerToElement(config.elements.dialogAccept, Dom.SELECTION.id, "click", () => DOM.acceptAction());

// fire event on every key press
document.addEventListener("keydown", e => {
  // turn off tab button focus
  if(e.code === "Tab") e.preventDefault();
});
