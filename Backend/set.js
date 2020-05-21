const admin = require('firebase-admin');
const {
    v4: uuidv4
} = require('uuid');
let serviceAccount = require('./keys/sharerpg-firebase.json');


function ApiSet(req) {
    return new Promise((resolve, reject) => {
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
            //console.log("objet");
            //console.log(dat);

            const er = {
                status: 0,
                detail: {}
            }
            //let setAda = 
            docRef.set(dat)
                .then(e => {
                    console.log("success");
                    er.detail = dat
                    resolve(er)
                })
                .catch(err => {
                    er.status = 1;
                    reject(er)
                    //reject(err)
                })

        } catch (err) {
            console.log(err);
            er.status = 1;
            reject(er)
        }
    })
}


module.exports = {
    ApiSet: ApiSet
}