====Elastic Information====
Elastic host: https://144accd3e3c2c5fe37e5e7e7b1e13671.us-east-1.aws.found.io:9243
Kibana host:  https://96c189da348f5d77f5ad6887433c3a67.us-east-1.aws.found.io:9243

Elastic account:
luis.phan@vonic.vn / team_Vonic12345

====Deploy Functions===
Step 1: Set config elastic on functions service
run: 
firebase functions:config:set elasticsearch.username="elastic" elasticsearch.password="n170oh6NsG4GSj9zh2564Zxf" elasticsearch.url="https://144accd3e3c2c5fe37e5e7e7b1e13671.us-east-1.aws.found.io:9243/"

Step 2: Deploy 
run:
firbase deploy --only functions