'use strict';
var app = angular.module('myApp', []);

app.controller('MallListCtrl', function($scope, $http, $timeout) {
	// Function to get the data
	$scope.getData = function(){
		$http.get('data.php')
			.success(function(response) {
			$scope.malls = response.query.results.PGIS;
			$scope.TIMESTAMP = clock();
			console.log('Fetched data!');
		});
	};
	// Function to replicate setInterval using $timeout service.
	$scope.intervalFunction = function(){
		$timeout(function() {
			$scope.getData();
			$scope.intervalFunction();
		}, 15000)
	};
	$scope.getData();
	$scope.intervalFunction();// Kick off the interval
});

function clock() {var now = new Date();var TmStr = 'Waktu: ' + (now.getDate())+"/"+(now.getMonth()+1)+"/"+now.getFullYear() + ' ' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + meridiem(now.getHours());return TmStr;}
function meridiem(hour) { if (hour > 11) { return 'PM'; } else { return 'AM'; }}
