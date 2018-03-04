# VCC-Admin
# TaxAssessment 

Require:
NodeJs 6.9.1 		: node -v
Java 8
Python 2.7.14		: run Python App on window

Note: Install node-gyp https://github.com/nodejs/node-gyp : npm install -g node-gyp

Install:
npm install
npm install -g bower
npm install bower
Bower install
npm install -g gulp
npm install gulp
Run:
gulp
gulp build-product 

Deploy:

1. npm install -g firebase-tools  // chạy lệnh này để cài firebase tool
2. firebase login                 //sau khi chạy lệnh này, chọn Y sẽ ra trang log in, login vào account Firebase
3. firebase init                   //khai báo firebase, chạy xong sẽ hiện danh sách chọn
4. Chọn dòng thứ 4 ( Hosting firebase ) Ấn phím space để Chọn Firebase Hosting sau đó ấn Enter
5. firebase deploy 				  // Deploy to Hosting
