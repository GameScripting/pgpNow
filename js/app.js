function showMessages(content){
	console.log(content);
}

function App(){
	var self = this;
	
	self.load = function () {
		appStorage.loadState();
	};
	
	self.addPartner = function(name, publicKey){
		var newPartner = new Partner(name, publicKey);
		self.viewModel.partners.push(newPartner);
		return newPartner;
	};
}

function setupPopups(){
	
	$('#showOwnKeysButton').magnificPopup({
	  items: {
	      src: $("#ownKeysBox"),
	      type: 'inline',
	      midClick: true
	  }
	});
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
	window.modalManager = new ModalManager();
	window.partnerManager = new PartnerManager();
	window.appStorage = new AppStorage();
	
	setupPopups();	
	openpgp.init();	
	app.load();
	ko.applyBindings(app.viewModel);
	
	//sampleData();
});