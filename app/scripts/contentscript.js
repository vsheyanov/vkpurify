'use strict';

var _classes    = ['ads_ads_news_wrap'];
var _attributes = ['data-ads', 'data-ad-view', 'data-ad'];

var _settings;

chrome.storage.sync.get('settings', function (storage){
    _settings = storage.settings;
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.settingsUpdated == true)
            updateSettings(request.settings);
    });

var _feed = null;

function observeBodyToFindFeed(){

    var page_body = document.querySelector('#wrap3');

    var observer = new MutationObserver(function(mutations){

        var feedFound = false;

        mutations.forEach(function(mutation) {
            var feeds = $(mutation.target).find('#feed_wall');
            if (feeds.length == 1
                && $(feeds).find('.post').length > 0){
                feedFound = true;
            }
        });

        if (feedFound && _feed == null){
            console.log("Found feed, starting ads tracking!");

            _feed = document.querySelector('#feed_wall');

            startFeedTracking();
        } else {
            _feed = null;

            stopFeedTracking();
        }
    });

// configuration of the observer:
    var config = { childList: true};

// pass in the target node, as well as the observer options
    observer.observe(page_body, config);
}

var _feedObserver = null;;

function observeFeed(){

    var feed = document.querySelector('#feed_wall');

    _feedObserver = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0){
                for (var i = 0; i < mutation.addedNodes.length; i++){
                    if ($(mutation.addedNodes[i]).hasClass('feed_row')){
                        clearAd(mutation.addedNodes[i]);
                    }
                }
            }
        });
    });

// configuration of the observer:
    var config = { childList: true, subtree : true};

// pass in the target node, as well as the observer options
    _feedObserver.observe(feed, config);
}

function stopFeedTracking(){
    if (!_feedObserver)
        return;

    _feedObserver.disconnect();
    _feedObserver = null;
}

function startFeedTracking(){

    clearAds();

    observeFeed();
}


function updateSettings(settings) {
    _settings = settings;

    if (_settings.doShowAdvRemoved){
        $('.adv-removed-message').show();
    } else {
        $('.adv-removed-message').hide();
    }
}

function clearAd(feedRowHtmlElement){
    var divs = $(feedRowHtmlElement).find('div');

    var isAdv = false;

    $(divs).each(function(index, div){
        _classes.forEach(function(_class){
            if ($(div).hasClass(_class))
            {
                isAdv = true;
            }
        });
        _attributes.forEach(function(_attribute){
            if (div.getAttribute(_attribute) != null)
            {
                isAdv = true;
            }
        });
    });

    if (isAdv){
        console.log("Adv removed");
        var $advSign = $('<p class="adv-removed-message" style="background-color: #0b97c4; color: white; padding: 10px">Very annoying post was here (click to show).</p>');
        var $adv = $(feedRowHtmlElement);
        $advSign.insertBefore($adv);

        $adv.toggle();
        $advSign.click(function(){
            $adv.toggle();
        });

        if (!_settings || !_settings.doShowAdvRemoved)
            $advSign.toggle();
    }
}

function clearAds(){
    $('.feed_row').each(function(index, element){
        clearAd(element);
    });
}

observeBodyToFindFeed();

if (document.querySelector('#feed_wall')){
    startFeedTracking();
}