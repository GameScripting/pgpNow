function PartnerManager(){
    var self = this;
    
    self.showNewPartnerModal = function() {
        
        app.viewModel.tmp.editPartnerPublicKey("");
        modalManager.showModal($("#editPartner"));
        
        setTimeout(function(){
            $("#partnerPublicKey").focus();
        },250);
    };
    
    self.savePartner = function(){
        var publicKeyString = app.viewModel.tmp.editPartnerPublicKey();
                
        var partnerName;
        try{
            var publicKey = openpgp.read_publicKey(publicKeyString)[0];
            var partnerName = publicKey.userIds[0].text;
        } catch(err) {
            toastr.error("Invalid PGP public key!");
            return;
        }        
        
        app.addPartner(partnerName, publicKeyString);
        appStorage.saveState();
                
        toastr.success('Added partner "' + partnerName + '" to the partner list.');        
        modalManager.closeModal();
    };
    
    self.removeSelected = function(){
        var selectedPartner = app.viewModel.selectedPartner();
        
        if(!selectedPartner){
            toastr.error("Please select a partner to remove");
            return;
        }
        
        app.viewModel.partners.remove(selectedPartner);
        app.viewModel.selectedPartner(null);
        appStorage.saveState();
        
        toastr.success('Partner "' + selectedPartner.name() + '" removed'); 
    };
}
