/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

class Dom {
  constructor() {
    // list of selected tabs and session name
    this.selectedTabs = [];
    this.sessionName = "";
    
    // default favicon used for pages that haven't their own favicon
    // chrome doesn't provide system pages favicon URL
    this._defaultFavicon = chrome.extension.getURL(config.defaultFaviconUrl);
    //TODO get system and extension favicons
  
    // tooltip
    this._sessionAddTooltip = document.getElementById(config.elements.sessionAddTooltip);
    this._sessionRemoveTooltip = document.getElementById(config.elements.sessionRemoveTooltip);

    // body and html
    this._html = document.documentElement;
    this._body = document.body;
  
    // wrapper element
    this._app = document.getElementById(config.elements.app);
    // wrapper element
    this._wrapper = document.getElementById(config.elements.wrapper);
    
    // ul of session list
    this._sessionListUl = document.getElementById(config.elements.sessionListUl);
    // ul of tab list
    this._tabListUl = document.getElementById(config.elements.tabListUl);
    // save button to save the session
    this._saveButton = document.getElementById(config.elements.saveSessionButton);
    // new session input
    this._saveInput = document.getElementById(config.elements.saveSessionInput);
    // all tabs element
    this._tabSelectAll = document.getElementById(config.elements.tabSelectAll);
  }
  
  static get SELECTION() {
    return {
      id: 0,
      class: 1,
      tab: 2
    };
  }
  
  // dynamically change popup window height
  resizePopup() {
    // select current card height
    const height = document.getElementsByClassName(this._wrapper.classList[1]+"-card")[0].offsetHeight+"px";
    this._app.style.height = height;
    
    // change body nd html height as well
    this._html.style.height = height;
    this._body.style.height = height;
  }
  
  toggleCard(target) {
    const wrapper_class = target.getAttribute("card") || target.parentNode.getAttribute("card");
    if (!wrapper_class) return;
  
    this._wrapper.className = "wrapper " + wrapper_class;
    this.resizePopup();
  }
  
  // add loader class to element
  toggleLoading(prefix, query, loading) {
    const element = document.querySelector(prefix+query);
    
    if(!element) return;
    if(loading) element.classList.add(config.elements.loading);
    else element.classList.remove(config.elements.loading);
  }
  
