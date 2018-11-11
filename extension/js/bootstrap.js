/**
 * Created by David Nazaryan on 10/28/2018
 */
'use strict';

// sync the list of saved sessions
session.syncSessionList().then(() => {
  DOM.setSessionList(session.getAll);
  DOM.toggleLoading(
    config.prefixes.class,
    config.elements.sessionListContainer,
    false
  );
});

// new session creation action
//DOM.setListenerToElement(config.elements.newSession, Dom.SELECTION.id, "click", event => {

//});

// card-wrapper toggling system
DOM.setListenerToElement(config.elements.toggleCard, Dom.SELECTION.class, "click", event => {
  const wrapper_class = event.target.getAttribute("card") || event.target.parentNode.getAttribute("card");
  if(wrapper_class) {
    document.getElementById("wrapper").className = "wrapper " + wrapper_class;
  }
});