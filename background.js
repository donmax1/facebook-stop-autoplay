(function(self){
	"use strict";

	// Retreive the ID of a video from it's URL
	function getVideoId(url){
		return url.match(/\/v\/(.*)\.mp4/)[1];
	}

	var blockVideoEnabled = true,
		allowAllVideos = false,
		allowedVideos = {};

	// Check if blocking was disabled by the user
	chrome.storage.sync.get('allowAllVideos', function( result ){

		// Save this setting (can be changed at runtime)
		allowAllVideos = result.allowAllVideos;

		// ------ CHANGE SETTINGS ------
		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

			// Change video blocking settings
			blockVideoEnabled = (message != "allowVideo");

			if( message == "blockAllVideos" ){
				allowAllVideos = false;
			}else if( message == "allowAllVideos" ){
				allowAllVideos = true;
			}
		});

		// ----------- VIDEO REQUESTS LISTENER ----------
		chrome.webRequest.onBeforeRequest.addListener(function(details) {

			if( allowAllVideos ){
				console.log("ALL ALLOWED");
				return { cancel : false };
			}

			// Is the video blocking is disabled, allow this URL for future requests
			if( !blockVideoEnabled ){
				allowedVideos[getVideoId(details.url)] = true;

				// Do not allow more videos after this one, until a new requests comes from the user
				blockVideoEnabled = true;

				console.log("TEMP ALLOWED");
				return { cancel : false };
			}

			// Else, do not block if this is a video that was alreayd played
			console.log("IT DEPENDS");
			return { cancel : !allowedVideos[getVideoId(details.url)] };
			
		}, {
			urls: [
				// These are URL patterns videos can come from
				'*://fbcdn-video-a.akamaihd.net/hvideo*',
				'*://*.xx.fbcdn.net/hvideo*'
			]
		}, ['blocking']);

	});

})(this);