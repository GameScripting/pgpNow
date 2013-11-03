function showMessages(content){
	console.log(content);
}

function App(){
	var self = this;
	
	self.load = function (callback) {
		appStorage.loadState(callback);
  };
	
	self.addPartner = function(name, publicKey){
		var newPartner = new Partner(name, publicKey);
		self.viewModel.partners.push(newPartner);
		return newPartner;
	};
}

function setupDom(){
	
	$('#showOwnKeysButton').magnificPopup({
	  items: {
	      src: $("#ownKeysBox"),
	      type: 'inline',
	      midClick: true
	  }
	});

	// ensure the browser will not open dragged files
	window.addEventListener("dragover",function(e){
	  e = e || event;
	  e.preventDefault();
	},false);
	window.addEventListener("drop",function(e){
	  e = e || event;
	  e.preventDefault();
	},false);

	fileCryptor.setupEncryptDrop($("#fileEncryptionDragArea"));
	fileCryptor.setupDecryptDrop($("#fileDecryptionDragArea"));
}

$(function(){
	window.app = new App();
	window.appEvents = new AppEvents();
	window.partnerManager = new PartnerManager();
	window.appStorage = new AppStorage();
	window.cryptor = new Cryptor();
	window.fileCryptor = new FileCryptor();
	
	setupDom();
	openpgp.init();
	app.load(function(){
      app.viewModel.selectedPartners.subscribe(function(partners) {
        appStorage.saveState();
      });
      ko.applyBindings(app.viewModel);
	});
});