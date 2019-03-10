/**
 * Created by David Nazaryan on 10/28/2018
 */

class Tab {
  constructor() {
    this.allTabs = [];
  }
  
  // get all tabs of current chrome window
  setTabs() {
    // wrapping chrome.tabs.query callback function into promise
    return new Promise(resolve => {
      chrome.tabs.query({currentWindow: true}, allTabs => {
        this.allTabs = allTabs;
        // I always use to return resolve but in this case it's unnecessary
        return resolve();
      });
    });
  }
  
  get getAll() {
    // allTabs property is read only out of tab scope
    return [...this.allTabs];
  }
  
  // return tabs data using array of tab id's
  getTabsData(tabsId) {
    return this.allTabs.filter(currTab => {
      return tabsId.indexOf(currTab.id.toString()) !== -1;
    });
  }
  
  getTabsIds(tabs = null) {
    // return list of all current session tab ids
    if(!tabs) return this.allTabs.map(currTab => currTab.id);
    // on array of tab id's from given list
    return tabs.map(currTab => currTab.id);
  }
  
  closeSelectedTabs(tabIds) {
    // create empty tab to avoid chrome window close
    let createEmptyTab = false;
    if(tabIds.length === this.allTabs.length) createEmptyTab = true;
    // wrap chrome callback style actions inside promise
    return new Promise(resolve => {
      //resolve();
      // create an initial tab to avoid window close
      if(createEmptyTab) {
        // active false is used to avoid extension popup close (it closes when loses active status)
        chrome.tabs.create({active: false}, () => {
          // close all tabs except the new one
          chrome.tabs.remove(tabIds, () => {
            resolve();
          });
        });
      } else {
        // close all tabs except the new one
        chrome.tabs.remove(tabIds, () => {
          resolve();
        });
      }
    });
  }
}

const tab = new Tab();
