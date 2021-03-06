'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash');
const request = require('request-promise');
const cors = require('cors')({
	origin: true
});
//var bodyParser = require('body-parser');
admin.initializeApp(functions.config().firebase);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
// 	extended : true
// }));



// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
// exports.elasticIndexBDS = functions.database.ref("/bds/{type}/{bdsId}").onWrite((entry) => {
//         let BDS = entry.data.val();
// 		let bdsId   = entry.params.bdsId;
// 		let elasticsearchFields = ['huongNha','dienTich','quanHuyen','thanhPho','tongGia','loaiBDS','uid','timestampCreated','dai','ngang'];
// 		let elasticSearchConfig = functions.config().elasticsearch;
// 		let elasticSearchUrl = elasticSearchConfig.url + 'live-bds/bds/' + bdsId;
// 		let elasticSearchMethod = BDS ? 'POST' : 'DELETE';

// 		let elasticsearchRequest = {
// 			method: elasticSearchMethod,
// 			uri: elasticSearchUrl,
// 			auth: {
// 				username: elasticSearchConfig.username,
// 				password: elasticSearchConfig.password,
// 			},
//             body: _.pick(BDS, elasticsearchFields),
// 			//body: BDS,
// 			json: true
// 		};

// 		return request(elasticsearchRequest).then(response => {
// 			console.log('response');
// 			console.log(response);
// 		})
// });

// Start writing Firebase Functions
// https://firebase.google.com/functions/write-firebase-functions
exports.indexQuyTrinhPhapLy = functions.database.ref("/quy-trinh-phap-ly/{entryId}").onWrite((entry) => {
		console.log('start indexQuyTrinhPhapLy')
		let data = entry.data.val();
		let id  = entry.params.entryId;
		let elasticsearchFields = ['tenQuyTrinh','quanHuyen','thanhPho','timestampCreated'];
		let elasticSearchConfig = functions.config().elasticsearch;
		let elasticSearchUrl = elasticSearchConfig.url + 'live-quy-trinh-phap-ly/quy-trinh-phap-ly/' + id;
		let elasticSearchMethod = data ? 'POST' : 'DELETE';

		let elasticsearchRequest = {
			method: elasticSearchMethod,
			uri: elasticSearchUrl,
			auth: {
				username: elasticSearchConfig.username,
				password: elasticSearchConfig.password,
			},
			body: _.pick(data, elasticsearchFields),
			json: true
		};

		return request(elasticsearchRequest).then(response => {
			console.log('end indexQuyTrinhPhapLy');
			console.log(response);
		})
});
