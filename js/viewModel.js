function ViewModel(publicKey, privateKey){
	var self = this;
		
	self.own = ko.mapping.fromJS({
		publicKey: publicKey,
		privateKey: privateKey
	});
	
	self.people = ko.observableArray();
	self.selectedPartner = ko.observable();
}

function Partner(name, publicKey){
	var self = this;

	self.name = ko.observable(name);
	self.publicKey = ko.observable(publicKey);	
}
