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