
  var encrypt = function (evt) {
      console.log("encrypt");

      var passphrase = document.getElementById('passphrase').value;

      if(all_files.length > 0 && passphrase.length > 0) {

      console.log(file_name + " " + passphrase);

        var current_file = {
            name: file_name,
            passphrase: passphrase
        };

        console.log("file name: " + all_files[0].name);
          var xhr = new XMLHttpRequest();
          xhr.open('POST', '/encrypt', true);

          xhr.send(JSON.stringify(current_file));
      }
      else alert("Please make sure you have uploaded a file an entered a passphrase");
      // Call encryption method and have parameter the file name

      
  }

  var noopHandler = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  var drop = function (evt) {
    noopHandler(evt);
    handleFiles(evt.dataTransfer.files);
  };

  var handleFileDialog = function (evt) {
    console.log('Handle File Dialog');

    noopHandler(evt);
    var element = evt.srcElement || evt.target;
    handleFiles(element.files);
  };

  var handleFiles = function (files) {
    var count = files.length;
    var i, j;

    if ( count > 0 ) {

      prev_count_files = all_files.length;

      document.getElementById('dropzone').className = 'queue';

      waiting += count;

      if ( ! locked ) {
        waiting -= count;
        all_files.push.apply(all_files, files);
        handleNextFile();
      }
    }
  };

  var handleReaderLoad = function (evt) {

    var current_file = {
      name: all_files[current_file_id].name,
      type: all_files[current_file_id].type,
      contents: evt.target.result
    };

    file_name = all_files[current_file_id].name;

    all_files[current_file_id] = 1;
    current_file_id++;
    handleNextFile();
  }

  var handleNextFile = function () {

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
  };

  var openFileDialog = function () {
    var evt = new MouseEvent('click');
    document.getElementById('addFile').dispatchEvent(evt);
  };

  var dropzone = document.getElementById('dropzone');
  dropzone.addEventListener('click', openFileDialog, false);
  dropzone.addEventListener('dragenter', noopHandler, false);
  dropzone.addEventListener('dragexit', noopHandler, false);
  dropzone.addEventListener('dragover', noopHandler, false);
  dropzone.addEventListener('drop', drop, false);

  var addFile = document.getElementById('addFile');
  addFile.addEventListener('change', handleFileDialog);

  var encryptFile = document.getElementById('encrypt_btn');
  encryptFile.addEventListener('click', encrypt);
