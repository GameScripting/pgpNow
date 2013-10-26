function ViewModel(publicKey, privateKey, partners){
	var self = this;
		
	self.own = ko.mapping.fromJS({
		publicKey: publicKey,
		privateKey: privateKey
	});
	
	self.partners = ko.observableArray(partners);
	self.selectedPartner = ko.observable();
	
	self.tmp = {
		editPartnerPublicKey: ko.observable()
	};
}

function Partner(name, publicKey){
	var self = this;

	self.name = ko.observable(name);
	self.publicKey = ko.observable(publicKey);	
}
