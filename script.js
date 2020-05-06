// ==UserScript==
// @name         Colorful Dice Roll Results
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tampermonkey script to color the dice rolls results.
// @author       Bruno Lima
// @match        https://app.roll20.net/editor/
// @grant        none
// @run-at       document-idle
// @downloadURL  https://raw.githubusercontent.com/BrunoRomes/Roll20ColorfulDiceRolls/master/script.js
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

    function getLowerBoundary(text) {
        var parts = text.split(" ")[1].split("-")

        return parseInt(parts[0])
    }

    function classifyRoll(resultNode) {
        var roll = parseInt(resultNode.innerText);

        // We need the structure to have 3 children, 1 being the ranks and another the result
        if(resultNode.parentElement.parentElement.parentElement.childElementCount !== 3) {
            return;
        }

        // If the node has already been applied a color, do nothing
        if(resultNode.className.includes("whiteresult") ||
          resultNode.className.includes("greenresult") ||
          resultNode.className.includes("yellowresult") ||
          resultNode.className.includes("redresult") ) {
            return;
        }

        var ranksText = resultNode.parentElement.parentElement.parentElement.children[0].innerText.split("\n")

        // If the ranks text does not have 5 lines (rank, white, green, yellow and red results), do nothing
        if(ranksText.length != 5) {
            return;
        }

        // Ignore position 0
        var whiteMin = getLowerBoundary(ranksText[1]);
        var greenMin = getLowerBoundary(ranksText[2]);
        var yellowMin = getLowerBoundary(ranksText[3]);
        var redMin = getLowerBoundary(ranksText[4]);

        var color = "";
        if(roll >= redMin) {
            color = " redresult";
        }
        else if(roll >= yellowMin) {
            color = " yellowresult";
        }
        else if(roll >= greenMin) {
            color = " greenresult";
        }
        else {
            color = " whiteresult";
        }

        resultNode.className += color;
    }

    function classifyDiceRolls() {
        var allRollResults = document.querySelectorAll(".inlinerollresult")
        allRollResults.forEach(result => classifyRoll(result));
        // Waits before trying to classify again
        setTimeout(classifyDiceRolls, 1000)
    }

    function waitForPageLoad() {
        // Waits for the page to fully load to start classifying dice rolls
        if(document.querySelectorAll(".userscript-commandintro").length > 0) {
            console.log("Page Loaded. Starting classification.")
            setTimeout(classifyDiceRolls, 1000)
        }
        else {
            console.log("Waiting for page to load.")
            setTimeout(waitForPageLoad, 1000)
        }
    }

    waitForPageLoad();

})();
