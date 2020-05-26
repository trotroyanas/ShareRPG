let serviceAccount = require('../config/sharerpg-firebase.json')
const admin = require('firebase-admin');


// connexion DB //

function CnxDB() {
    let db = null;
    try {
        db = admin.firestore();
    } catch {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
    }
    return db;
}


module.exports = {
    CnxDB
}