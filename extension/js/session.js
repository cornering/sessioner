/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

// save current session in chrome local storage
const sessionSave = () => {
  chrome.tabs.query(null, tabList => {
    console.log('^^^^^^^^^^^^^^^^^^^^');
    console.log(tabList);
    console.log('^^^^^^^^^^^^^^^^^^^^');
  });
};