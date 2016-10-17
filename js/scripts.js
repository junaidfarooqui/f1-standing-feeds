var app = angular.module('F1StandingFeeds', ['F1StandingFeeds.services', 'F1StandingFeeds.controllers']);

/* Ergas API Service */
angular.module('F1StandingFeeds.services', [])
  .factory('ergastAPIservice', function($http) {
    var ergastAPI = {};
    ergastAPI.getDrivers = function(F1s_SelectionVal) {
      return $http({
        method: 'JSONP', 
        url: 'http://ergast.com/api/f1/'+ F1s_SelectionVal +'/driverStandings.json?callback=JSON_CALLBACK'
      });
    }
    return ergastAPI;
  });
  
  
  angular.module('F1StandingFeeds.controllers', []).
  /* Drivers controller */
  controller('driversController', function($scope, ergastAPIservice) {
	$scope.seasonName = "";
   $scope.F1s_SelectionChanged = function () {
            $scope.F1s_SelectionVal = $scope.F1s_Selection;
			//console.log($scope.F1s_SelectionVal)
			DriverList ()
   }; 
   
   /* First Time Page Load */
   $scope.F1s_SelectionVal = '2016'
   DriverList ()
   
   /* Driver List Function */
   function DriverList () {
		$scope.seasonName = $scope.F1s_SelectionVal
        ergastAPIservice.getDrivers($scope.F1s_SelectionVal).success(function (response) {
        $scope.driversList = response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
       });	   
	 }
   
    $scope.years = getYearRange(); 
    $scope.nameFilter = null;
    $scope.driversList = [];
	/* Search Filter */
    $scope.searchFilter = function (driver) {
        var re = new RegExp($scope.nameFilter, 'i');
        return !$scope.nameFilter || re.test(driver.Driver.givenName) || re.test(driver.Driver.familyName);
    };
	$scope.F1s_Selection = $scope.years[0];
	//console.log('this is: ' + $scope.F1s_Selection);
	$scope.currentYear = $scope.years[0];
  });

  /* Year Range Code */
  function getYearRange() {
  var startYear = new Date().getFullYear();
  var endYear = 2005;
  var dateRange = [];
  while(endYear <= startYear) {
      dateRange.push(startYear);
      startYear -= 1
  }
  return dateRange;
}