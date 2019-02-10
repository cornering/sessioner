/**
 * Created by David Nazaryan on 2/3/2019
 */

class Menu {
  constructor() {
    this.settings = {...config.defaultSettings};
  }
  //TODO make menu with configs
  
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
        this.settings = {...config.defaultSettings, ...storage.settings};
        
        console.log('####################');
        console.log(this.settings );
        console.log('####################');
        
        resolve();
      });
    });
  }
  
  updateSetting(setting, value, doNotSave) {
    if(typeof this.settings[setting] === "object") throw new Error("use updateModeSetting for update");
    // just toggle boolean if `value` is not provided
    this.settings[setting] = value;
  
    if (!doNotSave) this.saveSettings();
  }
  
  updateModeSetting(setting, value, mode, doNotSave) {
    if(Menu.MODE[mode] === undefined) throw new Error("wrong mode value");
  
    // update setting in single mode
    this.settings[setting][Menu.MODE[mode]] = value;
    
    if (!doNotSave) this.saveSettings();
  }
  
  // update settings in localstorage
  saveSettings() {
    let updateSettings = {};
    updateSettings[config.menuStorage.settings] = this.settings;
    
    chrome.storage.local.set(updateSettings, () => {
      console.log("settings updated");
    });
  }
  
  getLightningSessionName() {
    // if addDateToLightningName turned off just return default name
    if(!this.settings.addDateToLightningName) {
      return this.settings.lightningSaveDefaultName;
    }
    
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
}

//TODO use modeIndex and array to save different settings for different names

const menu = new Menu();
