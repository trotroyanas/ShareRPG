let Retour = require("../models/retour.json");
const { v4: uuidv4 } = require("uuid");

const User = require("../models/User.json");
const crypto = require("crypto-js");
const cache = require("./cache.js");
const cnx = require("./CnxBDD.js");

const jwt = require("jsonwebtoken");
const jwtpwd = require("../config/jwt.json");
const base64 = require("base-64");

const ExpToken = 3600 * 24;

//Encodage SH256
function EncPwd(pw) {
  const hash = crypto.SHA256(pw);
  const npwd = hash.toString(crypto.enc.Base64);
  return npwd;
}

// Check email //
exports.EmailExist = async (req, res) => {
  let email = req.params.email;
  let userid = "";
  try {
    userid = req.params.userid;
  } catch (e) {
    console.log(e.messsage);
  }

  //console.log(email);
  //console.log(userid);

  try {
    //Cnx BDD
    let db = await cnx.CnxDB();
    let docRef = await db.collection("users");

    await docRef
      .where("email", "==", email)
      .limit(1)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          //console.log("email non trouvé");
          Retour.status = 0;
          Retour.detail = "email not found";
          res.status(200).json(Retour);
          return;
        } else {
          snapshot.forEach((doc) => {
            if (userid === doc.id) {
              Retour.status = 0;
              Retour.detail = "Update Possible";
              res.status(200).json(Retour);
              return;
            } else {
              Retour.status = 1;
              Retour.detail = "email already exist";
              res.status(200).json(Retour);
              return;
            }
          });
        }
      });
  } catch (err) {
    console.log("error");
    Retour.status = 1;
    Retour.detail = err.message;
    console.log(Retour);
    res.status(500).json(Retour);
    return;
  }
};

async function PassCtrl(userid) {
  try {
    let db = await cnx.CnxDB();
    let docRef = await db.collection("users").doc(userid);

    let getDoc = await docRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          Retour.status = 1;
          Retour.detail = "No such document!";
        } else {
          Retour.status = 0;
          Retour.detail = { password: doc.data().password };
        }
      })
      .catch((err) => {
        Retour.status = 1;
        Retour.detail = err;
        console.log(Retour);
      });
    return Retour;
  } catch (err) {
    Retour.status = 1;
    Retour.detail = err;
    console.log(Retour);
    return Retour;
  }
}

function DecToken(token) {
  const tok = token.split(".");
  var jsonPayload = base64.decode(tok[1]);
  //console.log(decodedData);
  return JSON.parse(jsonPayload);
}

exports.Get = async (req, res) => {
  try {
    //Cnx BDD
    let db = cnx.CnxDB();

    let docRef = await db.collection("users").doc(req.params.userid);
    let getDoc = docRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          Retour.status = 1;
          Retour.detail = "No such document!";
          res.status(500).json(Retour);
          return;
        } else {
          //console.log('Document data:', doc.data());
          Retour.status = 0;
          Retour.detail = {
            nickname: doc.data().nickname,
            email: doc.data().email,
          };
          res.status(200).json(Retour);
          return;
        }
      })
      .catch((err) => {
        Retour.status = 1;
        Retour.detail = err;
        console.log(Retour);
        res.status(500).json(Retour);
        return;
      });
  } catch (err) {
    Retour.status = 1;
    Retour.detail = err;
    console.log(Retour);
    res.status(500).json(Retour);
    return;
  }
};

exports.Add = async (req, res) => {
  try {
    //recupère les chammps du modèle
    let nUser = User;
    Object.keys(nUser).forEach((key) => {
      nUser[key] = req.body[key];
    });

    //enc password
    nUser.password = EncPwd(nUser.password);
    //Horodatage du user
    const dte = new Date().toISOString();
    let tstamp = Math.round(new Date().getTime());
    nUser.created = dte;
    nUser.timestamp = tstamp;

    //Cnx BDD
    let db = cnx.CnxDB();

    const uuid = uuidv4();
    let docRef = await db.collection("users").doc(uuid);
    docRef
      .set(nUser)
      .then((e) => {
        console.log("success : ");
        Retour.detail = {
          ...nUser,
          id: uuid,
        };
        res.status(200).send(Retour);
      })
      .catch((err) => {
        Retour.status = 1;
        Retour.detail = err;
        res.status(500).json(Retour);
      });
  } catch (err) {
    Retour.status = 1;
    Retour.detail = err;
    console.log(err);
    res.status(500).json(Retour);
  }
};

