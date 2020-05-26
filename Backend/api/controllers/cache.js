const Retour = require('../models/retour.json')
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const cnx = require('./CnxBDD.js')




// Check email //
function FillCache() {
    try {
        //Cnx BDD
        let db = cnx.CnxDB();
        let docRef = db.collection('cles_api');

        docRef.where('valide', '==', true)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    //console.log("email non trouvé");
                    Retour.status = 1
                    Retour.detail = "Pas de clés trouvée"
                    console.log(Retour);
                    return Retour;
                } else {
                    snapshot.forEach(doc => {
                        //console.log(doc.id, '=>', doc.data());
                        myCache.set(doc.data().cle_api, doc.data().infos)
                    });
                    Retour.status = 0
                    Retour.detail = "Clés trouvées."
                    console.log(Retour);
                    let kk = myCache.keys();
                    console.log(JSON.stringify(kk));
                    return Retour;
                }
            })
        //console.log("fin :" + Ret);
    } catch (err) {
        Retour.status = 1;
        Retour.detail = err;
        console.log(Retour);
        return Retour;
    }
}

function ReadCache(cle) {
    try {

        let gk = myCache.get(cle);
        if (gk == undefined) {
            Retour.status = 1;
            Retour.detail = "api key not found"
            return Retour;
        } else {
            Retour.status = 0;
            Retour.detail = "api key found"
            return Retour;
        }
    } catch (err) {
        Retour.status = 1;
        Retour.detail = err;
        console.log(Retour);
        return Retour;
    }
}


module.exports = {
    FillCache,
    ReadCache
}