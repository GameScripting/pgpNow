function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function FileCryptor(){
	var self = this;

	function setupFileDropElement(element, mode, transform){

		element.on("dragover", function(e){
			e.preventDefault();
			e.stopPropagation();
			e.returnValue = true;
			return true;
		});

		element.on("dragenter", function(e){
			e.preventDefault();
			e.stopPropagation();
			e.returnValue = false;

			$(e.target).addClass("dragOver");

			return false;
		});

		function onDragLeave(e) {
			$(e.target).removeClass("dragOver");
		}

		element.on("dragleave", function(e){
			e.preventDefault();
			e.stopPropagation();

			onDragLeave(e);

			return false;
		});

		element.on("drop", function(e){
			// since the dragleave event will not be fired
			// call it manually
			onDragLeave(e);

			if(!app.viewModel.selectedPartner()){
				toastr.error("Please select a partner first!");
				return false;
			}

			e.preventDefault();
			e.stopPropagation();

			var files = e.originalEvent.dataTransfer.files;
			for(var i in files){
				var file = files[i];

				var reader = new FileReader();
				reader.onload = (function(f){
					return function(e){
						var content = e.target.result;
						transform(content, function(transformed){
							var blob = new Blob([transformed], {type: "text/plain"});

							switch(mode){
								case "e": {
									saveAs(blob, f.name + ".txt");
									break;
								}
								case "d": {
									var fileName = f.name;

									// if ends with .*.txt
									if(f.name.match(/\.(.{1,})\.txt$/)){
										fileName = fileName.substring(0, fileName.length - 4);
									}

									saveAs(blob, fileName);
								}
							}

							toastr.success("Operation successfull!");
						});
					};
				})(file);

				switch(mode) {
					case "e": {
						reader.readAsArrayBuffer(file);
						break;
					}
					case "d": {
						reader.readAsText(file);
						break;
					}
				}
			}

			return false;
		});
	};

	self.setupEncryptDrop = function(element){
		setupFileDropElement(element, "e", function(fileContent, cb){
			var base64 = arrayBufferBase64.toBase64(fileContent);
			cryptor.encryptForSelectedPartnerSync(base64, function(encrypted){
				cb(encrypted);
			});
		});
	};

	self.setupDecryptDrop = function(element){
		setupFileDropElement(element, "d", function(fileContent, cb){
			cryptor.decryptForSelectedPartnerSync(fileContent, function(state, decrypted){
				if(decrypted){
					// decrypted is base64
					var arrayBuffer = arrayBufferBase64.toArrayBuffer(decrypted);
					cb(arrayBuffer);
				}

				if(state.error){
					toastr.error(state.error);
					return;
				}

				if(state.success){
					toastr.success(state.success);
				}
			});
		});
	};
}
