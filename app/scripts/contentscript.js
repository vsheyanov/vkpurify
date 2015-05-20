'use strict';

var _classes    = ['ads_ads_news_wrap'];
var _attributes = ['data-ads'];

var _settings;

chrome.storage.sync.get('settings', function (storage){
    _settings = storage.settings;

    clearAds();
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.settingsUpdated == true)
            updateSettings(request.settings);
    });

$('#feed_rows').on("DOMNodeInserted", function(event){
    if (!_settings)
        return;

    var currentTarget = event.target;

    if ($(event.target).hasClass('feed_row')){
        clearAd(currentTarget);
    }
});

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

        $adv.hide();
        $advSign.click(function(){
            $adv.toggle();
        });

        if (!_settings.doShowAdvRemoved)
            $advSign.hide();
    }
}

function clearAds(){
    $('.feed_row').each(function(index, element){
        clearAd(element);
    });
}



