var all_files = [];
console.log('All files: ' + all_files.length);
var current_file_id = 0;
var locked = false;
var prev_count_files = 0;
var waiting = 0;

var file_name = "";

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

	  document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'Uploading...';

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

	uploadFile(current_file);
}

function uploadFile (current_file) {
	return fetch('http://localhost:5000/upload' , {
		method: 'POST',
		body: JSON.stringify(current_file),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(res => {
		// Updates HTML to show if file upload Succeeded/Failed
		if(res.status)
			document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'Uploaded';
		else
			document.getElementById('file-' + current_file_id).querySelector('.progress').innerHTML = 'Failed';
		return res;

	}).catch(err => err);
}


export function encrypt () {

}

export function decrypt () {

}

export function fileLength() {
	if (all_files.length > 0) return true;
	else return false;
}
