/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

class Session {
  constructor() {
    this.allSessions = [];
  }
  
  // get the list of sessions
  syncSessionList() {
    // wrapping storage.sync callback function into promise
    return new Promise(resolve => {
      // get sessions list from storage
      chrome.storage.local.get("sessions", storage => {
        this.allSessions = storage.sessions ? storage.sessions.reverse() : [];
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
    
    // move updated session to top of sessions if it's exists
    let sessionIndex = this.allSessions.indexOf(name);
    if(sessionIndex !== -1) this.allSessions.splice(sessionIndex, 1);
    setData.sessions = [...this.allSessions, name];
    
    // to provide dynamic session name
    // session_ prefix added to avoid extension configs overwriting
    setData["session_"+name] = {
      tabs: tabs.map(t => {
        return {
          index: t.index,
          url: t.url,
          active: t.active,
          pinned: t.pinned
        }
      })
    };
    
    // wrapping storage.local.set callback function into promise
    return new Promise(resolve => {
      // save new session and update sessions list
      chrome.storage.local.set(setData, () => {
        // push session name to list after success, if new session added
        this.allSessions.unshift(name);
        resolve();
      });
    });
  }
  
  // open saved session
  openSession(name) {
    // wrapping storage.local.get callback function into promise
    return new Promise(resolve => {
      // getting session from chrome local storage
      chrome.storage.local.get("session_"+name, storage => {
        // sort pinned and not pinned tabs
        const pinnedTabs = [], initTabUrls = [];
        storage["session_"+name].tabs.forEach(t => {
          if(t.pinned) pinnedTabs.push(t);
          else initTabUrls.push(t.url);
        });
        // create new window with initTabs
        chrome.windows.create({url: initTabUrls, state: "maximized"}, newWindow => {
          if(!pinnedTabs.length) return resolve();
  
          const pinnedTabPromises = [];
          // open pinned tabs if there exists
          // chrome API doesn't provide new window creation with pinned tabs inside
          pinnedTabs.forEach(t => {
            // push pinned tab creation wrapped promise
            pinnedTabPromises.push(new Promise(res => {
              chrome.tabs.create({...t, windowId: newWindow.id}, () => res());
            }));
          });
          // resolve function when all pinned tabs opened
          Promise.all(pinnedTabPromises).then(() => resolve());
        });
      });
    });
  }
  
  removeSession(name) {
    // remove session from sessions list
    let sessionIndex = this.allSessions.indexOf(name);
    if(sessionIndex !== -1) this.allSessions.splice(sessionIndex, 1);
  
    // update session list and delete session actions wrapped in promise
    return Promise.all([
      new Promise(resolve => {
        chrome.storage.local.set({sessions:this.allSessions}, () => resolve());
        chrome.storage.local.remove("session_"+name, () => resolve());
      })
    ]);
  }
}

//TODO add remove and clear functions
//TODO save tabs count and index inside sessions list object

const session = new Session();