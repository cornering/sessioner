/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

class Dom {
  constructor() {
    /* ========================================
    // get tab list container on init
    this._tabList = document.getElementById(config.elements.tabList);
    // save button to save the session
    this._saveButton = document.getElementById(config.elements.saveSessionButton);
    // new session name
    this._saveInput = document.getElementById(config.elements.saveSessionInput);
    // default favicon used for pages that haven't their own favicon
    // chrome doesn't provide system pages favicon URL
    this._defaultFavicon = chrome.extension.getURL(config.defaultFaviconUrl);
    ======================================== */
    //TODO get system and extension favicons
    //TODO add jsDoc
    
    // ul of session list
    this._sessionListUl = document.getElementById(config.elements.sessionListUl);
  }
  
  static get SELECTION() {
    return {
      id: 0,
      class: 1,
      tab: 2
    };
  }
  
  toggleLoading(prefix, query, loading) {
    const element = document.querySelector(prefix+query);
    
    if(!element) return;
    if(loading) element.classList.add("loading");
    else element.classList.remove("loading");
  }
  
  setSessionList(list) {
    // string to generate HTML
    let listHtml = "";
    
    // loop over sessions
    list.forEach(sessionName => {
      // generating HTML string
      listHtml +=
        "<li session-name='"+sessionName+"' class='"+config.elements.sessionListItem+"'>"+
          "<i class='"+config.elements.drag+" material-icons mdl-color-text--deep-purple'>restore_page</i>"+
          "<span class='session-list-item-text'>"+sessionName+"</span>"+
        "</li>";
    });
    this._sessionListUl.innerHTML = listHtml;
    this.setListenerToElement(config.elements.sessionListItem, Dom.SELECTION.class, "click", this.openSession);
  }
  
  setListenerToElement(element_selector, type, action, listener_function) {
    if(type === Dom.SELECTION.id) {
      document.getElementById(element_selector).addEventListener(action, listener_function);
    } else if(type === Dom.SELECTION.class) {
      [...document.getElementsByClassName(element_selector)].map(element => {
        element.addEventListener(action, listener_function);
      });
    } else if(type === Dom.SELECTION.tab) {
      [...document.getElementsByTagName(element_selector)].map(element => {
        element.addEventListener(action, listener_function);
      });
    } else {
      throw new Error("Invalid selector type at setListenerToElement "+ element_selector);
    }
  }
  
  openSession(event) {
    const sessionName = event.target.getAttribute("session-name");
    
    if(sessionName === undefined) throw new Error("Session name not found");
    
    session.openSession(sessionName);
  }
  
  /*
  setTabList(allTabs) {
    let domTabList = "";
    // generating tab list DOM with loop
    allTabs.forEach(currTab => {
      let favIconUrl = currTab.favIconUrl || this._defaultFavicon;
      domTabList +=
        "<li>" +
          "<label class='"+config.elements.tabCheckboxLabel+"'>" +
            "<input value='"+currTab.id+"' class='"+config.elements.tabCheckbox+"' type='checkbox'>" +
            "<span class='"+config.elements.tabCheckboxBody+"' title='"+currTab.url+"'>" +
              "<img width='16' src='"+favIconUrl+"' alt='"+currTab.title+" favicon' title='"+currTab.title+"' />" +
            "&nbsp;"+currTab.title+"</span>" +
          "</label>" +
        "</li>";
    });
    
    // updating tab list container
    this._tabList.innerHTML = domTabList;
  }
  
  // enable/disable save session save button and input
  toggleSaveBlock(enable) {
    this._saveButton.disabled = !enable;
    this._saveInput.disabled = !enable;
  }
  
  // get selected tab ids from DOM
  getSelectedTabIds() {
    // get all tab checkboxes from DOM
    // [...] used to convert getElementsByClassName into array
    return [...document.getElementsByClassName(config.elements.tabCheckbox)].filter(checkbox => {
      // filtering checked ones
      return checkbox.checked;
    }).map(filteredCheckbox => {
      // we need only values, which is chrome tab ids
      return +filteredCheckbox.value;
    });
  }
  
  // get session name input value
  getSessionName() {
    return this._saveInput.value;
  }*/
}

const DOM = new Dom();