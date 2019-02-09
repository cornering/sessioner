/**
 * Created by David Nazaryan on 2/3/2019
 */

class Menu {
  constructor() {
    this.preferences = {...config.defaultPreferences};
  }
  //TODO make menu with configs
  
  // get configs from local storage
  syncPreferences() {
    // wrapping storage.sync callback function into promise
    return new Promise(resolve => {
      // get preferences from storage
      chrome.storage.local.get(config.menuStorage.preferences, storage => {
        // merge preferences storage with default preferences
        this.preferences = {...config.defaultPreferences, ...storage.preferences};
        
        console.log('####################');
        console.log(this.preferences );
        console.log('####################');
        
        resolve();
      });
    });
  }
  
  updatePreference(preference, value, doNotSave) {
    // restrict not boolean type update if value is not provided
    if (!value && config.booleanPreferences.indexOf(preference) === -1) return;
  
    // just toggle boolean if `value` is not provided
    this.preferences[preference] = value || !this.preferences[preference];
  
    if (!doNotSave) this.savePreferences();
  }
  
  // update preferences in localstorage
  savePreferences() {
    let updatePreferences = {};
    updatePreferences[config.menuStorage.preferences] = this.preferences;
    
    chrome.storage.local.set(updatePreferences, () => {
      console.log("preferences updated");
    });
  }
  
  getLightningSessionName() {
    // if addDateToLightningSaveName turned off just return default name
    if(!this.preferences.addDateToLightningSaveName) {
      return this.preferences.lightningSaveDefaultName;
    }
    
    // get today's date
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
  
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
  
    // return default name with today's date
    return this.preferences.lightningSaveDefaultName + " - " +mm+"/"+dd+"/"+yyyy;
  }
}

//TODO use modeIndex and array to save different settings for different names

const menu = new Menu();
