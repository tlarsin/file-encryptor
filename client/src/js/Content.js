import React, { Component } from 'react';
import {encrypt, decrypt, fileLength} from './js/dropzone-helpers';
import '../css/Content.css';

class Content extends Component {
    constructor(props) {
		super(props)

        this.passphrase = '';

        this.encryptFile = this.encryptFile.bind(this);
        this.decryptFile = this.decryptFile.bind(this);

        this.getPassphrase = this.getPassphrase.bind(this);
    }

    encryptFile () {
        encrypt(this.getPassphrase());
    }

    decryptFile () {
        decrypt(this.getPassphrase());
    }

    getPassphrase () {
        var pass = document.getElementById('passphrase').value;
        
        if(pass.length > 5 && fileLength()) return pass;
        else alert("Please make sure you have uploaded a file an entered a passphrase longer than 5 characters.");
    }

    render() {
        return(
	        <div className="choices">
				<div className="input_data">
					<p>Please enter a secure passphrase -- make sure to memorize it as this is the only way to decrypt your file.</p>
			        <input id="passphrase" type="password" placeholder="i.e. secure dog floats away ..."/>
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
