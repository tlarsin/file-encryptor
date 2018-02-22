import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import aes from 'crypto-js/aes';
import cryptoJsEncUtf8 from "crypto-js/enc-utf8";
import FileSaver from 'file-saver';

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

		  document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'Unencrypted';

		  var current_file = all_files[current_file_id];

		  var reader = new FileReader();
		  reader.onload = handleReaderLoad;
		  reader.readAsDataURL(current_file);

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

export function encrypt (passphrase) {

		console.log('name: ' + file_name);
		// file_contents = all_files[current_file_id].contents;
		var fileBuffer = new Buffer(file_contents, "base64");

		console.log('Test: ' + fileBuffer);

		var cipherBuffer = aes.encrypt(fileBuffer.toString(), passphrase);

		// console.log('File buf:' + fileBuffer)
		var file = new File([cipherBuffer], file_name + '.encrypted', {type: file_type});
		FileSaver.saveAs(file);

		// this.href = url;
		// this.target = '_blank';
		//
		// // target filename
		// this.download = file_name;

}

export function decrypt (passphrase) {

	console.log('name: ' + file_name);
	// file_contents = all_files[current_file_id].contents;


	var cipher = aes.decrypt(file_contents.toString(), passphrase);
	var fileBuffer = new Buffer(file_contents, "base64");

	var text = 'Hey yo boy'
	var ciphertext = aes.encrypt(text, 'Test this');

	var bytes = aes.decrypt(fileBuffer.toString(), passphrase);
	var plain = bytes.toString(cryptoJsEncUtf8);

	console.log('Cipher: ' + ciphertext + 'Plain: ' + plain)
	// console.log('File buf:' + fileBuffer)
	var file = new File([plain], file_name, {type: file_type});
	FileSaver.saveAs(file);

}

export function fileLength() {
	if (all_files.length > 0) return true;
	else return false;
}