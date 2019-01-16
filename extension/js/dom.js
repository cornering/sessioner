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
    this.setSessionList(session.getAll);
    document.getElementById("wrapper").className = "wrapper default";
    this.highlightSessionButton();
    this.resizePopup();
  }
  
  // highlight session button and add tooltip
  highlightSessionButton() {
    // highlight first session list
    const highlightedSession = document.getElementsByClassName(config.elements.sessionListItem)[0];
    highlightedSession.classList.add(config.elements.sessionHighlighted);
    
    // show tooltip
    this._sessionAddTooltip.hidden = false;
    
    // hide tooltip after 2 secs
    setTimeout(() => {
      highlightedSession.classList.remove(config.elements.sessionHighlighted);
      this._sessionAddTooltip.hidden = true;
    }, config.newSessionHighlightTimeOut);
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
          // show remove tooltip and hide after 2 seq
          this._sessionRemoveTooltip.hidden = false;
          setTimeout(() => this._sessionRemoveTooltip.hidden = true, 2000);
        });
        break;
      case editAction:
        //TODO editAction
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
}

const DOM = new Dom();