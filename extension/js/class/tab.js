/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

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
    // allTabs property is read only out of Tab scope
    return [...this.allTabs];
  }
}

const tab = new Tab();