(function(self){
	"use strict";

	var videoClassNameRegex = /(_5mly|_5q0l)/,
		videoURLRegex = /photo\.php/;

	document.addEventListener("click", function(e){

		// Check if the clicked element is a facebook video node, or if we are playing the video in full screen
		if( videoClassNameRegex.test(e.target.className) || videoURLRegex.test(window.location.href) ){

			// Temporarily allow the specific video that was clicked (= next request)
			chrome.runtime.sendMessage(chrome.i18n.getMessage("@@extension_id"), 'allowVideo');
		}
	});

})(this);