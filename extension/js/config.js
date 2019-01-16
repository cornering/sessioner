/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

// to save all system variables (like element ID's) in one place
const config = {
  prefixes: {
    id: "#", class: ".", tab: ""
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
    sessionHighlighted: "session-highlighted",
    sessionAddTooltip: "session-add-tooltip",
    sessionRemoveTooltip: "session-remove-tooltip",
    
    tabListContainer: "tab-list-container",
    tabListUl: "tab-list",
    tabCheckbox: "tab-checkbox",
    tabCheckboxLabel: "tab-checkbox-label",
    tabCheckboxText: "tab-checkbox-text",
    tabCheckboxImg: "tab-checkbox-img",
    saveSessionInput: "session-name",
    saveSessionButton: "save-session",
    tabSelectAll: "tab-select-all"
  },
  defaultFaviconUrl: "img/default-favicon.png",
  newSessionHighlightTimeOut: 2000
};