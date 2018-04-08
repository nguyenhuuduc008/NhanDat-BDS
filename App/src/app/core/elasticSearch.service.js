(function(){
  'use strict';

  angular.module('app.core')
  .service('elasticSearch',elasticSearch);
  /** @ngInject **/
  function elasticSearch (esFactory,APP_CONFIG,$rootScope){
     var elasticConfig = $rootScope.storage.appSettings.elasticSearch.config;
     var elasticHost = elasticConfig && elasticConfig.host ? elasticConfig.host : APP_CONFIG.elasticHost;
     var elasticusAuth =   elasticConfig && elasticConfig.auth ? elasticConfig.auth : APP_CONFIG.elasticusAuth;
     console.log(elasticConfig);
     var tv = esFactory({host: elasticHost, httpAuth: elasticusAuth, log: 'trace', port: 9200, protocol: 'http',headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers':'Origin, Content-Type, X-Auth-Token',
      'Access-Control-Allow-Methods':'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    }});

    tv.ping({
      // ping usually has a 3000ms timeout
      requestTimeout: 1000
    }, function (error) {
      if (error) {
        console.trace('elasticsearch cluster is down!');
      } else {
        console.log('All is well');
      }
    });

    return tv;
    
  }
})();