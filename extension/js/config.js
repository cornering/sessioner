/**
 * Created by David Nazaryan on 10/28/2018
 */

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
    settings: "settings"
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
    nthTooltip: ["first-tooltip", "second-tooltip", "third-tooltip"],
    
    tabListContainer: "tab-list-container",
    tabListUl: "tab-list",
    tabCheckbox: "tab-checkbox",
    tabCheckboxLabel: "tab-checkbox-label",
    tabCheckboxText: "tab-checkbox-text",
    tabCheckboxImg: "tab-checkbox-img",
    saveSessionInput: "session-name",
    saveSessionButton: "save-session",
    tabSelectAll: "tab-select-all",
    
    settingsContainer: "settings-container",
    lightningSwitcher: "lightning-switcher",
    lightningSwitcherInput: "lightning-switcher-input",
    lightningSessionInput: "lightning-session-name",
    booleanSettingsListUl: "boolean-settings-list",
    settingListCollapsing: "setting-collapsing",
    settingListCollapsed: "setting-collapsed",
    settingCheckbox: "setting-checkbox",
    settingCheckboxLabel: "setting-checkbox-label",
    lightningCheckbox: "lightning-checkbox",

    dialog: "dialog",
    dialogOpen: "dialog-open",
    dialogReject: "dialog-reject",
    dialogAccept: "dialog-accept",
    dialogContent: "dialog-content",
  },
  defaultFaviconUrl: "img/default-favicon.png",
  tooltipToggleTimeOut: 5000,
  
  defaultSettings: {
    lightningMode: false,
    lightningSaveDefaultName: "Quicksave",
    // 1st element is for standard made 2nd is for lightning
    noOverwriteMode: [false, true],
    turnOffTooltips: [false, true],
    // settings that can be applied to only one mode
    addDateToLightningName: true,
    closeTabsOnCreate: [false, true]
  },
  
  // object ot generate list of settings
  settingsList: [
    {
      id: "noOverwriteMode",
      title: "No overwrite mode",
      description: "Add number after new session name instead of overwriting the old one",
      standard: true,
      lightning: true,
    }, {
      id: "addDateToLightningName",
      title: "Add date in quick save",
      lightning: true,
      single: true
    }, {
      id: "turnOffTooltips",
      title: "Turn off tooltips",
      standard: true,
      lightning: true
    }, {
      id: "closeTabsOnCreate",
      title: "Close on session create",
      standard: true,
      lightning: true
    }
  ],
  
  // content that need to be modified in dialog before show
  // At this moment `action` used as `menu.actions[action]` object
  dialogContent: {
    resetConfigs: {
      action: "resetConfigs",
      acceptButton: "Reset",
      rejectButton: "Cancel",
      text: "Are you sure that you want to reset settings to default?"
    },
    clearSessions: {
      action: "clearSessions",
      acceptButton: "Clear",
      rejectButton: "Cancel",
      text: "Are you sure that you want to clear all sessions?"
    }
  },
};
