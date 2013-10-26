function AppStorage(){
	var self = this;
	
	var STATE = "state";	
	
	function createNew(name){
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
	}
	
	function showEnterNewUserNameModal(cb){
		var newUsernameInput = $("#newUsernameInput");
		newUsernameInput.val("");

		setTimeout(function(){ newUsernameInput.select();},250);
		
		var userNameEntered = false;
		var showModal = function(){
			modalManager.showModal($("#createNewKeys"), {
				close: function(){
					if(!userNameEntered){
						setTimeout(function(){
							showModal();
						},0);
					}
				}
			});
		};
		showModal();

		$("#setNewUsernameForm").submit(function(){
			var username = newUsernameInput.val();
			if(username){
				userNameEntered = true;
				$("#setNewUsernameButton").attr("disabled", true);
				setTimeout(function(){
					if(cb) cb(username);
				},100);
			}
			
			return false;
		});
	}
	
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
	
	self.loadState = function(cb){
		var state = $.jStorage.get(STATE);
		if(!state){
			showEnterNewUserNameModal(function(username){
				modalManager.closeModal();				
				app.viewModel = createNew(username);
				self.saveState();
				
				if(cb) cb();
			});
		} else {
			var partners = ko.mapping.fromJS(state.partners)();
			var viewModel = new ViewModel(
				state.own.publicKey,
				state.own.privateKey,
				partners);
				
			app.viewModel = viewModel;
			if(cb) cb();
		}
	};
}
