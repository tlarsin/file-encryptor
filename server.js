const config = require('./config'),
	  express = require('express'),
	  http = require('http'),
	  bodyParser = require('body-parser'),
	  cors = require('cors'),
	  rp = require('request-promise'),
	  CryptoJS = require("crypto-js"),
	  fs = require('fs'),
	  path = require('path');

const app = express(),
    httpServer = http.createServer(app);

const port = 5000;

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
		console.log("EXISTS");
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
    }
});

/******************/
/*  GET Requests  */
/******************/

/* Testing express */
app.get('/download', (file, req, res) => {
	res.download(config.upload_dir + '/'+ file.name);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
