/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

// on extension init (works once)
chrome.runtime.onInstalled.addListener(() => {
  // getting info about extension
  chrome.management.getSelf(info => {
    // works on dev environment
    if(info.installType === "development") {
      // adding option in content menu to open extension in new tab (for easy debug)
      chrome.contextMenus.create({
        "type": "normal",
        "id": "showFullPage",
        "title": "Open Extension in new tab",
        "contexts": ["browser_action"]
      });
    }
  });
  
  // clear storage
  //chrome.storage.sync.clear();
});

// works on context menu item click
chrome.contextMenus.onClicked.addListener(info => {
  // open extension in new tab on `Open Extension in new tab` option click
  if(info.menuItemId === "showFullPage") {
    chrome.tabs.create({url: chrome.extension.getURL("html/material.html#window")});
    //chrome.tabs.create({url: chrome.extension.getURL("html/index.html#window")});
  }
});