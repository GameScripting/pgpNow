function showMessages(content){
	console.log(content);
}

function App(){
	var self = this;
	
	self.load = function (cb) {
		appStorage.loadState(cb);
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

$(function(){
	window.app = new App();
	window.appEvents = new AppEvents();
	window.modalManager = new ModalManager();
	window.partnerManager = new PartnerManager();
	window.appStorage = new AppStorage();
	
	setupPopups();	
	openpgp.init();	
	app.load(function(){
		ko.applyBindings(app.viewModel);		
	});
});