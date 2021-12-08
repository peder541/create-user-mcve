const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.reset = functions.https.onCall((data, context) => {
    let token = context.auth.token;
    let providerUid = token.firebase.identities['google.com'][0];
    
    return admin.auth().deleteUser(context.auth.uid).then();
});

exports.simulate = functions.https.onCall((data, context) => {
    let token = context.auth.token;
    let providerUid = token.firebase.identities['google.com'][0];
    
    return admin.auth().deleteUser(context.auth.uid).then(() => {
        return admin.auth().createUser({
            displayName: token.name 
        })
        .then(user => {
            return admin.auth().updateUser(user.uid, {
                providerToLink: {
                    providerId: 'google.com',
                    uid: providerUid
                }
            });
        });
    });
});
