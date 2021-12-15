const functions = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

let app = initializeApp();
let auth = getAuth();

exports.reset = functions.https.onCall((data, context) => {
    let token = context.auth.token;
    let providerUid = token.firebase.identities['google.com'][0];
    
    return auth.deleteUser(context.auth.uid).then();
});

exports.simulate = functions.https.onCall((data, context) => {
    let token = context.auth.token;
    let providerUid = token.firebase.identities['google.com'][0];
    
    return auth.deleteUser(context.auth.uid).then(() => {
        return auth.createUser({
            displayName: token.name 
        })
        .then(user => {
            return auth.updateUser(user.uid, {
                providerToLink: {
                    providerId: 'google.com',
                    uid: providerUid
                }
            });
        });
    });
});
