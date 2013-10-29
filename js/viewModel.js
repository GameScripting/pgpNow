function ViewModel(publicKey, privateKey, partners) {
  var self = this;

  self.own = ko.mapping.fromJS({
    publicKey: publicKey,
    privateKey: privateKey
  });

  self.partners = ko.observableArray(partners);
  self.selectedPartners = ko.dependentObservable(function() {
    return ko.utils.arrayFilter(self.partners(), function (partner) {
      return partner.active == true;
    });
  }, self);
  self.tmp = {
    editPartnerPublicKey: ko.observable()
  };
}

function Partner(name, publicKey) {
  var self = this;

  self.name = ko.observable(name);
  self.publicKey = ko.observable(publicKey);
  self.active = ko.observable(false);
  self.toggle = function () {
    if (self.active()) {
      self.active(false);
    } else {
      self.active(true);
    }
  };
}
