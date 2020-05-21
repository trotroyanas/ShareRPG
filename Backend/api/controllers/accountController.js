const admin = require('firebase-admin');
const {
  v4: uuidv4
} = require('uuid');
let serviceAccount = require('../config/sharerpg-firebase.json')
const User = require("../models/User.json");
const crypto = require("crypto-js");

//Encodage SH256
function EncPwd(pw) {
  const hash = crypto.SHA256(pw);
  const npwd = hash.toString(crypto.enc.Base64)
  return npwd;
}

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

// Check email //
async function EmailExist(email) {
  try {
    let er = {
      status: 0,
      detail: {}
    }

    //Cnx BDD
    let db = await CnxDB();
    let docRef = await db.collection('users');

    await docRef.where('email', '==', email).get()
      .then(snapshot => {
        if (snapshot.empty) {
          //console.log("email non trouvé");
          er.status = 0
          er.detail = "email not found"
        } else {
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
          });
          er.status = 1
          er.detail = "email already exist"
        }
      })
    //console.log("fin :" + Ret);
    return er;
  } catch (err) {
    let er = {
      status: 1,
      detail: err
    }
    console.log(er)
    return er;
  }
}


exports.Add = async (req, res) => {
  try {

    let er = {
      status: 0,
      detail: {}
    }

    const emExist = await EmailExist(req.body.email)
    //console.log(emExist);

    if (emExist.status === 1) {
      er = emExist;
      console.log(er)
      res.status(500).json(er);
      return
    }

    //recupère les chammps du modèle
    let nUser = User;
    Object.keys(nUser).forEach((key) => {
      nUser[key] = req.body[key];
    });

    //enc password
    nUser.password = EncPwd(nUser.password);

    //Cnx BDD
    let db = CnxDB();

    const uuid = uuidv4();
    let docRef = await db.collection('users').doc(uuid);
    docRef.set(nUser)
      .then(e => {
        console.log("success : ");
        er.detail = {
          ...nUser,
          id: uuid
        }
        //console.log(er);
        //console.log("fin");
        res.status(200).send(er)
      })
      .catch(err => {
        er.status = 1;
        er.detail = err;
        res.status(500).json(er)
      })
  } catch (err) {
    let er = {
      status: 1,
      detail: err
    }
    res.status(500).json(er);
  }
}

exports.Del = async (req, res) => {
  try {
    let db = CnxDB();
    let deleteDoc = await db.collection('users').doc(req.params.userId).delete();
    let er = {
      status: 0,
      detail: req.params.userId
    }
    console.log("userId:" + req.params.userId + " deleted.");
    res.status(200).json(er);
  } catch (err) {
    let er = {
      status: 1,
      detail: err
    }
    res.status(500).json(er);
  }
};

exports.Put = async (req, res) => {
  try {
    console.log("iuserId:" + req.params.userId);
    console.log(req.body);
    let db = CnxDB();
    let updDoc = await db.collection('users').doc(req.params.userId);
    let upd = updDoc.update(req.body)
    let er = {
      status: 0,
      detail: req.body
    }
    //console.log("userId:" + req.params.userId + " deleted.");
    res.status(200).json(er);
  } catch (err) {
    let er = {
      status: 1,
      detail: err
    }
    res.status(500).json(er);
  }
};



exports.Check = async (req, res) => {
  try {
    const emExist = await EmailExist(req.body.email)
    res.status(200).json(emExist)
    return
  } catch (err) {
    let er = {
      status: 1,
      detail: err
    }
    res.status(500).json(er);
    return
  }
};