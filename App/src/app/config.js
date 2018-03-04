 (function(){
 	'user strict';
 	var cfgFB = {
	  	fbConnection:{
	 	    apiKey: "AIzaSyAfhl3GAhHdYa02fAG1XCHCrRlawTwMGyQ",
			authDomain: "bds-staging-375e7.firebaseapp.com",
			databaseURL: "https://bds-staging-375e7.firebaseio.com",
			projectId: "bds-staging-375e7",
			storageBucket: "bds-staging-375e7.appspot.com",
			messagingSenderId: "444150050341"
	 	}
	};
	 
	var cfgApp = {
		// profileBlankImg :'https://firebasestorage.googleapis.com/v0/b/smartapp-79daf.appspot.com/o/images%2Fuser_profile%2Fblank-image.png?alt=media&token=9ea874e3-21eb-4679-a98c-47fe1305e7e8',
		// elasticHost: 'http://eeb088900fa98346c39c3930c7990a3c.us-east-1.aws.found.io:9200/',
		// elasticusAuth: 'elastic:cQnLKBIFxNkBClPVH6LcX9BN',
		// geocodeMapUrl: 'https://maps.googleapis.com/maps/api/geocode/',
		buildVersion: 1001
	};

	var env = {};
	env.localweb = angular.extend({}, cfgFB,cfgApp);
	angular.module('app.config',[]).constant('APP_CONFIG', env.localweb);
 })();
