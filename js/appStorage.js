function AppStorage(){
	var self = this;
	
	var STATE = "state";	
	
	function createNew(name){
		
		if(!confirm("First of all we need to generate a private key for you. This will take some time and make your browser hang (you maybe can't use it at all!')")){
			return;
		}
		
		var keyPair = 
			openpgp.generate_key_pair(
				1, // RSA
				"2048", // key size
				name,
				"");
		
		var privateKey = keyPair.privateKeyArmored;
		var publicKey = keyPair.publicKeyArmored;
		
		var viewModel = new ViewModel(publicKey, privateKey);		
		return viewModel;
	};
	
	self.saveState = function(){
		
		var vm = app.viewModel;
		
		var partners = ko.mapping.toJS(vm.partners());
		var state = {
			own: {
				publicKey: vm.own.publicKey(),
				privateKey: vm.own.privateKey()
			},
			partners: partners
		};
		$.jStorage.set(STATE, state);
	};
	
	self.loadState = function(){
		var state = $.jStorage.get(STATE);
		
		if(!state){			
			app.viewModel = createNew("Testuer");
			self.saveState();		
		} else {
			
			var partners = ko.mapping.fromJS(state.partners)();
			var viewModel = new ViewModel(
				state.own.publicKey,
				state.own.privateKey,
				partners);
				
			app.viewModel = viewModel;
		}
	};
}
