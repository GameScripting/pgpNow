function ModalManager(){
	var self = this;
	
	self.showModal = function(content, callbacks){
		
		if(!callbacks){
			callbacks = {};
		}
		
		var tmpButton = $('<button class="hidden"></button>').appendTo($("body"));
		
		var additonalOnClose = callbacks.close;
		callbacks.close = function(){
			
			tmpButton.remove();
			if(additonalOnClose) additonalOnClose();
		};
		
		tmpButton.magnificPopup({
		  items: {
		      src: content,
		      type: 'inline',
		  },
		  callbacks: callbacks
		});
		
		tmpButton.click();
	};
	
	self.closeModal = function(){
		$.magnificPopup.close();
	};
}
