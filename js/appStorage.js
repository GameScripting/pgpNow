function AppStorage() {
  var self = this;

  var STATE = "state";

  function createNew(name) {
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

  function showEnterNewUserNameModal(cb) {
    var newUsernameInput = $("#newUsernameInput");
    newUsernameInput.val("");

    setTimeout(function () {
      newUsernameInput.select();
    }, 250);

    var userNameEntered = false;
    var showModal = function () {
      $("#createNewKeys").modal("show");
    };
    showModal();

    $("#setNewUsernameForm").submit(function () {
      var username = newUsernameInput.val();
      if (username) {
        userNameEntered = true;
        $("#setNewUsernameButton").attr("disabled", true);
        setTimeout(function () {
          var viewModel = createNew(username);
          cb(viewModel);
        }, 100);
      }

      return false;
    });

    $("#importExistingKeyButton").click(function () {
      var privateKeyString = $("#textareaImportExistingKey").val();
      if (privateKeyString) {
        try {
          var privateKey = openpgp.read_privateKey(privateKeyString)[0];
        } catch (err) {
          toastr.error("Unable to parse private key. It seems to be broken :(");
          $("#textareaImportExistingKey").select();
          return;
        }
        var publicKeyString = privateKey.extractPublicKey();

        userNameEntered = true;

        var viewModel = new ViewModel(publicKeyString, privateKeyString);
        cb(viewModel);
      }
    });
  }

  self.saveState = function () {
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

  self.loadState = function (cb) {
    var state = $.jStorage.get(STATE);
    if (!state) {
      $("#createNewKeys").modal("show");
      $("#setNewUsernameForm").submit(function () {
        $(this).find("input").attr("disabled", true);
        $(this).find("input:submit").val("Generating key…");

        setTimeout(function () {
          app.viewModel = createNew($("#newUsernameInput").val());
          self.saveState();
          $("#createNewKeys").modal("hide");
        }, 100);
        return false;
      });
    }
    else {
      var partners = ko.mapping.fromJS(state.partners)();
      partners = partners.map(function (p) {
        return new Partner(p.name, p.publicKey);
      });
      var viewModel = new ViewModel(
        state.own.publicKey,
        state.own.privateKey,
        partners);

      app.viewModel = viewModel;
      if (cb) cb();
    }
  };
}
