import React, { Component } from 'react';
import {encrypt, decrypt, fileLength} from './helpers/dropzone-helpers';
import '../css/Content.css';

class Content extends Component {
    constructor(props) {
		super(props)

        this.passphrase = '';

        this.encryptFile = this.encryptFile.bind(this);
        this.decryptFile = this.decryptFile.bind(this);

        this.getPassphrase = this.getPassphrase.bind(this);
        this.checkLength = this.checkLength.bind(this);
        this.clearInput = this.clearInput.bind(this);

        this.showPassphrase = this.showPassphrase.bind(this);
    }

    encryptFile () {
      if(this.checkLength() && fileLength())
          encrypt(this.getPassphrase());
      else alert("Please make sure you have uploaded a file and entered a passphrase longer than 5 characters.");
        this.clearInput();
    }

    decryptFile () {
      if(this.checkLength() && fileLength())
          decrypt(this.getPassphrase());
      else alert("Please make sure you have uploaded a file and entered a passphrase longer than 5 characters.");

        this.clearInput();
    }

    getPassphrase () {
        return document.getElementById('passphrase').value;
    }

    checkLength() {
      var pass = document.getElementById('passphrase').value;

      if(pass.length > 5)
        return true;
      else
        return false;
    }

    clearInput () {
        document.getElementById('passphrase').value = '';
    }

    showPassphrase() {
      var x = document.getElementById("passphrase");
      if (x.type === "password") {
          x.type = "text";
      } else {
          x.type = "password";
      }
    }

    render() {
        return(
          <div className="choices">
    				<div className="input_data">
    					<p>Please enter a secure passphrase -- make sure to memorize it as this is the only way to decrypt your file.</p>
    			        <input id="passphrase" type="password" placeholder="i.e. secure dog floats away ..."/>
                  <img src={require('../css/res/eye-slash.png')} className="pass-visible" onClick={this.showPassphrase} />
    				</div>
    				<div className="buttons">
    			        <a className="btn encrypt" id="encrypt_btn" onClick={this.encryptFile} href="#">ENCRYPT FILE</a>
    			        <a className="btn decrypt" id="decrypt_btn" onClick={this.decryptFile} href="#">DECRYPT FILE</a>
    				</div>
          </div>
        );
    }
}

export default Content;
