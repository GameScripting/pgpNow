function AppEvents(){
	var self = this;
	
	self.encryptForPartner = function(){
		
		if(!app.viewModel.selectedPartner()){
			toastr.error("Please select a partner first");
			return;
		}
		
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
		
		if(!app.viewModel.selectedPartner()){
			toastr.error("Please select a partner to verify the signature against.");
			return;
		}
		
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
