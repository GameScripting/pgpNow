function showMessages(content){
	console.log(content);
}

function App(){
	var self = this;
	
	self.loadViewModel = function () {
		
		var keyPair = 
			openpgp.generate_key_pair(
				1, // RSA
				"512",
				"Daniel Huhn",
				"");
		
		var privateKey = keyPair.privateKeyArmored;
		var publicKey = keyPair.publicKeyArmored;
		
		self.viewModel = new ViewModel(publicKey, privateKey);
	};	
	
	self.addPartner = function(name, publicKey){
		openpgp.keyring.importPublicKey(publicKey);
		self.viewModel.people.push(new Partner(name, publicKey));
	};
}

function sampleData(){
	
	var newPublicKey = function(){
		return openpgp.generate_key_pair(
				1, // RSA
				"512",
				"Test",
				"").publicKeyArmored;
	};
	
	app.addPartner("Me", app.viewModel.own.publicKey());
	app.addPartner("Jasmin", newPublicKey());
	app.addPartner("Andre", newPublicKey());
	app.addPartner("Joachim", newPublicKey());
}

$(function(){
	window.app = new App();
	window.appEvents = new AppEvents();
	
	openpgp.init();
	
	app.loadViewModel();
	
	ko.applyBindings(app.viewModel);
	
	sampleData();
});