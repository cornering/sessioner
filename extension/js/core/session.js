/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

class Session {
  constructor() {
    this.allSessions = [];
  }
  
  static get MODE() {
    return {
      create: 0,
      update: 1,
      delete: 2
    };
  };
  
  // get the list of sessions
  syncSessionList() {
    // wrapping storage.sync callback function into promise
    return new Promise(resolve => {
      // get sessions list from storage
      chrome.storage.sync.get("sessions", storage => {
        this.allSessions = storage.sessions || [];
        resolve();
      });
    });
  }
  
  get getAll() {
    // allSessions is read only
    return [...this.allSessions];
  }
  
  // save tabs in chrome local storage
  saveSession(tabs, name) {
    // building set data
    const setData = {};
    
    let mode = Session.MODE.update;
    // adding new session to sessions list if it's not exists
    if(this.allSessions.indexOf(name) === -1) {
      mode = Session.MODE.create;
      setData.sessions = [...this.allSessions, name];
    }
    
    // to provide dynamic session name
    // session_ prefix added to avoid extension configs overwriting
    setData["session_"+name] = tabs;
    
    // wrapping storage.sync callback function into promise
    return new Promise(resolve => {
      // save new session and update sessions list
      chrome.storage.sync.set(setData, () => {
        // push session name to list after success, if new session added
        if(mode === Session.MODE.create) this.allSessions.push(name);
        resolve();
      });
    });
  }
  
  // open saved session
  openSession(name) {
    // getting session from chrome local storage
    chrome.storage.sync.get("session_"+name, storage => {
      console.log('####################');
      console.log(storage);
      console.log('####################');
    });
  }
}

//TODO add remove and clear functions
//TODO save tabs count and index inside sessions list object

const session = new Session();