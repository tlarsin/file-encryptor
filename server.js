const config = require('./config'),
	  express = require('express'),
	  http = require('http'),
	  bodyParser = require('body-parser'),
	  cors = require('cors'),
	  rp = require('request-promise'),
	  CryptoJS = require("crypto-js"),
	  fs = require('fs'),
	  path = require('path'),
	  request = require('request')
	  download = require('download'),
	  promise = require('promise'),
	  stringify = require('json-stringify-safe');


const app = express(),
    httpServer = http.createServer(app);

const port = 5000;

app.use(express.static(__dirname + '/public/'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("port", port);
app.use(cors());


/*******************/
/*  POST Requests  */
/*******************/

/* Upload files to folder */
app.post('/upload', (req, res) => {

	var file = req.body;
	var fileName = file.name;
	var fileContents = file.contents;
	var fileType = file.type;
    var filePath = config.upload_dir + '/' + fileName;

	if(fs.existsSync(config.upload_dir)) {
        fs.writeFile(filePath, fileContents, (error) => { /* handle error */ });
	}
	else{
		console.log('Doesnt exit');
	}
	res.send()
});

app.post('/encrypt', (req, res) => {
	var file = req.body;
	var fileName = file.name;
	var passphrase = file.passphrase;

    var filePath = config.upload_dir + '/' + fileName;

    if(fs.existsSync(filePath)) {
        var text = fs.readFileSync(filePath,'utf8');

        var new_ciphertext = CryptoJS.AES.encrypt(text, passphrase);

        fs.writeFile(filePath + '.encrypted', new_ciphertext, (error) => { /* handle error */ });

		var data = {};
		data.contents = new_ciphertext;
		data.name = fileName + '.encrypted'

		// console.log('File name: ' + contents.fileName);
		res.send(stringify(data));
	}
});

app.post('/decrypt', (req, res) => {
	var file = req.body;
	var fileName = file.name;
	var passphrase = file.passphrase;

    var filePath = config.download_dir + '/' + fileName;

    if(fs.existsSync(filePath)) {
        var text = fs.readFileSync(filePath,'utf8');

        var new_ciphertext = CryptoJS.AES.decrypt(text, passphrase);

        fs.writeFile(filePath, new_ciphertext, (error) => { /* handle error */ });
		// download('http://localhost:5000/api/upload/test.rtf').pipe(fs.createWriteStream('test.rtf.encrypted'));
	}
});

// var promise = new Promise(function (resolve, reject) {
//   get('http://localhost:5001', function (err, res) {
//     if (err) reject(err);
//     else resolve(res);
//   });
// });
/******************/
/*  GET Requests  */
/******************/

/* Testing express */
app.get('/download', (file, req, res) => {
	res.download(config.upload_dir + '/'+ file.name);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
