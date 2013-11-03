function AppEvents(){
	var self = this;
	
	self.encryptForPartner = function(){
    // TODO: use all selectedPartners, not just the first
		var publicKeyString = app.viewModel.selectedPartners()[0].publicKey();
		var ownPublicKeyString = app.viewModel.own.publicKey();
		var privateKeyString = app.viewModel.own.privateKey();
						
		var publicKey = openpgp.read_publicKey(publicKeyString)[0];
		var ownPublicKey = openpgp.read_publicKey(ownPublicKeyString)[0];
		var privateKey = openpgp.read_privateKey(privateKeyString)[0];

		var encryptTextArea = $("#encryptTextArea");
		var orignalText = encryptTextArea.val();
				
		var encrypted = openpgp.write_signed_and_encrypted_message(
			privateKey,
			[ownPublicKey,publicKey],
			orignalText);
			
		encryptTextArea.val(encrypted);
		encryptTextArea.select();
	};
	
	self.decryptFromPartner = function(){
    // TODO: use all selectedPartners, not just the first
		var publicKeyString = app.viewModel.selectedPartners()[0].publicKey();
		var ownPublicKeyString = app.viewModel.own.publicKey();
		var privateKeyString = app.viewModel.own.privateKey();
						
		var publicKey = openpgp.read_publicKey(publicKeyString)[0];
		var ownPublicKey = openpgp.read_publicKey(ownPublicKeyString)[0];
		var privateKey = openpgp.read_privateKey(privateKeyString)[0];		 		
		
		var decryptTextArea = $("#decryptTextArea");
		var encryptedText = decryptTextArea.val();
		
		var message;		
		try {
			message = openpgp.read_message(encryptedText)[0];
		} catch(err) {
			toastr.error("Could not parse message, it seems to be broken :(");
			return;
		}
		
		// find the correct session key for the own the private key
		var sessionKey;
		for(var i in message.sessionKeys) {
			var key = message.sessionKeys[i];
			if(privateKey.privateKeyPacket.publicKey.getKeyId() == key.keyId.bytes){
				sessionKey = key;
				break;
			}
		}

		// bugfix
		if(!privateKey.keymaterial){
			privateKey.keymaterial = privateKey.privateKeyPacket;
		}
		
		// bugfix
		if(!publicKey.obj){
			publicKey.obj = publicKey;
		}
		
		if(!ownPublicKey.obj){
			ownPublicKey.obj = ownPublicKey;
		}

		var decrypted;
		try {		
			decrypted = message.decryptAndVerifySignature(
				privateKey,
				sessionKey,
				[ownPublicKey,publicKey]);
		} catch(err) {
			toastr.error("Could not decrypt the message. Its not for you, sorry.");
			return;
		}
			
		var error = false;
		for(var i in decrypted.validSignatures){
			var sig = decrypted.validSignatures[i];
			if(!sig){
				toastr.error("Signature is not valid for " + app.viewModel.selectedPartner().name());
				error = true;
			}
		}
			
		decryptTextArea.val(decrypted.text);
		if(!error){
			toastr.success("Decrypted message, everything ok.");
		}
	};
}
