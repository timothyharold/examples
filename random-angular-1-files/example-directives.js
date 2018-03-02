
"use strict";

HSPApp.directive("hspSessionTileButton", function ($location, HSPAppConfig, HSPDataObjService, HSPTrackingService) {   
    return {
        restrict: "A",
        link: function($scope, $element) {
            $element.bind("mousedown", function(e) {
                var buttonHovered = false, searchObj = {}, ty, indexForTileType;
                if(buttonHovered === false && "undefined" === typeof $scope.sessiontile.sourceid) {
                    ty = $scope.tiletype;
                    indexForTileType = (ty === "sessions") ? 110 : 310; // sessions or dashboard, trends handled elsewhere
                    searchObj.ref = (ty !== undefined) ? ty : "none";
                    HSPTrackingService.track(indexForTileType);
                    HSPAppConfig.selectedSessionObj = null;
                    HSPAppConfig.selectedStaffObj = null;
                    HSPAppConfig.selectedResponsesObj = null;
                    HSPAppConfig.selectedSessionObj = $scope.sessiontile;
                    HSPAppConfig.selectedStaffObj = HSPDataObjService.getStaffForPinAndLocationId($scope.sessiontile.pin, $scope.sessiontile.locationid);
                    HSPAppConfig.selectedResponsesObj = HSPDataObjService.getResponsesForSessiontimestampAndLocationId(parseInt($scope.sessiontile.sessiontimestamp),$scope.sessiontile.locationid);
                    $location.url("/session-detail").search(searchObj);
                } 
                if($scope.sessiontile.source) {
                    if($scope.thirdpartyurl !== "") {
                        window.open($scope.thirdpartyurl,"_blank");
                    }
                }
                if($("#dd").hasClass("active")) {
                    $("#dd").toggleClass("active");
                } 
            });
        }
    }
});


HSPApp.directive("hspSessionTileMoreCommentsResponse", function (HSPDataObjService, hspApiBase, HSPAppConfig) {
    return {
        restrict: "A",
        templateUrl:"views/session-tile-more-comments-response.tpl.html",
        replace: true,
        controller: function($scope, $element, $attrs, $http, hspApiKey) {
            var questionLoaded = false, 
				answerLoaded = false,
            	obj = $scope.response,
            	questionObj = HSPDataObjService.getQuestionObjectForQid(obj.q),
            	answerObj = HSPDataObjService.getAnswerObjectForAid(obj.a),
            	questionText = "",
            	answerText = "",
				feedbackAppearanceClass = "hs-col-md-9-test-res-comment-response-tile-extra-neutral-dot";
				
			$scope.sessionTileMoreCommentsResponse = {
				showQuestionAndAnswerSpinner: true,
				modifyFeedbackAppearanceClass: "",
				question: "",
				answer: ""
			};
			
			switch(obj.commentSentiment) {
				case "positive" :
					feedbackAppearanceClass = "hs-col-md-9-test-res-comment-response-tile-extra-positive-dot";
					break;
				case "negative" :
					feedbackAppearanceClass = "hs-col-md-9-test-res-comment-response-tile-extra-negative-dot";
					break;
				case "request" :
					feedbackAppearanceClass = "hs-col-md-9-test-res-comment-response-tile-extra-request-dot";
					break;
			}
			$scope.sessionTileMoreCommentsResponse.modifyFeedbackAppearanceClass = feedbackAppearanceClass;
			
            if(questionObj === undefined || questionObj === "undefined") {
                // retrieve the question
                $http({ 
                    url:hspApiBase+"/question/"+obj.q+"",
                    method:"GET",
                    headers:{ "apikey":hspApiKey, "accountid":HSPAppConfig.userObj.name }
                }).success(function (data, status, headers, config) {
                    var arr = [];
                    arr.push(data);
                    HSPDataObjService.addQuestions(arr);
                    $scope.sessionTileMoreCommentsResponse.question = data.text;
                    questionLoaded = true;
                    if(questionLoaded === true && answerLoaded === true) $scope.sessionTileMoreCommentsResponse.showQuestionAndAnswerSpinner = false;
                    return true;
                }).error(function (data, status, headers, config) {
					Bugsnag.notify("hspSessionTileMoreCommentsResponse", "error getting question for display", { 
						timestamp:new Date().getTime(), 
						time:new Date().toString(), 
						name:HSPAppConfig.name, 
						companyname:HSPAppConfig.companyname, 
						customeraccountid:HSPAppConfig.accountid, 
						url:config.url, 
						data:data, 
						error:"error getting question for display" }, 
					"error");
                    return false;
                });
            } else {
                $scope.sessionTileMoreCommentsResponse.question = questionObj.question;
                questionLoaded = true;
                if(questionLoaded === true && answerLoaded === true) $scope.sessionTileMoreCommentsResponse.showQuestionAndAnswerSpinner = false;
            }

            if(answerObj === undefined || answerObj === "undefined") {
                // retrieve the answer
                $http({ 
                    url:hspApiBase+"/answer/"+obj.a+"",
                    method:"GET",
                    headers:{ "apikey":hspApiKey, "accountid":HSPAppConfig.userObj.name }
                }).success(function (data, status, headers, config) {
                    var arr = [];
                    arr.push(data);
                    HSPDataObjService.addAnswers(arr);
                    $scope.sessionTileMoreCommentsResponse.answer = data.text;
                    answerLoaded = true;
                    if(questionLoaded === true && answerLoaded === true) $scope.sessionTileMoreCommentsResponse.showQuestionAndAnswerSpinner = false;
                    return true;
                }).error(function (data, status, headers, config) {
					Bugsnag.notify("hspSessionTileMoreCommentsResponse", "error getting answer for display", { 
						timestamp:new Date().getTime(), 
						time:new Date().toString(), 
						name:HSPAppConfig.name, 
						companyname:HSPAppConfig.companyname, 
						customeraccountid:HSPAppConfig.accountid, 
						url:config.url, 
						data:data, 
						error:"error getting answer for display" }, 
					"error");
                    return false;
                });
            } else {
                $scope.sessionTileMoreCommentsResponse.answer = answerObj.answer;
                answerLoaded = true;
                if(questionLoaded === true && answerLoaded === true) $scope.sessionTileMoreCommentsResponse.showQuestionAndAnswerSpinner = false;
            }

        }, 
        link: function (scope, element, attrs) {}
    }        
});


HSPApp.directive("hspAssetsImageTile", function (HSPTrackingService) {
    return {
        restrict: "A",
        templateUrl:"views/assets-image-tile.tpl.html",
        replace: true,
        controller: function($scope, $element, $attrs) {
            $scope.handleImageObjClick = function() {
				HSPTrackingService.track(11111);
            	$scope.$parent.handleAssetsImageObjClick($scope.imageObj.imageid);
            };
        }, 
        link: function (scope, element, attrs) { }
    }        
});


