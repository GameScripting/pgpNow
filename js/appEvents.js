function AppEvents(){
	var self = this;
	
	self.encryptForPartner = function(){
		
		var publicKeyString = app.viewModel.selectedPartner().publicKey();
		var privateKeyString = app.viewModel.own.privateKey();
						
		var publicKey = openpgp.read_publicKey(publicKeyString)[0];
		var privateKey = openpgp.read_privateKey(privateKeyString)[0];		 
		
		var encryptTextArea = $("#encryptTextArea");
		var orignalText = encryptTextArea.val();
				
		var encrypted = openpgp.write_signed_and_encrypted_message(
			privateKey,
			[publicKey],
			orignalText);
			
		encryptTextArea.val(encrypted);
		encryptTextArea.select();
	};
	
	self.decryptFromPartner = function(){
		
		var publicKeyString = app.viewModel.selectedPartner().publicKey();
		var privateKeyString = app.viewModel.own.privateKey();
						
		var publicKey = openpgp.read_publicKey(publicKeyString)[0];
		var privateKey = openpgp.read_privateKey(privateKeyString)[0];		 		
		
		var decryptTextArea = $("#decryptTextArea");
		var encryptedText = decryptTextArea.val();
		
		var message = openpgp.read_message(encryptedText)[0];
		var sessionKey = message.sessionKeys[0];
		
		// bugfix
		if(!privateKey.keymaterial){
			privateKey.keymaterial = privateKey.privateKeyPacket;
		}
		
		// bugfix
		if(!publicKey.obj){
			publicKey.obj = publicKey;
		}
		
		var decrypted = message.decryptAndVerifySignature(
			privateKey,
			sessionKey,
			[publicKey]);
			
		for(var i in decrypted.validSignatures){
			var sig = decrypted.validSignatures[i];
			if(!sig){
				toastr.error("The message has been altered!");
			}
		}
			
		decryptTextArea.val(decrypted.text);
		toastr.success("Decrypted message, everything ok.");
	};
}
