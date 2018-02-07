const express = require('express'),
	  http = require('http'),
	  bodyParser = require('body-parser'),
	  cors = require('cors'),
	  rp = require('request-promise'),
	  CryptoJS = require("crypto-js");

const app = express(),
    httpServer = http.createServer(app);

const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("port", port);
app.use(cors());

var path = require('path');
var upload_dir = '/api/upload/'

/*******************/
/*  POST Requests  */
/*******************/

/* Upload files to folder */
app.post('/api/upload/', (req, res) => {
    // Encrypt

	fileName = req.body.name;
	fileContents = req.body.contents;
	
	// var passphrase = file.passphrase;
    //
    // var fileRootName = file.name;
    //
    // var filePathBase = config.upload_dir + '/';
    // var fileRootNameWithBase = filePathBase + fileRootName;
    //
    // console.log("Data: " + fileRootName + " File: ");
    //
    // var filePath = fileRootNameWithBase;
    //
    //
    // // Encrypt
    // var ciphertext = CryptoJS.AES.encrypt('my message', passphrase);
    // console.log('Encrypted version: ' + ciphertext.toString());
    //
    // // Decrypt
    // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), passphrase);
    // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    //
    // console.log('Plain text: ' + plaintext);
    //
    // if(fs.existsSync(filePath)) {
    //     var text = fs.readFileSync(filePath,'utf8');
    //
    //     console.log('Text: ' + text);
    //     var new_ciphertext = CryptoJS.AES.encrypt(text, passphrase);
    //
    //     fs.writeFile(filePath + '.encrypted', new_ciphertext, 'ascii');
    //     var url = 'http://localhost:8000/uploads/' + fileRootName + '.encrypted';
    //     console.log(url);
    //
    //     // request(url).pipe(fs.createWriteStream(fileRootName + '.encrypted'));
    //     response.(url)
    // }
});

/******************/
/*  GET Requests  */
/******************/

/* Testing express */
app.get('/api/download', (file, req, res) => {
	res.download(upload_dir + file);
});


app.listen(port, () => console.log(`Listening on port ${port}`));
