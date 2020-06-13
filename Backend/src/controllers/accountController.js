let Retour = require("../models/retour.json");
const { v4: uuidv4 } = require("uuid");

const User = require("../models/User.json");
const crypto = require("crypto-js");
const cache = require("./cache.js");
const cnx = require("./CnxBDD.js");

const jwt = require("jsonwebtoken");
const jwtpwd = require("../config/jwt.json");
const base64 = require("base-64");

const aws = require("./sendEmail.js");
const template = require("../templates/emails.json");

const ExpToken = 3600 * 24;

class Ret {
  constructor(status, detail) {
    this.status = status;
    this.detail = detail;
  }
}

//Encodage SH256
function EncPwd(pw) {
  const hash = crypto.SHA256(pw);
  const npwd = hash.toString(crypto.enc.Base64);
  return npwd;
}

function makeTokenTmp(obj) {
  const tok = jwt.sign(obj, jwtpwd.secret, {
    algorithm: "HS256",
    expiresIn: 3600,
  });
  return tok;
}

function ReturnAccountByEmail(email) {
  return new Promise(async (resolve, reject) => {
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
            reject();
          } else {
            snapshot.forEach((doc) => {
              let tt = doc.data();
              let vv = {
                ...tt,
                userid: doc.id,
              };
              resolve(vv);
            });
          }
        });
    } catch (error) {
      console.log(error.message);
      reject();
    }
  });
}

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

// Check email //
exports.EmailExist = async (req, res) => {
  let email = req.params.email;
  let userid = "";
  try {
    userid = req.params.userid;
  } catch (e) {
    console.log(e.messsage);
  }

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
        console.log("success : add account");
        Retour.status = 0;
        Retour.detail = {
          email: nUser.email,
          nickname: nUser.nickname,
          userid: uuid,
        };

        //make Tmp token
        let tokenTmp = makeTokenTmp(Retour.detail);

        //make template
        let nacc = template.new_account.replace("%nickname%", nUser.nickname).replace("%tokenTmp%", tokenTmp).replace("%tokenTmp%", tokenTmp);
        //send email
        aws
          .SendEmailAws("contact@deco-recup.fr", nUser.email, "ShareRPG : create account", nacc)
          .then((e) => {
            console.log("email Send");
            console.log("e:", e.MessageId);
            res.status(200).send(Retour);
          })
          .catch((err) => {
            console.log(err.message);
            Retour.status = 1;
            Retour.detail = err.message;
            res.status(200).send(Retour);
          });
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

exports.makeToken = async (req, res) => {
  try {
    let obj = {
      userid: "0",
      nickname: "tmp",
      email: "tmp@tmp.com",
    };
    const tokTmp = await makeTokenTmp(obj);
    Retour.status = 0;
    Retour.detail = tokTmp;
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

exports.validMail = async (req, res) => {
  try {
    let token = req.headers.authorization.substring(7);
    var decoded = await jwt.verify(token, jwtpwd.secret);
    const userid = decoded.userid;

    //Cnx BDD
    let db = cnx.CnxDB();

    let updDoc = await db.collection("users").doc(userid);
    let upd = updDoc.update({ valid: true });

    Retour.status = 0;
    Retour.detail = "Account confirmed";

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

exports.ResendToken = async (req, res) => {
  try {
    const user = await ReturnAccountByEmail(req.params.email);
    const Retour = new Ret(0, "Token account resend");

    //console.log("user:", user);

    if (!user) {
      Retour.status = 1;
      Retour.detail = "Email not exist";
      console.log(Retour);
      res.status(401).json(Retour);
      return;
    }

    if (user.valid === true) {
      Retour.status = 1;
      Retour.detail = "Account already valid";
      console.log(Retour);
      res.status(401).send(Retour);
      return;
    }

    //make Tmp token
    let obj = {
      userid: user.userid,
      email: user.email,
      nickname: user.nickname,
    };
    //make new token
    let tokenTmp = makeTokenTmp(obj);
    //make template
    let nacc = template.new_account.replace("%nickname%", user.nickname).replace("%tokenTmp%", tokenTmp).replace("%tokenTmp%", tokenTmp);
    aws
      .SendEmailAws("contact@deco-recup.fr", user.email, "ShareRPG : resend valid account", nacc)
      .then((e) => {
        console.log("email Send");
        console.log("MessageId:", e.MessageId);
        res.status(200).send(Retour);
        return;
      })
      .catch((err) => {
        Retour.status = 1;
        Retour.detail = err.message;
        console.log(Retour);
        res.status(500).send(Retour);
        return;
      });
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log(Retour);
    res.status(500).json(Retour);
    return;
  }
};
