import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import aes from 'crypto-js/aes';
import cryptoJsEncUtf8 from "crypto-js/enc-utf8";
import FileSaver from 'file-saver';

var supported_files = {
	".txt":"text/plain",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".pdf": "application/pdf"
};

var all_files = [];
var current_file_id = 0;
var locked = false;
var prev_count_files = 0;
var waiting = 0;

var file_name = "";
var file_contents = "";
var file_type = "";


export function newFile (evt) {
	console.log('evt: ' + evt);
	var element = evt.srcElement || evt.target;

	noopHandler(evt);
	handleFiles(element.files);
}

function noopHandler (evt) {
	evt.stopPropagation();
	evt.preventDefault();
}

function handleFiles (files) {

	var count = files.length;
	var i, j;

	if ( count > 0 ) {

		console.log('all files: ' + all_files);
		  prev_count_files = all_files.length;

		  document.getElementById('dropzone').className = 'queue';

		  for ( i = prev_count_files + waiting, j = 0; i < prev_count_files + files.length + waiting; i++, j++ ) {
				document.getElementById('dropzone').innerHTML += '<div class="file" id="file-' + i + '"><div class="name">' + files[j].name + '</div><div class="progress">Waiting...</div><div class="clear"></div></div>';
		  }

		  waiting += count;

		  if ( ! locked ) {
				waiting -= count;
				all_files.push.apply(all_files, files);
				handleNextFile();
		  }
		}
  }

  function handleNextFile () {

		if ( current_file_id < all_files.length ) {
		  locked = true;

			/* Gets name of file and checks if it has a '.encrypted' file extension
				 if so, the file progress says 'Encrypted' or 'Not encrypted'
			*/
			var file_name = all_files[current_file_id].name;
			var encrypted = file_name.includes(".encrypted");

			/* Sets message for files that have been added */
			if(encrypted) {
				document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'Encrypted';
			}
			else {
				document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'Not encrypted';
			}

		  var current_file = all_files[current_file_id];

		  var reader = new FileReader();
		  reader.onload = handleReaderLoad;
			if(current_file.type != 'application/pdf')
		  	reader.readAsDataURL(current_file);
			else
				reader.readAsText(current_file);
		} else {
		  locked = false;
		}
  }

function handleReaderLoad(evt) {

 var current_file = {
		name: all_files[current_file_id].name,
		type: all_files[current_file_id].type,
		contents: evt.target.result
  };

	file_name = all_files[current_file_id].name;
	file_contents =  current_file.contents.split(',').pop();
	file_type = current_file.type;
}

/* Check if PDF */

function readPDF() {

}

/* Exported functions into Content.js */
export function encrypt (passphrase) {
		/* Translates file contents into Base 64 */
		var fileBuffer = new Buffer(file_contents, "base64");
		/* Encryption based on passphrase */
		var cipherBuffer = aes.encrypt(fileBuffer.toString(), passphrase);

		console.log('File type: ' + file_type);
		/* Downloads file with '.encrypted' extension */
		var file = new File([cipherBuffer], file_name + '.encrypted', {type: file_type});
		FileSaver.saveAs(file);

}

export function decrypt (passphrase) {
	console.log('File type: ' + file_type);

	/* Translate file contents into Base 64 */
	var fileBuffer = new Buffer(file_contents, "base64");

	/* Base 64 file contents decryption based on passphrase then
		 translate the decrpyted bytes to UTF 8
	*/
	var bytes = aes.decrypt(fileBuffer.toString(), passphrase);

	/* Try/Catch block to handle Malformed UTF-8 error */
	try {
		var plain = bytes.toString(cryptoJsEncUtf8);

		/* Regex to remove '.encrypted' off of file name */
		file_name = file_name.substr(0, file_name.lastIndexOf('.')) || file_name;

		console.log("file type:" + file_type);
		console.log("Contents: " + plain);
		/* Downloads file */
		var file = new File([plain], file_name, {type: file_type});
		FileSaver.saveAs(file);

	} catch(e) {
		alert("Please make sure your passphrase is correct.");
	}
}

export function fileLength() {
	if (all_files.length > 0) return true;
	else return false;
}