  setSessionList(list) {
    // string to generate HTML
    let listHtml = "";
    
    // loop over sessions
    list.forEach(sessionName => {
      // escape double quot
      sessionName = sessionName.replace(/"/g, "&quot;");
      
      // generating HTML string
      listHtml +=
        `<li session-name="${sessionName}" class="${config.elements.sessionListItem}">` +
          `<i class="${config.elements.drag} material-icons mdl-color-text--deep-purple">restore_page</i>` +
          `<span class="session-list-item-text">${sessionName}</span>` +
          //`<i class="session-update ${config.elements.drag} material-icons">update</i>` +
          //`<i class="session-edit ${config.elements.drag} material-icons">edit</i>` +
          `<i class="session-remove ${config.elements.drag} material-icons">delete</i>` +
        `</li>`;
    });
    this._sessionListUl.innerHTML = listHtml;
    
    [...document.getElementsByClassName(config.elements.sessionListItem)].forEach(
      element => element.addEventListener("click", e => this.sessionAction(element, e.target))
    );
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
  
  setTabList(allTabs) {
    // string to save generated HTML
    let listHtml = "";
    
    // generating tab list DOM with loop
    allTabs.forEach(currTab => {
      // use default fav icon if icon is not exists
      let favIconUrl = currTab.favIconUrl || this._defaultFavicon;
      // generating html row
      listHtml +=
        `<li>` +
          `<input id="${currTab.id}" value="${currTab.id}" class="${config.elements.tabCheckbox}" type="checkbox">` +
          `<label for="${currTab.id}" class="${config.elements.tabCheckboxLabel}">` +
            `<i class="material-checkbox material-not-checked material-icons">check_box_outline_blank</i>` +
            `<i class="material-checkbox material-checked material-icons">check_box</i>` +
            `<img class="${config.elements.tabCheckboxImg}" width="16" src="${favIconUrl}" alt="${currTab.title} favicon" title="${currTab.title}" />` +
            `<span class="${config.elements.tabCheckboxText}" title="${currTab.url}">` +
              `&nbsp;${currTab.title}` +
            `</span>` +
          `</label>` +
        `</li>`;
    });
    
    // updating tab list container
    this._tabListUl.innerHTML = listHtml;
  }
  
  setSelectedTabs() {
    this.selectedTabs = [...document.getElementsByClassName(config.elements.tabCheckbox)].filter(
      tabCheckbox => tabCheckbox.checked
    ).map(tabCheckbox => tabCheckbox.value);
  
    if(this.selectedTabs.length) this._tabSelectAll.classList.add("tab-deselect-all");
    else this._tabSelectAll.classList.remove("tab-deselect-all");
  }
  
  setSessionName(value = "") {
    this.sessionName = value;
  }
  
  // enable/disable save session save button
  toggleSaveButton() {
    this._saveButton.disabled = !(this.selectedTabs.length && this.sessionName.length);
  }
  
  resetNewSessionForm() {
    // reset tab list
    this.setSelectedTabs();
    
    // reset select all tabs button
    this._tabSelectAll.classList.remove("tab-deselect-all");
    
    // remove input text
    this.setSessionName();
    this._saveInput.value = "";
    // focus input, card toggle animation took 150ms
    setTimeout(() => this._saveInput.focus(), 151);
  }
  
  // thinks to do after session save
  saveSessionCallback() {
    // update sessions list
    this.setSessionList(session.getAll);
    // move popup view to default card
    document.getElementById("wrapper").className = "wrapper default";
    this.resizePopup();
    // show and hide session added tooltip
    this.toggleTooltip(this._sessionAddTooltip);
  }
  
  // toggle select all tabs button state
  toggleSelectAll() {
    const deselect = this._tabSelectAll.classList.contains("tab-deselect-all");
    [...document.getElementsByClassName(config.elements.tabCheckbox)].forEach(element => {
      element.checked = !deselect;
    });
    // update selected tab list
    this.setSelectedTabs();
    
    // update form button state
    this.toggleSaveButton();
  }
  
  sessionAction(element, target) {
    // detect if remove icon clicked
    const removeAction = target.classList.contains("session-remove");
    const editAction = target.classList.contains("session-edit");
    
    switch (true) {
      case removeAction:
        // remove current session
        session.removeSession(element.getAttribute("session-name")).then(() => {
          // remove removed session element
          element.remove();
          this.resizePopup();
          // show remove tooltip and hide
          this.toggleTooltip(this._sessionRemoveTooltip);
        });
        break;
      case editAction:
        //TODO editAction
        //TODO deprecated action
        console.log('--------------------');
        console.log('edit!');
        console.log('--------------------');
        break;
      default:
        // open new session
        session.openSession(element.getAttribute("session-name")).then(() => {
          console.log("session opened");
        });
    }
  }
  
  toggleTooltip(element) {
    // select list of shown tooltips
    const shownTooltips = document.getElementsByClassName(config.elements.showTooltipClass);

    // check if one of tooltips are showed
    if(shownTooltips.length) {
      if(shownTooltips.length === 2 || shownTooltips[0].id === element.id) {
        // if same tooltip is showed just add number to it
        element.childNodes[1].innerHTML = ++element.childNodes[1].innerHTML;
        element.classList.add(config.elements.tooltipWithCounter);
      } else if(!shownTooltips[0].classList.contains(config.elements.secondTooltip)){
        // if other tooltip is showed add this one behind them
        element.classList.add(config.elements.secondTooltip);
      }
    }
    //TODO work with tooltip sizes
    
    // show tooltip using class
    element.classList.add(config.elements.showTooltipClass);
    // remove tooltip show class after `tooltipToggleTimeOut` and clear tooltip
    const counter = +element.childNodes[1].innerHTML;
    setTimeout(() => {
      if(counter !== +element.childNodes[1].innerHTML) return;
      // reset tooltip counter
      element.childNodes[1].innerHTML = 0;
      // reset and hide tooltip
      element.className = config.elements.sessionTooltip;
    }, config.tooltipToggleTimeOut);
  }
  
  hideTooltip(target) {
    // select tooltip container
    const element = target.classList.contains(config.elements.sessionTooltip) ? target : target.parentNode;
    
    // check if tooltip has shown
    if(element.classList.contains(config.elements.showTooltipClass)) {
      // reset tooltip counter
      element.childNodes[1].innerHTML = 0;
      // reset and hide tooltip
      element.className = config.elements.sessionTooltip;
    }
  }
}

const DOM = new Dom();