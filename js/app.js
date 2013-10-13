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
		var newPartner = new Partner(name, publicKey);
		self.viewModel.people.push(newPartner);
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
	
	$('#editSelectedPartner').magnificPopup({
	  items: {
	      src: $("#editPartner"),
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
	
	setupPopups();	
	openpgp.init();	
	app.loadViewModel();
	ko.applyBindings(app.viewModel);
	
	//sampleData();
});