import React, { Component } from 'react';
import {newFile} from './js/dropzone-helpers';
import '../css/Dropzone.css';

class Dropzone extends Component {
	constructor(props) {
		super(props)

    	this.addFile = this.addFile.bind(this);

	   	this.dropzone = document.getElementById('dropzone');
	}

	addFile(evt) {
		// Helper function from dropzone-helpers that handles all the file transferring
		newFile(evt);
	}

 	openFileDialog () {
		var evt = new MouseEvent('click');
		document.getElementById('addFile').dispatchEvent(evt);
	}

    render() {
        return(
		    <div className="dropzone" id="dropzone" onClick={this.openFileDialog}>
		        <span>Drop the files here...</span>
		    	<input type="file" id="addFile" onChange={this.addFile} multiple/>
		    </div>
        );
    }
}

export default Dropzone;
