/**
 * Created by David Nazaryan on 10/28/2018
 */

class Dom {
  constructor() {
    // list of selected tabs and session name
    this.selectedTabs = [];
    this.sessionName = "";
    
    // default favicon used for pages that haven't their own favicon
    // chrome doesn't provide system pages favicon URL
    this._defaultFavicon = chrome.extension.getURL(config.defaultFaviconUrl);
  
    // tooltip
    this._sessionAddTooltip = document.getElementById(config.elements.sessionAddTooltip);
    this._sessionRemoveTooltip = document.getElementById(config.elements.sessionRemoveTooltip);
    this._sessionUpdateTooltip = document.getElementById(config.elements.sessionUpdateTooltip);

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
    // lightning switcher(checkbox)
    this._lightningSwitcher = document.getElementById(config.elements.lightningSwitcher);
    // lightning mode session default name input
    this._lightningSessionInput = document.getElementById(config.elements.lightningSessionInput);
    // boolean settings list
    this._booleanSettingsListUl = document.getElementById(config.elements.booleanSettingsListUl);
    // dialog modal element
    this._dialog = document.getElementById(config.elements.dialog);
    // elements inside dialog
    this._dialogContent = document.getElementById(config.elements.dialogContent);
    this._dialogAccept = document.getElementById(config.elements.dialogAccept);
    this._dialogReject = document.getElementById(config.elements.dialogReject);
    
    // cards status
    this.cardsLock = {
      "new-session": false,
      "settings": false,
      "default": false
    };
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
    // getting right card class for button
    const wrapper_class = target.getAttribute("card") || target.parentNode.getAttribute("card");
    if (!wrapper_class) return;
    
    // prevent action if card locked
    if(this.cardsLock[wrapper_class]) return;
  
    // moving wrapper to right card using css classes
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
          `<i title="delete" class="session-remove ${config.elements.drag} material-icons">delete</i>` +
        `</li>`;
    });
    this._sessionListUl.innerHTML = listHtml;
    
    // add events to generated elements
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
  saveSessionCallback(updated) {
    // update sessions list
    this.setSessionList(session.getAll);
    // move popup view to default card
    document.getElementById("wrapper").className = "wrapper default";
    this.resizePopup();
    // show tooltip, update or add tooltip, depends on `updated`
    if(updated) this.toggleTooltip(this._sessionUpdateTooltip);
    else this.toggleTooltip(this._sessionAddTooltip);
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
    // const editAction = target.classList.contains("session-edit");
    
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
      /*case editAction:
        // deprecated action
        console.log('--------------------');
        console.log('edit!');
        console.log('--------------------');
        break;*/
      default:
        // open new session
        session.openSession(element.getAttribute("session-name")).then(() => {
          console.log("session opened");
        });
    }
  }
  
  toggleTooltip(element) {
    // turn off tooltips setting
    const turnOffTooltips = menu.settings.turnOffTooltips[(menu.settings.lightningMode) ? 1 : 0];
    if(turnOffTooltips) return;
    
    // detect if current tooltip is already shown
    if(element.classList.contains(config.elements.showTooltipClass)) {
      // add a count in tooltip counter and show it
      element.childNodes[1].innerHTML = ++element.childNodes[1].innerHTML;
      element.classList.add(config.elements.tooltipWithCounter);
    } else {
      // add the nth class to tooltip to dont overflow other ones
      config.elements.nthTooltip.some(nth => {
        if(!document.getElementsByClassName(nth).length) {
          element.classList.add(nth);
          return true;
        }
        return false;
      });
    }
    
    // show tooltip using class
    element.classList.add(config.elements.showTooltipClass);
    // remove tooltip show class after `tooltipToggleTimeOut` and clear tooltip
    const counter = +element.childNodes[1].innerHTML;
    setTimeout(() => {
      if(counter !== +element.childNodes[1].innerHTML) return;
      // hide tooltip
      element.classList.remove(config.elements.showTooltipClass);
    }, config.tooltipToggleTimeOut);
  }
  
  hideTooltip(target) {
    // select tooltip container
    const element = target.classList.contains(config.elements.sessionTooltip) ? target : target.parentNode;
    
    // check if tooltip has shown
    if(!element.classList.contains(config.elements.showTooltipClass)) return;
    
    // hide tooltip
    element.classList.remove(config.elements.showTooltipClass);
  }
  
  resetTooltip(target) {
    // select tooltip container
    const element = target.classList.contains(config.elements.sessionTooltip) ? target : target.parentNode;
  
    // check if tooltip is hidden
    if(element.classList.contains(config.elements.showTooltipClass)) return;
  
    // reset tooltip counter
    element.childNodes[1].innerHTML = 1;
    // reset tooltip
    element.className = config.elements.sessionTooltip;
  }
  
  syncLightningSwitcher() {
    // sync lightning mode switcher with localstorage data
    // setTimeout to work after render
    setTimeout(() => {
      if(menu.settings.lightningMode) this._lightningSwitcher.MaterialSwitch.on();
      else this._lightningSwitcher.MaterialSwitch.off();
    });
  }
  
  syncSettings() {
    // sync lightning mode default name with localstorage data
    this._lightningSessionInput.value = menu.settings.lightningSaveDefaultName;
    
    // generate boolean settings list
    let settingsListHtml = "";
    // loop through boolean settings
    config.settingsList.forEach(setting => {
      // generating the list, UGLY way
      settingsListHtml +=
      `<li ${(setting.description ? `class="${config.elements.settingListCollapsing}"` : ``)}>` +
        `${(setting.description ?
          `<i class="material-icons keyboard-arrow-down">keyboard_arrow_down</i>` +
          `<i class="material-icons keyboard-arrow-up">keyboard_arrow_up</i>`
          : ``
        )}` +
        `<span class="setting-title">${setting.title}</span>` +
        `<div class="setting-actions">` +
          `${(setting.standard ?
            `<label class="${config.elements.settingCheckboxLabel}">` +
              `<input type="checkbox" class="${config.elements.settingCheckbox}" setting="${setting.id}"` +
              `${(setting.single ?
                  (menu.settings[setting.id] ? ` checked ` : ``)
                : (menu.settings[setting.id][0] ? ` checked ` : ``)
              )}` +
              `${(setting.single ? `single="true"` : ``)}` +
              `>` +
              `<div class="material-checkboxes">`+
                `<i class="material-checkbox material-checked material-icons">check_box</i>` +
                `<i class="material-checkbox material-not-checked material-icons">check_box_outline_blank</i>` +
              `</div>` +
            `</label>`
            : `<span class="no-setting">-</span>`
              )}` +
          `${(setting.lightning ?
            `<label class="${config.elements.settingCheckboxLabel} ${config.elements.lightningCheckbox}">` +
              `<input type="checkbox" class="${config.elements.settingCheckbox}" setting="${setting.id}"` +
              `${(setting.single ?
                  (menu.settings[setting.id] ? ` checked ` : ``)
                : (menu.settings[setting.id][1] ? ` checked ` : ``)
              )}` +
              `${(setting.single ? `single="true"` : ``)}` +
              `>` +
              `<div class="material-checkboxes">`+
                `<i class="material-checkbox material-checked material-icons">check_box</i>` +
                `<i class="material-checkbox material-not-checked material-icons">check_box_outline_blank</i>` +
              `</div>` +
            `</label>`
            : `<span class="no-setting">-</span>`
          )}` +
        `</div>` +
        `${(setting.description ?
          `<span class="setting-description">${setting.description}</span>`
          : ``
        )}` +
      `</li>`
    });
    // update DOM
    this._booleanSettingsListUl.innerHTML = settingsListHtml;
    
    // add collapse event
    [...document.getElementsByClassName(config.elements.settingListCollapsing)].forEach(
      element => element.addEventListener("click", () => this.toggleCollapseSetting(element))
    );
    
    // add settings update event on checkboxes
    [...document.getElementsByClassName(config.elements.settingCheckbox)].forEach(
      element => element.addEventListener("change", () => this.updateSetting(element))
    );
  
    // update MDL styles ( f**king MDL uses js for checkbox styles )
    //setTimeout(() => { if(componentHandler) componentHandler.upgradeDom(); }, 0);
  }
  
  toggleCollapseSetting(element) {
    element.classList.toggle(config.elements.settingListCollapsed);
    this.resizePopup();
  }
  
  updateSetting(element) {
    if(element.getAttribute("single")) {
      menu.updateSetting(element.getAttribute("setting"), element.checked)
    } else {
      const mode = element.parentNode.classList.contains(config.elements.lightningCheckbox) ?
        "lightning" : "standard";
      menu.updateModeSetting(element.getAttribute("setting"), element.checked, mode)
    }
  }
  
  prepareAndOpenDialog(target) {
    // get action from element and and action content from configs
    const action = target.getAttribute("prepare-action");
    const dialogContent = config.dialogContent[action];
    if(!action || !dialogContent) return;
    
    // update dialog elements
    this._dialogContent.innerText = dialogContent.text;
    this._dialogReject.innerText = dialogContent.rejectButton || "Reject";
    this._dialogAccept.innerText = dialogContent.acceptButton || "Accept";
    this._dialogAccept.setAttribute("accept-action", dialogContent.action);
    // show dialog modal
    this._dialog.showModal();
  }
  
  closeDialog() {
    // close showed dialog
    this._dialog.close();
  }
  
  acceptAction() {
    // get action to do
    const action = this._dialogAccept.getAttribute("accept-action");
    
    // wait for action to complete
    menu.actions[action]().then(() => {
      // close the dialog
      this.closeDialog();
      // remove loading state from dialog
      this.toggleLoading(
        config.prefixes.id,
        config.elements.dialog,
        false
      );
    });
  }
}

const DOM = new Dom();
