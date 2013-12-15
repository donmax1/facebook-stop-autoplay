// This triggers everytime the user clicks on the extension icon
(function(self){
	"use strict";

	// Toggle settings when clicking on the extension icon
	document.addEventListener('DOMContentLoaded', function() {
		chrome.storage.sync.get('allowAllVideos', function( result ){

			result.allowAllVideos = !result.allowAllVideos;

			chrome.storage.sync.set({ 'allowAllVideos' : result.allowAllVideos });

			// Change icon and popup message
			if( result.allowAllVideos ){
				chrome.browserAction.setIcon({ path: 'icon48.disabled.png' });
			}else{
				chrome.browserAction.setIcon({ path: 'icon48.png' });
			}

			// Send the new settings to the background script
			chrome.runtime.sendMessage(
				chrome.i18n.getMessage("@@extension_id"),
				result.allowAllVideos ? 'allowAllVideos' : 'blockAllVideos'
			);

			// Display a message on the popup HTML
			document.getElementById("message").innerHTML = "Autoplay videos are <strong>" + (result.allowAllVideos ? "allowed" : "blocked") + "</strong>";
		});
		
	});

})(this);