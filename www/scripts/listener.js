

// we are prepared this time!
let isSetupDone = false;

const state = Vue.observable({
    isOnline: false,
    offlineAt: null,
    downlink: undefined,
    downlinkMax: undefined,
    effectiveType: undefined,
    saveData: undefined,
    type: undefined
});



let onOnline;
let onOffline;

function addListeners() {
  onOffline = () => {
    state.isOnline = false;
    state.offlineAt = new Date();
  };

  onOnline = () => {
    state.isOnline = true;
    state.offlineAt = null;
  };

  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
  if ('connection' in window.navigator) {
    window.navigator.connection.onchange = onChange;
  }
}

function updateConnectionProperties() {
    state.isOnline = window.navigator.onLine;
    state.offlineAt = state.isOnline ? null : new Date();
    // skip for non supported browsers.
    if (!('connection' in window.navigator)) {
        return;
    }

    state.downlink = window.navigator.connection.downlink;
    state.downlinkMax = window.navigator.connection.downlinkMax;
    state.effectiveType = window.navigator.connection.effectiveType;
    state.saveData = window.navigator.connection.saveData;
    state.type = window.navigator.connection.type;
    isSetupDone = true;
   
}

const onChange = () => updateConnectionProperties();