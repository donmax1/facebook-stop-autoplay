(function(self){
	"use strict";

	var blockVideoEnabled = true,
		allowAllVideos = false,
		autoReBlockTimeout,
		autoReBlockDelay = 12000; // milliseconds

	// Check if blocking was disabled by the user
	chrome.storage.sync.get('allowAllVideos', function( result ){

		// Save this setting (can be changed at runtime)
		allowAllVideos = result.allowAllVideos;

		// ------ CHANGE SETTINGS LISTENER ------
		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

			clearTimeout(autoReBlockTimeout);

			// Re-block all videos after a given delay
			if(message == "allowVideo"){
				autoReBlockTimeout = setTimeout(function(){
					blockVideoEnabled = true;
				}, autoReBlockDelay);
			}

			// Change video blocking settings
			blockVideoEnabled = (message != "allowVideo");

			// Change global settings
			if( message == "blockAllVideos" ){
				allowAllVideos = false;
			}else if( message == "allowAllVideos" ){
				allowAllVideos = true;
			}
		});

		// ----------- VIDEO REQUESTS LISTENER ----------
		chrome.webRequest.onBeforeRequest.addListener(function(details) {

			var url = details.url;

			if( allowAllVideos ){
				return { cancel : false };
			}

			// Is the video blocking is disabled, allow this URL for future requests
			if( !blockVideoEnabled ){

				// Do not allow more videos after this one, until a new requests comes from the user
				blockVideoEnabled = true;

				return { cancel : false };
			}

			// Else, do block videos and flash players
			var isVideo = url.indexOf("hvideo") != -1;
			var isFlash = url.indexOf(".swf") != -1;

			return { cancel : isVideo || isFlash };
			
		}, {
			urls: [
				// Videos can come from these URL patterns
				'*://fbcdn-video-a.akamaihd.net/hvideo*',
				'*://*.fbcdn.net/*'
			]
		}, ['blocking']);

	});

})(this);