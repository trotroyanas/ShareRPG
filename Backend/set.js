const admin = require('firebase-admin');
const {
    v4: uuidv4
} = require('uuid');
let serviceAccount = require('./sharerpg-772e6-f9609743f0e5.json');


function ApiSet(req) {
    return new Promise((reject, resolve) => {
        try {
            try {
                let db = admin.firestore();
            } catch {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });

            }

            let db = admin.firestore();
            const user = uuidv4();
            let docRef = db.collection('users').doc(user);

            let dat = {
                "id": user,
                "email": req.body.email,
                "pseudo": req.body.pseudo,
                "nom": req.body.nom,
                "prenom": req.body.prenom,
                "password": req.body.password
            }
            console.log("objet");
            console.log(dat);

            //let setAda = 
            docRef.set(dat)
                .then(e => {
                    console.log("success");
                    resolve(dat)
                })
                .catch(err => {
                    console.log("error");
                    throw err;
                    //reject(err)
                })

        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}


module.exports = {
    ApiSet: ApiSet
}