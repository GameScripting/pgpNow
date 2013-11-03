function Cryptor(){
    var self = this;

    function readCryptionDataSync(cb){
        var publicKeyString = app.viewModel.selectedPartner().publicKey();
        var ownPublicKeyString = app.viewModel.own.publicKey();
        var privateKeyString = app.viewModel.own.privateKey();

        var publicKey = openpgp.read_publicKey(publicKeyString)[0];
        var ownPublicKey = openpgp.read_publicKey(ownPublicKeyString)[0];
        var privateKey = openpgp.read_privateKey(privateKeyString)[0];

        if(cb) cb(publicKey, ownPublicKey, privateKey);
    }

    self.encryptForSelectedPartnerSync = function(data, cb){
        readCryptionDataSync(function(partnerPublicKey, ownPublicKey, ownPrivateKey){
            var encrypted = openpgp.write_signed_and_encrypted_message(
                ownPrivateKey,
                [ownPublicKey,partnerPublicKey],
                data);

            if(cb) cb(encrypted);
        });
    };

    self.decryptForSelectedPartnerSync = function(data, cb){
        readCryptionDataSync(function(partnerPublicKey, ownPublicKey, ownPrivateKey){
            var message;
            try {
                message = openpgp.read_message(data)[0];
            } catch(err) {
                if(cb) cb(new Error("Could not parse message, it seems to be broken :("));
                return;
            }

            // find the correct session key for the own the private key
            var sessionKey;
            for(var i in message.sessionKeys) {
                var key = message.sessionKeys[i];
                if(ownPrivateKey.privateKeyPacket.publicKey.getKeyId() == key.keyId.bytes){
                    sessionKey = key;
                    break;
                }
            }

            /* Bugfixes for the openPgpJs library */
            if(!ownPrivateKey.keymaterial){
                ownPrivateKey.keymaterial = ownPrivateKey.privateKeyPacket;
            }

            if(!partnerPublicKey.obj){
                partnerPublicKey.obj = partnerPublicKey;
            }

            if(!ownPublicKey.obj){
                ownPublicKey.obj = ownPublicKey;
            }
            /* Bugfixes end */

            var decrypted;
            try {
                decrypted = message.decryptAndVerifySignature(
                    ownPrivateKey,
                    sessionKey,
                    [ownPublicKey,partnerPublicKey]);
            } catch(err) {
                if(cb) cb(new Error("Could not decrypt the message. Its not for you, sorry."));
                return;
            }

            var signatureValid = false;
            for(var i in decrypted.validSignatures){
                var sig = decrypted.validSignatures[i];
                if(sig){                    
                    signatureValid = true;
                    break;
                }
            }

            if(signatureValid){
                if(cb) cb({ success: "Decrypted message, everything ok." }, decrypted.text);
            } else {
                if(cb) cb(new Error("Signature is not valid for " + app.viewModel.selectedPartner().name()), decrypted.text);
            }
        });
    };
}

function Error(message){
    var self = this;

    self.error = message;
}