exports.Del = async (req, res) => {
  try {
    //Verify cle_api
    let kc = cache.ReadCache(req.params.cle_api);
    if (kc.status == 1) {
      console.log(kc);
      res.status(200).json(kc);
      return;
    }

    let db = cnx.CnxDB();
    let deleteDoc = await db.collection("users").doc(req.params.userid).delete();
    let er = {
      status: 0,
      detail: req.params.userid,
    };
    console.log("userid:" + req.params.userid + " deleted.");
    res.status(200).json(er);
  } catch (err) {
    let er = {
      status: 1,
      detail: err,
    };
    res.status(500).json(er);
  }
};

exports.Put = async (req, res) => {
  try {
    //console.log("iuserid:" + req.params.userid);
    //console.log(req.body);
    let db = cnx.CnxDB();
    let updDoc = await db.collection("users").doc(req.params.userid);
    let upd = updDoc.update(req.body);
    let er = {
      status: 0,
      detail: req.body,
    };
    //console.log("userid:" + req.params.userid + " deleted.");
    res.status(200).json(er);
  } catch (err) {
    let er = {
      status: 1,
      detail: err,
    };
    res.status(500).json(er);
  }
};

exports.Login = async (req, res) => {
  try {
    const passEnc = EncPwd(req.body.password);

    let db = cnx.CnxDB();
    let docRef = await db.collection("users");

    await docRef
      .where("email", "==", req.body.email)
      .where("password", "==", passEnc)
      //.where("valid", "==", true)
      //.orderBy('timestamp')
      .limit(1)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          //console.log("email non trouvé");
          Retour.status = 1;
          Retour.detail = "Error email/password not found";
          console.log(Retour);
          res.status(200).json(Retour);
          return;
        } else {
          snapshot.forEach((doc) => {
            if (doc.data().valid === true) {
              Retour.status = 0;
              let obj = {
                userid: doc.id,
                nickname: doc.data().nickname,
                email: doc.data().email,
              };
              Retour.detail = jwt.sign(obj, jwtpwd.secret, {
                algorithm: "HS256",
                expiresIn: ExpToken,
              });
              res.status(200).json(Retour);
              return;
            } else {
              Retour.status = 1;
              Retour.detail = "email not validated";
              res.status(200).json(Retour);
              return;
            }
            //console.log(Retour);
          });
        }
      });
    //console.log("fin :" + Ret);
  } catch (err) {
    Retour.status = 1;
    Retour.detail = err;
    console.log(Retour);
    res.status(500).json(Retour);
    return;
  }
};

exports.ChgPwd = async (req, res) => {
  try {
    let token = req.headers.authorization.substring(7);
    var decoded = await jwt.verify(token, jwtpwd.secret);
    const userid = decoded.userid;

    let user = await PassCtrl(userid);
    const cupwd = EncPwd(req.body.current_password); // current password pour Verif vs User.detail.password
    const Npwd = {
      password: EncPwd(req.body.password), // nouveau password encodé
    };

    if (user.status === 0 && user.detail.password === cupwd) {
      // comparaison des passwords
      let db = await cnx.CnxDB();
      let updDoc = await db.collection("users").doc(decoded.userid);
      let upd = await updDoc.update(Npwd);
      Retour.status = 0;
      Retour.detail = "Password updated.";
      res.status(200).json(Retour);
      return;
    } else {
      Retour.status = 1;
      Retour.detail = "Invalid password";
      res.status(200).json(Retour);
      return;
    }
  } catch (err) {
    Retour.status = 1;
    Retour.detail = err;
    res.status(500).json(Retour);
  }
};

exports.Profil = async (req, res) => {
  try {
    //Cnx BDD
    let db = cnx.CnxDB();

    let docRef = await db.collection("users").doc(req.params.userid);
    let getDoc = docRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          Retour.status = 1;
          Retour.detail = "No such document!";
          res.status(500).json(Retour);
          return;
        } else {
          //console.log('Document data:', doc.data());
          Retour.status = 0;
          Retour.detail = doc.data();
          res.status(200).json(Retour);
          return;
        }
      })
      .catch((err) => {
        Retour.status = 1;
        Retour.detail = err;
        console.log(Retour);
        res.status(500).json(Retour);
        return;
      });
  } catch (err) {
    Retour.status = 1;
    Retour.detail = err;
    console.log(Retour);
    res.status(500).json(Retour);
    return;
  }
};

exports.ReNew = async (req, res) => {
  try {
    let token = req.headers.authorization.substring(7);
    console.log(token);
    const PayLoad = DecToken(token);

    Retour.status = 0;
    let obj = {
      userid: PayLoad.userid,
      nickname: PayLoad.nickname,
      email: PayLoad.email,
    };
    Retour.detail = jwt.sign(obj, jwtpwd.secret, {
      algorithm: "HS256",
      expiresIn: ExpToken,
    });

    res.status(200).json(Retour);
    return;
  } catch (err) {
    Retour.status = 1;
    Retour.detail = err;
    console.log(Retour);
    res.status(500).json(Retour);
    return;
  }
};
