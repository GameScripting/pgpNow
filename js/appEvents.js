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

        cryptor.encryptForSelectedPartnerSync(orignalText, function(encrypted){
            encryptTextArea.val(encrypted);
            encryptTextArea.select();
        });
    };
    
    self.decryptFromPartner = function(){

        if(!app.viewModel.selectedPartner()){
            toastr.error("Please select a partner to verify the signature against.");
            return;
        }
        
        var decryptTextArea = $("#decryptTextArea");
        var encryptedText = decryptTextArea.val();
        
        cryptor.decryptForSelectedPartnerSync(encryptedText, function(state, decrypted){
            if(decrypted) {
                decryptTextArea.val(decrypted);
            }
            
            if(state.error){
                toastr.error(state.error);
                return;
            }
            
            if(state.success){
                toastr.success(state.success);
            }
        });
    };

	self.displayPrivateKey = function(){
		$("#privateKeyContainer").removeClass("hidden");
		$("#showPrivateKeyLinkContainer").addClass("hidden");
	};

    self.showWelcomeImportExistingKey = function(){
        $("#welcomeGenerateNewKey").addClass("hidden");
        $("#welcomeImportExistingKeys").removeClass("hidden");
        $("#textareaImportExistingKey").focus();
    };

    self.showWelcomeGenerateNewKey = function() {
        $("#welcomeImportExistingKeys").addClass("hidden");
        $("#welcomeGenerateNewKey").removeClass("hidden");
        $("#newUsernameInput").focus();
    };
}
