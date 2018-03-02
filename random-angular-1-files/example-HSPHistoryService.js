
"use strict";


/* HSPHistoryService */

/*

NOTES: 

	HSPHistoryService.init(); <<<< Do not forget to INIT !!!
	HSPHistoryService.getLastStateForPage(page);
	HSPHistoryService.setLastStateForPage(page,lastStateObj);
	
	*** SESSIONS ***
		0  - ALL
		1  - ACTIONABLE
		2  - SHARED
		3  - FLAGGED
		4  - NOTED
		5  - COMMENTS
		6  - ARCHIVED 
		7  - EMAIL 
		8  - SMS 
		9  - VOICE 
		10 - WEB 
		11 - THIRDPARTY
		12 - POSITIVE 
		13 - NEGATIVE 
		14 - REQUEST 

		type=menu & i=12

		{
			i:[1,2,3,4,5,6,7,8,9,10,11,12,13,14],
			keywords:""
		}

	*** TRENDS ***
	
	{ 
		type: "menu" || "pin",
		catid: "" || "id",               
		i: typeFilterSelected, 
		locid: locid || "",                
		pin: pin || -1 // (-1 == all staff)
	}


*/


HSPApp.service("HSPHistoryService", ["$rootScope", function($rootScope) {

	var removeHSPNavBarBrandSelectedEvent = $rootScope.$on("HSPNavBarBrandSelectedEvent", function(event, data) { 
		// clear out the history on brand change
		init_();
	});

	var lastPageStates = [];

	function init_() {
		// this will grow...
		lastPageStates = [
			{
				pagename:"SESSIONS",
				stateObj:{}
			},
			{
				pagename:"TRENDS",
				stateObj:{}
			}
		];
		return true;
	}

	function getLastStateForPage_(page) {
		var stateObj = {};
		var lastPageStatesLen = lastPageStates.length;
		for(var gl=0;gl<lastPageStatesLen;gl++) {
			if(lastPageStates[gl].pagename === page) {
				stateObj = lastPageStates[gl].stateObj;
			}
		}
		return stateObj;
	}

	function setLastStateForPage_(page,lastStateObj) {
		var lastPageStatesLen = lastPageStates.length;
		for(var sl=0;sl<lastPageStatesLen;sl++) {
			if(lastPageStates[sl].pagename === page) {
				lastPageStates[sl].stateObj = lastStateObj;
			}
		}
	}
	
	return {
		init:function() {
			return init_();
		},
		getLastStateForPage:function(page) {
			return getLastStateForPage_(page);
		},
		setLastStateForPage:function(page,lastStateObj) {
			setLastStateForPage_(page,lastStateObj);
		}
	}
}]);

