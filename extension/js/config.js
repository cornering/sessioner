/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

// to save all system variables (like element ID's) in one place
const config = {
  prefixes: {
    id: "#", class: ".", tab: ""
  },
  sessionsStorage: {
    list: "sessions",
    prefix: "session_"
  },
  
  menuStorage: {
    preferences: "preferences"
  },
  
  elements: {
    drag: "drag",
    loading: "loading",
    wrapper: "wrapper",
    app: "app",
  
    defaultCard: "default-card",
    toggleCard: "toggle-card",
  
    sessionListContainer: "session-list-container",
    sessionListUl: "session-list",
    sessionListItem: "session-list-item",
    newSessionButton: "new-session",
    
    sessionTooltip: "session-tooltip",
    sessionAddTooltip: "session-add-tooltip",
    sessionRemoveTooltip: "session-remove-tooltip",
    sessionUpdateTooltip: "session-update-tooltip",
    showTooltipClass: "session-tooltip-show",
    tooltipWithCounter: "tooltip-with-counter",
    tooltipNumber: "tooltip-number",
    // used for numbers manipulation, to show tooltip in right place and don't overflow other ones
    nthTooltip: ["", "second-tooltip", "third-tooltip"],
    
    tabListContainer: "tab-list-container",
    tabListUl: "tab-list",
    tabCheckbox: "tab-checkbox",
    tabCheckboxLabel: "tab-checkbox-label",
    tabCheckboxText: "tab-checkbox-text",
    tabCheckboxImg: "tab-checkbox-img",
    saveSessionInput: "session-name",
    saveSessionButton: "save-session",
    tabSelectAll: "tab-select-all",
    
    lightningSwitcher: "lightning-switcher"
  },
  defaultFaviconUrl: "img/default-favicon.png",
  tooltipToggleTimeOut: 5000,
  
  defaultPreferences: {
    lightningMode: false,
    quickSaveDefaultName: "Quicksave",
    addDateToQuickSaveName: true
  },
  
  // to restrict permissions update
  booleanPreferences: ["lightningMode"]
};