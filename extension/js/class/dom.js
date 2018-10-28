/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

class Dom {
  constructor() {
    // get tab list container on init
    this._tabList = document.getElementById(config.elements.tabList);
    // save button to save the session
    this._saveButton = document.getElementById(config.elements.saveSessionButton);
    // default favicon used for pages that haven't their own favicon
    // chrome doesn't provide system pages favicon URL
    this._defaultFavicon = chrome.extension.getURL(config.defaultFaviconUrl);
    //TODO get system and extension favicons
  }
  
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
  
  // enable/disable save session button
  toggleSaveButton(enable) {
    // toggle button state if enable argument not provided
    if(enable === undefined) this._saveButton.disabled = !this._saveButton.disabled;
    else this._saveButton.disabled = !enable;
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
}

const DOM = new Dom();