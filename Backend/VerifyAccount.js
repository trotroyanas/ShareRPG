const admin = require('firebase-admin');
const {
    v4: uuidv4
} = require('uuid');
let serviceAccount = require('./keys/sharerpg-firebase.json');


function ApiVerifAccount(req) {
    return new Promise((resolve, reject) => {
        try {
            try {
                let db = admin.firestore();
            } catch {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });

            }

            const er = {
                status: 0,
                detail: "Success"
            }

            let db = admin.firestore();
            let docRef = db.collection('users');


            let query = docRef
                .where('email', '==', req.email).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        //console.log(er);
                        console.log("passe 1");
                        resolve(er)
                    } else {
                        er.status = 1;
                        er.detail = "Email already exist."
                        console.log("passe 2");
                        console.log(er);
                        resolve(er)
                    }
                })
                .catch(err => {
                    er.status = 1;
                    er.detail = err
                    console.log("passe 3");
                    console.log(err);
                    reject(er)
                });
        } catch (err) {
            console.log("passe 4");
            console.log(err);
            reject(err)
        }
    })
}


module.exports = {
    ApiVerifAccount
}