(function(self){
	"use strict";

	var videoClassNameRegex = /(_5mly|_5q0l)/;
	var profileVideoRegex = /uiVideoThumb/;

	document.addEventListener("mousedown", function(e){

		// Check if the clicked element is a facebook video node
		if( videoClassNameRegex.test(e.target.className) || (e.target.parentNode && profileVideoRegex.test(e.target.parentNode.className) ) ){

			// Temporarily allow the specific video that was clicked (= next request)
			chrome.runtime.sendMessage(chrome.i18n.getMessage("@@extension_id"), 'allowVideo');
		}
	});

})(this);