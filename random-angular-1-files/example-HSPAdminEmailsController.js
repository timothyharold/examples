
"use strict";

HSPApp.controller("HSPAdminEmailsController", [
	"$rootScope",
	"$scope",
	"$http",
	"$timeout",
	"HSPDataObj",
	"HSPDataObjService",
	"HSPAppConfig",
	"HSPAuthService",
	"hspApiBase",
	"hspApiKey",
	"HSPTrackingService",
	"HSPTimeService",
	"$translate",
	function(
		$rootScope,
		$scope,
		$http,
		$timeout,
		HSPDataObj,
		HSPDataObjService,
		HSPAppConfig,
		HSPAuthService,
		hspApiBase,
		hspApiKey,
		HSPTrackingService,
		HSPTimeService,
		$translate
	) {

	if(HSPAuthService.isAuthenticated() === false) {
		HSPAuthService.logout();
	}
	
	var removeDestroy = $scope.$on("$destroy", function(event) {
		resetAll();
	});

	var removeHSPLogoutEvent = $rootScope.$on("HSPLogoutEvent", function(event) {
		resetAll();
	});

	var removeHSPUpdateTranslationsEvent = $rootScope.$on("$translateChangeSuccess", function(event) { 
    	updateTranslations(); 
    });
	
	var removeHSPNavBarLocationSelectedEvent = $rootScope.$on("HSPNavBarLocationSelectedEvent", function(event) { 
		reset();
		refreshAllEmailResponses();
	});

	var removeHSPStartLoadingStatsEvent = $rootScope.$on("HSPStartLoadingStatsEvent", function(event) { 
		reset();
		refreshAllEmailResponses();
	});

	var className = "HSPAdminEmailsController",
		delayToRefreshResponsesInMillisecs = 1000,
		dynText1 = "OPPORTUNITIES",
		dynText2 = "POSITIVE",
		dynText3 = "REQUEST",
		dynText4 = "CUSTOM",
		dynText5 = "Saving response now",
		dynText6 = "", // "One moment while we save this" or  "One moment while we save this {{responseTypeStr}} email response."
		dynText7 = "", // "email response."
		dynText8 = "Saving reponse",
		dynText9 = "Refreshing responses now",
		dynText10 = "One moment while we refresh all email responses.",
		dynText11 = "Loading reponses",
		dynText12 = "Sorry",
		dynText13 = "We were unable to update your response. Please try again.",
		dynText14 = "",
		dynText15 = "",
		dynText16 = "Today",
		dynText17 = "Yesterday",
		dynText18 = "Past Week",
		dynText19 = "Past Month",
		dynText20 = "Past Quarter",
		dynText21 = "Past Year",
		dynText22 = "Custom Range",
		dynText23 = "All Emails",
		dynText24 = "",
		dynText25 = "Updating total emails captured";

	$rootScope.$broadcast("HSPUpdateNavRightNavDisplayEvent", "EMAILS");
	
	$scope.adminEmailsData = {
		showTotalEmailsSpinner: false,
		totalEmailsSpinnerText: dynText25,
		showSelectLocationBlock: true,
		totalEmailsForExport: 0,
		disableExportEmailListSaveButton: true,
		showSelectLocationForExportEmailsList: false,
		disableTextAreaNoDefaultResponseSelection: true,
		disableSaveResponseButton: true,
		emailResponsesReady: false,
		responseTypeModel: null,
		responseTypesSelectOptions: [
			{ type:9823, label:dynText1, responseid:"", savedResponse:"" },
			{ type:9824, label:dynText2, responseid:"", savedResponse:"" },
			{ type:9825, label:dynText3, responseid:"", savedResponse:"" },
			{ type:9826, label:dynText4, responseid:"", savedResponse:"" }
		],
		emailsModal: {},
		responseBody: "",
		dateRangesSelectOptions: [
			{ label:dynText23, type:0, value:"all" },
			{ label:dynText17, type:1, value:"yesterday" },
			{ label:dynText18, type:2, value:"week" },
			{ label:dynText19, type:3, value:"month" },
			{ label:dynText20, type:4, value:"quarter" },
			{ label:dynText21, type:5, value:"year" },
			{ label:dynText22, type:6, value:"custom" }
		],
		exportDateStart: new Date(),
		exportDateEnd: new Date(),
		selectedDateRangesModel: null,
		showCustomDateRange: false
	};


	function reset() {
		updateTranslations();
		$scope.adminEmailsData.showSelectLocationBlock = (HSPAppConfig.selectedLocation === "all") ? true : false;
		$scope.adminEmailsData.totalEmailsForExport = 0;
		$scope.adminEmailsData.disableTextAreaNoDefaultResponseSelection = true;
		$scope.adminEmailsData.disableSaveResponseButton = true;
		checkIfLocationHasBeenSelected();
		$scope.adminEmailsData.emailResponsesReady = false;
		$scope.adminEmailsData.responseTypeModel = null;
		$scope.adminEmailsData.responseTypesSelectOptions = [
			{ type:9823, label:dynText1, responseid:"", savedResponse:"" },
			{ type:9824, label:dynText2, responseid:"", savedResponse:"" },
			{ type:9825, label:dynText3, responseid:"", savedResponse:"" },
			{ type:9826, label:dynText4, responseid:"", savedResponse:"" }
		];
		
		hideEmailActivityModal();
		$scope.adminEmailsData.responseBody = "";
		initDateRangesSelectOptions();
	}

	// init
	reset();
	getTotalEmailsForExport();
	refreshAllEmailResponses();
	HSPTrackingService.track(900);
	// console.log(className + " now up...");

	
	$scope.handleSubmitResponse = function() {
		var emailAddress = HSPAppConfig.userObj.email,
			assignment = $scope.adminEmailsData.responseTypeModel.emailresponseid,
			responseTypeStr = $scope.adminEmailsData.responseTypeModel.label.toLowerCase(),
			params = { responsetext:$scope.adminEmailsData.responseBody };

		HSPTrackingService.track(920);
		
		$("#admin-emails-activity-modal").modal({ backdrop:"static", keyboard:false });
		$scope.adminEmailsData.emailsModal.infoModalTitle = dynText5;
		$scope.adminEmailsData.emailsModal.infoModalMessage = dynText6 + responseTypeStr + dynText7;
		$scope.adminEmailsData.emailsModal.infoModalDetailedMessage = dynText8;
		$scope.adminEmailsData.emailsModal.staticActivityModal = true;
		$http({ 
		    url:hspApiBase + "/mail/response/" + assignment + "",
 		    method:"PUT",
 		    data:$.param(params),
 		    headers:{ "Content-Type":"application/x-www-form-urlencoded", "apikey":hspApiKey, "accountid":HSPAppConfig.userObj.name }
		}).success(function (data, status, headers, config) {
			hideEmailActivityModal();
			if(HSPAuthService.isAuthenticated() === true) {
				$timeout(function() { 
					refreshAllEmailResponses();
				}, delayToRefreshResponsesInMillisecs);
			}
		}).error(function (data, status, headers, config) {
			$scope.adminEmailsData.emailsModal.infoModalTitle = dynText12;
			$scope.adminEmailsData.emailsModal.infoModalMessage = dynText13;
			$scope.adminEmailsData.emailsModal.infoModalDetailedMessage = dynText14;
			$scope.adminEmailsData.emailsModal.staticActivityModal = false;
			Bugsnag.notify("HSPAdminEmailsController::handleSubmitResponse()", "error saving email response", { 
				timestamp:new Date().getTime(), 
				time:new Date().toString(), 
				name:HSPAppConfig.name, 
				companyname:HSPAppConfig.companyname, 
				customeraccountid:HSPAppConfig.accountid, 
				url:config.url, 
				data:data, 
				error:"error saving email response" }, 
			"error");
		});
	};

	$scope.handleExportEmailList = function() {
		var currLocid = "", 
			timestamps = getDateRange($scope.adminEmailsData.selectedDateRangesModel.type),
			emailsLocs = [],
			allLocs,
			allLocsLen = 0;
			
		if(HSPAppConfig.selectedLocation === "all") {
			allLocs = HSPDataObjService.getAllLocationsForBrandid(HSPAppConfig.selectedBrandObj.brandid);
			allLocsLen = allLocs.length;
			for(var a=0; a<allLocsLen; a++) {
			 	if(allLocs[a].locationid !== undefined) {
			 		emailsLocs.push(allLocs[a].locationid);
			 	}
			}
			currLocid = emailsLocs.toString();
		} else {
			currLocid = HSPAppConfig.selectedLocation;
		}

		if(currLocid !== "") {
			HSPTrackingService.track(930);
			window.open(hspApiBase+"/email/export/"+currLocid+"/"+timestamps.start+"/"+timestamps.end,"_blank");
			initDateRangesSelectOptions();
		}
	};	

	$scope.handleResponseTypesSelectOptionsSelected = function() {
		$scope.adminEmailsData.disableTextAreaNoDefaultResponseSelection = ($scope.adminEmailsData.responseTypeModel !== undefined) ? false : true;
		$scope.adminEmailsData.disableSaveResponseButton = true;
		$scope.adminEmailsData.responseBody = $scope.adminEmailsData.responseTypeModel.savedResponse;
		switch($scope.adminEmailsData.responseTypeModel.type) {
			case 9824 : HSPTrackingService.track(910); break; // positive
			case 9823 : HSPTrackingService.track(911); break; // negative
			case 9825 : HSPTrackingService.track(912); break; // request
			case 9826 : HSPTrackingService.track(913); break; // custom
		}
	};

	function refreshAllEmailResponses() {
		var emailAddress = HSPAppConfig.userObj.email;		
		$scope.responseTypesSelectOptions = [
			{ type:9823, label:dynText1, emailresponseid:"", savedResponse:"", responsereceived:false },
			{ type:9824, label:dynText2, emailresponseid:"", savedResponse:"", responsereceived:false },
			{ type:9825, label:dynText3, emailresponseid:"", savedResponse:"", responsereceived:false },
			{ type:9826, label:dynText4, emailresponseid:"", savedResponse:"", responsereceived:false }
		];

		$("#admin-emails-activity-modal").modal({ backdrop:"static", keyboard:false });
		$scope.adminEmailsData.emailsModal.infoModalTitle = dynText9;
		$scope.adminEmailsData.emailsModal.infoModalMessage = dynText10;
		$scope.adminEmailsData.emailsModal.infoModalDetailedMessage = dynText11;
		$scope.adminEmailsData.emailsModal.staticActivityModal = true;

		// negative
		$http({
			url:hspApiBase+"/mail/response/"+emailAddress+"/9823",
			method:"GET",
			headers:{ "apikey":hspApiKey, "accountid":HSPAppConfig.userObj.name } 
		}).success(function (data, status, headers, config) {
			$scope.adminEmailsData.responseTypesSelectOptions[0].savedResponse = data.responsetext;
			$scope.adminEmailsData.responseTypesSelectOptions[0].emailresponseid = data.emailresponseid;
			$scope.adminEmailsData.responseTypesSelectOptions[0].responsereceived = true;
			checkEmailResponsesLoaded();
			return true;
		}).error(function (data, status, headers, config) {
			$scope.adminEmailsData.responseTypesSelectOptions[0].savedResponse = "";
			$scope.adminEmailsData.responseTypesSelectOptions[0].emailresponseid = "";
			$scope.adminEmailsData.responseTypesSelectOptions[0].responsereceived = true;
			checkEmailResponsesLoaded();
			Bugsnag.notify("HSPAdminEmailsController::refreshAllEmailResponses()::negative", "error getting negative email response", { 
				timestamp:new Date().getTime(), 
				time:new Date().toString(), 
				name:HSPAppConfig.name, 
				companyname:HSPAppConfig.companyname, 
				customeraccountid:HSPAppConfig.accountid, 
				url:config.url, 
				data:data, 
				error:"error getting negative email response" }, 
			"error");
			return false;
		});

		// positive
		$http({
			url:hspApiBase+"/mail/response/"+emailAddress+"/9824",
			method:"GET",
			headers:{ "apikey":hspApiKey, "accountid":HSPAppConfig.userObj.name } 
		}).success(function (data, status, headers, config) {
			$scope.adminEmailsData.responseTypesSelectOptions[1].savedResponse = data.responsetext;
			$scope.adminEmailsData.responseTypesSelectOptions[1].emailresponseid = data.emailresponseid;
			$scope.adminEmailsData.responseTypesSelectOptions[1].responsereceived = true;
			checkEmailResponsesLoaded();
			return true;
		}).error(function (data, status, headers, config) {
			$scope.adminEmailsData.responseTypesSelectOptions[1].savedResponse = "";
			$scope.adminEmailsData.responseTypesSelectOptions[1].emailresponseid = "";
			$scope.adminEmailsData.responseTypesSelectOptions[1].responsereceived = true;
			checkEmailResponsesLoaded();
			Bugsnag.notify("HSPAdminEmailsController::refreshAllEmailResponses()::positive", "error getting positive email response", { 
				timestamp:new Date().getTime(), 
				time:new Date().toString(), 
				name:HSPAppConfig.name, 
				companyname:HSPAppConfig.companyname, 
				customeraccountid:HSPAppConfig.accountid, 
				url:config.url, 
				data:data, 
				error:"error getting positive email response" }, 
			"error");
			return false;
		});

		// request
		$http({
			url:hspApiBase+"/mail/response/"+emailAddress+"/9825",
			method:"GET",
			headers:{ "apikey":hspApiKey, "accountid":HSPAppConfig.userObj.name }
		}).success(function (data, status, headers, config) {
			$scope.adminEmailsData.responseTypesSelectOptions[2].savedResponse = data.responsetext;
			$scope.adminEmailsData.responseTypesSelectOptions[2].emailresponseid = data.emailresponseid;
			$scope.adminEmailsData.responseTypesSelectOptions[2].responsereceived = true;
			checkEmailResponsesLoaded();
			return true;
		}).error(function (data, status, headers, config) {
			$scope.adminEmailsData.responseTypesSelectOptions[2].savedResponse = "";
			$scope.adminEmailsData.responseTypesSelectOptions[2].emailresponseid = "";
			$scope.adminEmailsData.responseTypesSelectOptions[2].responsereceived = true;
			checkEmailResponsesLoaded();
			Bugsnag.notify("HSPAdminEmailsController::refreshAllEmailResponses()::request", "error getting request email response", { 
				timestamp:new Date().getTime(), 
				time:new Date().toString(), 
				name:HSPAppConfig.name, 
				companyname:HSPAppConfig.companyname, 
				customeraccountid:HSPAppConfig.accountid, 
				url:config.url, 
				data:data, 
				error:"error getting request email response" }, 
			"error");
			return false;
		});

		// custom
		$http({
			url:hspApiBase+"/mail/response/"+emailAddress+"/9826",
			method:"GET",
			headers:{ "apikey":hspApiKey, "accountid":HSPAppConfig.userObj.name } 
		}).success(function (data, status, headers, config) {
			$scope.adminEmailsData.responseTypesSelectOptions[3].savedResponse = data.responsetext;
			$scope.adminEmailsData.responseTypesSelectOptions[3].emailresponseid = data.emailresponseid;
			$scope.adminEmailsData.responseTypesSelectOptions[3].responsereceived = true;
			checkEmailResponsesLoaded();
			return true;
		}).error(function (data, status, headers, config) {
			$scope.adminEmailsData.responseTypesSelectOptions[3].savedResponse = "";
			$scope.adminEmailsData.responseTypesSelectOptions[3].emailresponseid = "";
			$scope.adminEmailsData.responseTypesSelectOptions[3].responsereceived = true;
			checkEmailResponsesLoaded();
			Bugsnag.notify("HSPAdminEmailsController::refreshAllEmailResponses()::custom", "error getting custom email response", { 
				timestamp:new Date().getTime(), 
				time:new Date().toString(), 
				name:HSPAppConfig.name, 
				companyname:HSPAppConfig.companyname, 
				customeraccountid:HSPAppConfig.accountid, 
				url:config.url, 
				data:data, 
				error:"error getting custom email response" }, 
			"error");
			return false;
		});
	}

	function checkEmailResponsesLoaded() {
		if($scope.adminEmailsData.responseTypesSelectOptions[0].responsereceived === true && $scope.adminEmailsData.responseTypesSelectOptions[1].responsereceived === true && $scope.adminEmailsData.responseTypesSelectOptions[2].responsereceived === true && $scope.adminEmailsData.responseTypesSelectOptions[3].responsereceived === true) {
			$scope.adminEmailsData.emailResponsesReady = true;
			hideEmailActivityModal();
			$scope.adminEmailsData.showSelectLocationBlock = (HSPAppConfig.selectedLocation === "all") ? true : false;
		}
	}

	function checkIfLocationHasBeenSelected() {
		var currLocid = HSPAppConfig.selectedLocation; 
		if(currLocid !== "") {
			$scope.adminEmailsData.disableExportEmailListSaveButton = false;
			$scope.adminEmailsData.showSelectLocationForExportEmailsList = false;
		} else {
			$scope.adminEmailsData.disableExportEmailListSaveButton = true;
			$scope.adminEmailsData.showSelectLocationForExportEmailsList = true;
		}
	}

	function getTotalEmailsForExport() {
		var currLocid = HSPAppConfig.selectedLocation, 
			alllocs, 
			alllocsLen, 
			alllocids, 
			requrl = "", 
			timestamps = {};
			
		$scope.adminEmailsData.showTotalEmailsSpinner = true;
		
		if(currLocid === "all") {
			alllocs = HSPDataObjService.getAllLocationsForBrandid(HSPAppConfig.selectedBrand);
			alllocsLen = alllocs.length;
			alllocids = [];
			for(var i=0; i<alllocsLen; i++) { alllocids.push(alllocs[i].locationid); }
			currLocid = alllocids.toString();
		}
		
		if($scope.adminEmailsData.selectedDateRangesModel !== undefined && $scope.adminEmailsData.selectedDateRangesModel !== null) {
			timestamps = getDateRange($scope.adminEmailsData.selectedDateRangesModel.type);
			requrl = hspApiBase+"/email/location/count/"+currLocid+"/"+timestamps.start+"/"+timestamps.end+"";
		} else {
			requrl = hspApiBase+"/email/location/count/"+currLocid+"";
		}
		$scope.adminEmailsData.totalEmailsForExport = 0;
		if(currLocid === "" || currLocid === "all" || currLocid === undefined) {
			$scope.adminEmailsData.showTotalEmailsSpinner = false;
			return;
		}

		$http({
			url:requrl,
			method:"GET",
			headers:{ "apikey":hspApiKey, "accountid":HSPAppConfig.userObj.name } 
		}).success(function (data, status, headers, config) {
			$scope.adminEmailsData.totalEmailsForExport = data;
			if(data > 9999) {
				var str = data + "";
				$scope.adminEmailsData.totalEmailsForExport = str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
			if($scope.adminEmailsData.totalEmailsForExport > 0) {
				$scope.adminEmailsData.disableExportEmailListSaveButton = false;
				$scope.adminEmailsData.showSelectLocationForExportEmailsList = false;
			} else {
				$scope.adminEmailsData.disableExportEmailListSaveButton = true;
			}
			$scope.adminEmailsData.showTotalEmailsSpinner = false;
			return true;
		}).error(function (data, status, headers, config) {
			Bugsnag.notify("HSPAdminEmailsController::getTotalEmailsForExport()", "error getting value for total emails for export", { 
				timestamp:new Date().getTime(), 
				time:new Date().toString(), 
				name:HSPAppConfig.name, 
				companyname:HSPAppConfig.companyname, 
				customeraccountid:HSPAppConfig.accountid, 
				url:config.url, 
				data:data, 
				error:"error getting value for total emails for export" }, 
			"error");
			return false;
		});
	}


	$scope.handleEmailResponseTextChanged = function() {
		if($scope.adminEmailsData.responseBody !== $scope.adminEmailsData.responseTypeModel.savedResponse) {
			$scope.adminEmailsData.disableSaveResponseButton = false;
		} else {
			$scope.adminEmailsData.disableSaveResponseButton = true;
		}
	};


	function initDateRangesSelectOptions() {
		$scope.adminEmailsData.exportDateStart = new Date();
	  	$scope.adminEmailsData.exportDateEnd = new Date();
		$scope.adminEmailsData.selectedDateRangesModel = null;
		$scope.adminEmailsData.showCustomDateRange = false;
		$scope.adminEmailsData.disableExportEmailListSaveButton = true;
	}


	$scope.handleDateRangeSelected = function() {
		$scope.adminEmailsData.showCustomDateRange = false;
		if($scope.adminEmailsData.selectedDateRangesModel.type === 6) {
			$scope.adminEmailsData.showCustomDateRange = true;
		}
		$scope.adminEmailsData.disableExportEmailListSaveButton = false;
		switch($scope.adminEmailsData.selectedDateRangesModel.type) {
			case 0 : HSPTrackingService.track(947); break; // all emails
			case 1 : HSPTrackingService.track(941); break; // yesterday
			case 2 : HSPTrackingService.track(942); break; // week
			case 3 : HSPTrackingService.track(943); break; // month
			case 4 : HSPTrackingService.track(944); break; // quarter
			case 5 : HSPTrackingService.track(945); break; // year
			case 6 : HSPTrackingService.track(946); break; // custom
		}
		if($scope.adminEmailsData.selectedDateRangesModel.type < 6) getTotalEmailsForExport();
		if($scope.adminEmailsData.selectedDateRangesModel.type > 5) $scope.adminEmailsData.totalEmailsForExport = 0;
	};


	$scope.handleStartDateChanged = function() {
  		$scope.adminEmailsData.exportDateStart = getDatePerMidnight($scope.adminEmailsData.exportDateStart);
  		if(isDateInTheFuture($scope.adminEmailsData.exportDateStart) === true) {
  			$scope.adminEmailsData.exportDateStart = getDatePerEOD(new Date());
  		}
  		if(isStartDateOlderThanEndDate() === true) {
  			$scope.adminEmailsData.exportDateEnd = new Date($scope.adminEmailsData.exportDateStart.getTime());
  		}  		
  		if($scope.adminEmailsData.selectedDateRangesModel.type > 5) getTotalEmailsForExport();
  	};


  	$scope.handleEndDateChanged = function() {
  		$scope.adminEmailsData.exportDateEnd = getDatePerEOD($scope.adminEmailsData.exportDateEnd);
  		if(isDateInTheFuture($scope.adminEmailsData.exportDateEnd) === true) {
  			$scope.adminEmailsData.exportDateEnd = getDatePerEOD(new Date());
  		} else {
  			if(isStartDateOlderThanEndDate() === true) {
  				$scope.adminEmailsData.exportDateStart = getDatePerMidnight($scope.adminEmailsData.exportDateEnd);
  			}
  		}
  		if($scope.adminEmailsData.selectedDateRangesModel.type > 5) getTotalEmailsForExport();
  	};

  	$scope.handleCalendarTodaySelected = function() {
  		if(isStartDateOlderThanEndDate() === true) {
  			$scope.adminEmailsData.exportDateEnd = new Date($scope.adminEmailsData.exportDateStart.getTime());
  		} 
  		getTotalEmailsForExport();
  	};
	
	$scope.handleCloseActivityModal = function() {
		hideEmailActivityModal();
	};
	
	$scope.handleNavReportsRedirect = function() {
		$rootScope.$broadcast("HSPAdminNavSelectEvent", { path:"/reports" } );
	};	

	function getDatePerMidnight(date) {
		return new Date(date.setHours(0,0,0,0));
	}

	function getDatePerEOD(date) {
		return new Date(date.setHours(23,59,59,999));
	}

	function isStartDateOlderThanEndDate() {
		var val = Date.dateDiff("d", $scope.adminEmailsData.exportDateStart, $scope.adminEmailsData.exportDateEnd);
		return (val < 0) ? true : false;
	}

	function isDateInTheFuture(date) {
		var val = Date.dateDiff("d", date, new Date());
		return (val < 0) ? true : false;
	}
	
	function getDateRange(index) {
		var range = { start: 0, end: 0 };
		if("undefined" === typeof index) return range;
		switch(index) {
			default :
				range.start = 0;
				range.end = HSPTimeService.getServerTodayEOD();
				break;
			case 1 :
				range.start = HSPTimeService.getServerYesterdayMidnight();
				range.end = HSPTimeService.getServerYesterdayEOD();
				break;
			case 2 :
				range.start = HSPTimeService.getServerPastWeekMidnight();
				range.end = HSPTimeService.getServerYesterdayEOD();
				break;
			case 3 :
				range.start = HSPTimeService.getServerPastMonthMidnight();
				range.end = HSPTimeService.getServerYesterdayEOD();
				break;
			case 4 :
				range.start = HSPTimeService.getServerPastQuarterMidnight();
				range.end = HSPTimeService.getServerYesterdayEOD();
				break;
			case 5 :
				range.start = HSPTimeService.getServerPastYearMidnight();
				range.end = HSPTimeService.getServerYesterdayEOD();
				break;
			case 6 :
				range.start = HSPTimeService.getServerDateMidnightForTimestamp($scope.adminEmailsData.exportDateStart);
				range.end = HSPTimeService.getNormalizedTimestamp($scope.adminEmailsData.exportDateEnd.getTime(), HSPAppConfig.userObj.timezone);
				break;
		}		
		return range;
	}
	
	function hideEmailActivityModal() {
		$("#admin-emails-activity-modal").modal("hide");
		$scope.adminEmailsData.emailsModal = {
			infoModalTitle: "",
			infoModalMessage: "",
			infoModalDetailedMessage: "",
			staticActivityModal: true
		};
	}


	function updateTranslations() {
	   	$translate("_EMAILS.TEXT10").then(function (translation) {
	  		dynText1 = translation; // "OPPORTUNITIES"
	  		if($scope.adminEmailsData.responseTypesSelectOptions.length > 1) $scope.adminEmailsData.responseTypesSelectOptions[0].label = dynText1;
		});
	   	$translate("_EMAILS.TEXT9").then(function (translation) {
	  		dynText2 = translation; // "POSITIVE"
	  		if($scope.adminEmailsData.responseTypesSelectOptions.length > 2) $scope.adminEmailsData.responseTypesSelectOptions[1].label = dynText2;
		});
		$translate("_EMAILS.TEXT11").then(function (translation) {
	  		dynText3 = translation; // "REQUEST"
	  		if($scope.adminEmailsData.responseTypesSelectOptions.length > 3) $scope.adminEmailsData.responseTypesSelectOptions[2].label = dynText3;
		});
		$translate("_EMAILS.TEXT12").then(function (translation) {
	  		dynText4 = translation; // "CUSTOM"
	  		if($scope.adminEmailsData.responseTypesSelectOptions.length > 4) $scope.adminEmailsData.responseTypesSelectOptions[3].label = dynText4;
		});
		$translate("_MODALS.EMAILS.TITLE1").then(function (translation) {
	  		dynText5 = translation; // "Saving response now"
		});
		$translate("_MODALS.EMAILS.MESSAGE1A").then(function (translation) {
	  		dynText6 = translation; // "One moment while we save this" of  "One moment while we save this {{responseTypeStr}} email response."
		});
		$translate("_MODALS.EMAILS.MESSAGE1B").then(function (translation) {
	  		dynText7 = translation; // "email response."  of  "One moment while we save this {{responseTypeStr}} email response."
		});
		$translate("_MODALS.EMAILS.DETAILS1").then(function (translation) {
	  		dynText8 = translation; // "Saving reponse"
		});
		$translate("_MODALS.EMAILS.TITLE2").then(function (translation) {
	  		dynText9 = translation; // "Refreshing responses now"
		});
		$translate("_MODALS.EMAILS.MESSAGE2").then(function (translation) {
	  		dynText10 = translation; // "One moment while we refresh all email responses."
		});
		$translate("_MODALS.EMAILS.DETAILS2").then(function (translation) {
	  		dynText11 = translation; // "Loading reponses"
		});
		$translate("_MODALS.EMAILS.TITLE3").then(function (translation) {
	  		dynText12 = translation; // "Sorry"
		});
		$translate("_MODALS.EMAILS.MESSAGE3").then(function (translation) {
	  		dynText13 = translation; // "We were unable to update your response. Please try again."
		});
		$translate("_MODALS.EMAILS.DETAILS3").then(function (translation) {
	  		dynText14 = translation; // ""
		});
		$translate("_REPORTS.TEXT48").then(function (translation) {
	  		dynText16 = translation; // "Today"
		});
		$translate("_REPORTS.TEXT49").then(function (translation) {
	  		dynText17 = translation; // "Yesterday"
		});
		$translate("_REPORTS.TEXT50").then(function (translation) {
	  		dynText18 = translation; // "Past Week"
		});
		$translate("_REPORTS.TEXT51").then(function (translation) {
	  		dynText19 = translation; // "Past Month"
		});
		$translate("_REPORTS.TEXT52").then(function (translation) {
	  		dynText20 = translation; // "Past Quarter"
		});
		$translate("_REPORTS.TEXT53").then(function (translation) {
	  		dynText21 = translation; // "Past Year"
		});
		$translate("_REPORTS.TEXT54").then(function (translation) {
	  		dynText22 = translation; // "Custom Range"
		});
		$translate("_EMAILS.TEXT14").then(function (translation) {
	  		dynText23 = translation; // "All Emails"
		});
		$translate("_EMAILS.TEXT15").then(function (translation) {
	  		dynText25 = translation; // "Updating total emails captured"
	  		$scope.adminEmailsData.totalEmailsSpinnerText = dynText25;
		});
    }

	function resetAll() {
		removeDestroy();
		removeHSPLogoutEvent();
		removeHSPUpdateTranslationsEvent();
		removeHSPNavBarBrandSelected();
		removeHSPNavBarLocationSelectedEvent();
		removeHSPStartLoadingStatsEvent();
	}

}]);


