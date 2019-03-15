/**
 * Created by David Nazaryan on 2/3/2019
 */

class Menu {
  constructor() {
    this.settings = JSON.parse(JSON.stringify(config.defaultSettings));
  }
  
  static get MODE() {
    return {
      standard: 0,
      lightning: 1
    };
  }
  
  // get configs from local storage
  syncSettings() {
    // wrapping storage.sync callback function into promise
    return new Promise(resolve => {
      // get settings from storage
      chrome.storage.local.get(config.menuStorage.settings, storage => {
        // merge settings storage with default settings
        this.settings = JSON.parse(JSON.stringify({...config.defaultSettings, ...storage.settings}));
        resolve();
      });
    });
  }
  
  updateSetting(setting, value, doNotSave) {
    if(typeof this.settings[setting] === "object") throw new Error("Use updateModeSetting for update");
    // just toggle boolean if `value` is not provided
    this.settings[setting] = value;
  
    if (!doNotSave) this.saveSettings();
  }
  
  updateModeSetting(setting, value, mode, doNotSave) {
    if(Menu.MODE[mode] === undefined) throw new Error("Wrong mode value");
  
    // update setting in single mode
    this.settings[setting][Menu.MODE[mode]] = value;
    
    if (!doNotSave) this.saveSettings();
  }
  
  // update settings in localstorage
  saveSettings() {
    let updateSettings = {};
    updateSettings[config.menuStorage.settings] = this.settings;
    return new Promise(resolve => {
      chrome.storage.local.set(updateSettings, () => {
        console.log("settings updated");
        return resolve();
      });
    });
  }
  
  getLightningSessionName() {
    // if addDateToLightningName turned off just return default name
    if(!this.settings.addDateToLightningName) return this.settings.lightningSaveDefaultName;
    
    // get today's date
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
  
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
  
    // return default name with today's date
    return this.settings.lightningSaveDefaultName + " - " +mm+"/"+dd+"/"+yyyy;
  }
  
  getModeSetting(setting) {
    // return the setting it it's not mode-based config, or its single mode, it's an edge case
    if(typeof this.settings[setting] !== 'object') return this.settings[setting];
    // return setting value for current mode
    return this.settings[setting][(this.settings.lightningMode) ? 1 : 0];
  }
  
  resetConfigs() {
    // set settings to default without connecting them (deep copy)
    this.settings = JSON.parse(JSON.stringify(config.defaultSettings));
    // update reset settings in localstorage
    return this.saveSettings().then(() => {
      // set lightning mode switcher
      DOM.syncLightningSwitcher();
      // sync all settings in settings card
      DOM.syncSettings();
    });
  }
  
  // list of actions to run from dialog
  // arrow type functions used to avoid binding
  // and other classes existence checking
  actions = {
    resetConfigs: () => this.resetConfigs(),
    clearSessions: () => session.clearSessions(),
  };
}

const menu = new Menu();
