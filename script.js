// ==UserScript==
// @name         Colorful Dice Roll Results
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://app.roll20.net/editor/
// @grant        none
// @run-at   document-idle
// ==/UserScript==

(function() {
    'use strict';

    function GM_addStyle (cssStr) {
	    var D = document;
	    var newNode = D.createElement ('style');
	    newNode.textContent = cssStr;

	    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
	    targ.appendChild (newNode);
	}

    GM_addStyle ( `
	    .redresult {
	    	background-color: #ff0000 !important;
	    	border: 2px solid #920000 !important;
	    	color: white !important;
		}
	` );


	GM_addStyle ( `
    	.yellowresult {
		    background-color: #ffff00 !important;
		    border: 2px solid #aba500 !important;
		    color: black !important;
		}
	` );


	GM_addStyle ( `
	    .greenresult {
		    background-color: #00fb00 !important;
		    border: 2px solid #1c8c00 !important;
		    color: black !important;
		}
	` );


	GM_addStyle ( `
	    .whiteresult {
		    background-color: #ffffff !important;
		    border: 2px solid #b9b9b9 !important;
		    color: black !important;
		}
	` );

    function getBoundaries(text) {
        var parts = text.split(" ")[1].split("-")

        return [parseInt(parts[0]), parseInt(parts[1])];
    }

    function applyColor(resultNode) {
        var roll = parseInt(resultNode.innerText);

        // We need the structure to have 3 children, 1 being the ranks and another the result
        if(resultNode.parentElement.parentElement.parentElement.childElementCount !== 3) {
            return;
        }

        var ranksText = resultNode.parentElement.parentElement.parentElement.children[0].innerText.split("\n")

        if(ranksText.length != 5) {
            return;
        }

        // Ignore position 0
        var white = getBoundaries(ranksText[1]);
        var green = getBoundaries(ranksText[2]);
        var yellow = getBoundaries(ranksText[3]);
        var red = getBoundaries(ranksText[4]);

        var color = "";
        if(roll <= white[1]) {
            color = "whiteresult";
        }
        else if(roll <= green[1]) {
            color = "greenresult";
        }
        else if(roll <= yellow[1]) {
            color = "yellowresult";
        }
        else if(roll <= red[1]) {
            color = "redresult";
        }
        if(!resultNode.className.includes(color)) {
            resultNode.className += " " + color;
        }

    }

    function applyOnLoad() {
        var allRollResults = document.querySelectorAll(".inlinerollresult")
        allRollResults.forEach(result => applyColor(result));
    }

    function waitForLoad() {
        if(document.querySelectorAll(".userscript-commandintro").length > 0) {
            console.log("Page Loaded. Running Script.")
            setInterval(applyOnLoad, 1000)
        }
        else {
            console.log("Waiting for page to load.")
            setTimeout(waitForLoad, 1000)
        }
    }

    waitForLoad();

})();
