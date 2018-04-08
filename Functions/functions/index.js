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
exports.elasticIndexBDS = functions.database.ref("/bds/{type}/{bdsId}").onWrite((entry) => {
        let BDS = entry.data.val();
		let bdsId   = entry.params.bdsId;
		BDS.$id = bdsId;
		console.log('Indexing BDS ', bdsId, BDS);

		let elasticsearchFields = ['$id','huongNha','dienTich','quanHuyen','thanhPho','tongGia','loaiBDS','uid','timestampCreated','dai','ngang'];
		let elasticSearchConfig = functions.config().elasticsearch;
		let elasticSearchUrl = elasticSearchConfig.url + 'live-bds/bds/' + bdsId;
		let elasticSearchMethod = BDS ? 'POST' : 'DELETE';

		let elasticsearchRequest = {
			method: elasticSearchMethod,
			uri: elasticSearchUrl,
			auth: {
				username: elasticSearchConfig.username,
				password: elasticSearchConfig.password,
			},
            body: _.pick(BDS, elasticsearchFields),
			//body: BDS,
			json: true
		};

		return request(elasticsearchRequest).then(response => {
			console.log('Elasticsearch response', response);
		})
});
