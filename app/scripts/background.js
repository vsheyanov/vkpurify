'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);

    chrome.storage.sync.get('settings', function(value){
        if (value.settings == null)
        {
            console.log("Saving initial settings.");

            var settings = {
                doShowAdvRemoved : false
            };

            chrome.storage.sync.set({settings : settings}, function (){

            });
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId) {
    chrome.tabs.get(tabId, function (tab){
        if (tab.url.indexOf('https://vk.com') == 0)
            chrome.pageAction.show(tabId);
    })
});

// Opening options page was copied from
// http://adamfeuer.com/notes/2013/01/26/chrome-extension-making-browser-action-icon-open-options-page/

function openOrFocusOptionsPage() {
    var optionsUrl = chrome.extension.getURL('options.html');
    chrome.tabs.query({}, function(extensionTabs) {
        var found = false;
        for (var i=0; i < extensionTabs.length; i++) {
            if (optionsUrl == extensionTabs[i].url) {
                found = true;
                console.log("tab id: " + extensionTabs[i].id);
                chrome.tabs.update(extensionTabs[i].id, {"selected": true});
            }
        }
        if (found == false) {
            chrome.tabs.create({url: "options.html"});
        }
    });
}

// Called when the user clicks on the browser action icon.
chrome.pageAction.onClicked.addListener(function(tab) {
    openOrFocusOptionsPage();
});

/*
chrome.extension.onConnect.addListener(function(port) {
    var tab = port.sender.tab;
    // This will get called by the content script we execute in
    // the tab as a result of the user pressing the browser action.
    port.onMessage.addListener(function(info) {
        var max_length = 1024;
        if (info.selection.length > max_length)
            info.selection = info.selection.substring(0, max_length);
        openOrFocusOptionsPage();
    });
});
*/
