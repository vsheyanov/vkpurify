'use strict';

var settings = null;

initSettings();

$("#showRemovedAddLabel").change(function(){
    saveShowAdvRemovedMessage($("#showRemovedAddLabel").prop('checked'));
});

function notifyContent() {
    chrome.tabs.query({url: 'https://vk.com/*', currentWindow: true}, function(tabs) {
        tabs.forEach(function(tab){
            chrome.tabs.sendMessage(tab.id, {settingsUpdated : true, settings : settings}, function(response) {
                console.log(response);
            });
        });
    });
}

function updateUI() {
    $("#showRemovedAddLabel").attr('checked', settings.doShowAdvRemoved);
}

function initSettings(){
    chrome.storage.sync.get('settings', function(value){
        if (value.settings != null)
        {
            settings = value.settings;
            updateUI();
        }
    });
}

function saveShowAdvRemovedMessage(doShow){
    settings.doShowAdvRemoved = doShow;

    chrome.storage.sync.set({settings : settings}, function (){
        notifyContent();
    });
}

