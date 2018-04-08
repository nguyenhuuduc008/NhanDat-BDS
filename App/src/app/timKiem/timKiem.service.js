(function(){
    'use strict';
    angular.module('app.timKiem').factory('timKiemService', timKiemService);
    /** @ngInject **/
    function timKiemService($rootScope, $q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils, DataUtils, searchService){
       // var quyTrinhPhapLyRef = firebaseDataRef.child('quy-trinh-phap-ly');
        var rootPath = 'bds' , items = firebaseDataRef.child(rootPath);
        var service={
			search: search
        };
        //Ref
        
        return service;

        function search(cri){
            // create query
			var searchSetting = $rootScope.storage.appSettings.elasticSearch[rootPath];
			var query = {
				index: searchSetting.index,
				type: searchSetting.type,
				size: parseInt(cri.size),
				from: parseInt(cri.from)
			};
			query.body = {
				query: {
					bool: {
						must: [],
						should: [],
						must_not: {
							match: {
								isDeleted: true
							}
						},

					}
				}
            };
            
			var queryBody = query.body.query.bool;
            // if(cri.type && $.trim(cri.type) !== '' && $.trim(cri.type) !== 'all'){
			// 	queryBody.must.push({
			// 		match:{
			// 			type: cri.type
			// 		}
			// 	});
            // }
            
			if(cri.bdsType && $.trim(cri.bdsType) !== '' && $.trim(cri.bdsType) !== 'all'){
				queryBody.must.push({
					match:{
						loaiBDS: cri.bdsType
					}
				});
            }
            
            if(cri.city && $.trim(cri.city) !== '' && $.trim(cri.city) !== 'all'){
				queryBody.must.push({
					match:{
						thanhPho: cri.city
					}
				});
            }
            
            if(cri.district && $.trim(cri.district) !== '' && $.trim(cri.district) !== 'all'){
				queryBody.must.push({
					match:{
						quanHuyen: cri.district
					}
				});
            }

            if(cri.direction && $.trim(cri.direction) !== '' && $.trim(cri.direction) !== 'all'){
				queryBody.must.push({
					match:{
						huongNha: cri.direction
					}
				});
            }

            if(cri.priceFrom && cri.priceTo){
				queryBody.must.push( {
                    range: {
                      tongGia: {
                        gte: priceFrom,
                        lte: priceTo
                      }
                    }
                });
            }
           
			// query.sort = 'timestampCreated:desc';
			// if (cri.sort && cri.sort === 'timestampModified') {
			// 	query.sort = cri.sort + ':desc';
            // }else if(cri.sort && cri.sort === 'displayOrder'){
            //     query.sort = cri.sort + ':asc';
            // }else if(cri.sort && cri.sort === 'name'){
            //     query.sort = cri.sort + '.raw';
            // }
			// if(queryBody.must.length === 0){
			// 	delete queryBody.must;
            // }
            console.log('query');
            console.log(query);
			return searchService.search(query, rootPath, true);
        }
    }
})();