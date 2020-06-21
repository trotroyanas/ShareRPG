const { Ret } = require("../models/classes.js");

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

const global = require("./global.js");

const ExpToken = 3600 * 24;

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
            console.log("big error 2");
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
      console.log("big error 3");
      console.log(error);
      reject();
    }
  });
}

function PassCtrl(userid) {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await cnx.CnxDB();
      let docRef = await db.collection("users").doc(userid);

      let getDoc = await docRef
        .get()
        .then((doc) => {
          if (!doc.exists) {
            const Retour = new Ret(1, "No such document!");
            resolve(Retour);
          } else {
            const Retour = new Ret(0, { password: doc.data().password });
            resolve(Retour);
          }
        })
        .catch((err) => {
          const Retour = new Ret(1, err.message);
          console.log(Retour);
          reject(Retour);
        });
      s;
    } catch (err) {
      const Retour = new Ret(1, err.message);
      console.log("error:" + Retour);
      reject(Retour);
    }
  });
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
          const Retour = new Ret(0, "email not found");
          res.status(200).json(Retour);
          return;
        } else {
          snapshot.forEach((doc) => {
            if (userid === doc.id) {
              const Retour = new Ret(0, "Update Possible");
              res.status(200).json(Retour);
              return;
            } else {
              const Retour = new Ret(1, "email already exist");
              res.status(200).json(Retour);
              return;
            }
          });
        }
      });
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log("Retour:", Retour);
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
          const Retour = new Ret(1, "No such document!");
          console.log(Retour);
          res.status(500).json(Retour);
          return;
        } else {
          //console.log('Document data:', doc.data());
          const Retour = new Ret(0, {
            nickname: doc.data().nickname,
            email: doc.data().email,
          });
          res.status(200).json(Retour);
          return;
        }
      })
      .catch((err) => {
        const Retour = new Ret(1, err.message);
        console.log(Retour);
        res.status(500).json(Retour);
        return;
      });
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log(Retour);
    res.status(500).json(Retour);
    return;
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

        const Retour = new Ret(0, {
          email: nUser.email,
          nickname: nUser.nickname,
          userid: uuid,
        });

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
            const Retour = new Ret(1, err.message);
            console.log(Retour);
            res.status(200).send(Retour);
          });
      })
      .catch((err) => {
        const Retour = new Ret(1, err.message);
        console.log(Retour);
        res.status(500).send(Retour);
      });
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log(Retour);
    res.status(500).send(Retour);
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

    const Retour = new Ret(1, req.params.userid);
    console.log("userid:" + req.params.userid + " deleted.");
    res.status(200).json(Retour);
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log("Retour:", Retour);
    res.status(500).json(Retour);
  }
};

exports.Put = async (req, res) => {
  try {
    //console.log("iuserid:" + req.params.userid);
    //console.log(req.body);
    let db = cnx.CnxDB();
    let updDoc = await db.collection("users").doc(req.params.userid);
    let upd = updDoc.update(req.body);
    const Retour = new Ret(0, req.body);
    res.status(200).json(Retour);
    return;
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log("Retour:", Retour);
    res.status(500).json(Retour);
    return;
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
          const Retour = new Ret(1, "Error email/password not found");
          console.log(Retour);
          res.status(200).send(Retour);
          return;
        } else {
          snapshot.forEach((doc) => {
            if (doc.data().valid === true) {
              let obj = {
                userid: doc.id,
                nickname: doc.data().nickname,
                email: doc.data().email,
              };
              const Retour = new Ret(
                0,
                jwt.sign(obj, jwtpwd.secret, {
                  algorithm: "HS256",
                  expiresIn: ExpToken,
                })
              );
              res.status(200).json(Retour);
              return;
            } else {
              const Retour = new Ret(1, "email not validated");
              res.status(200).json(Retour);
              return;
            }
          });
        }
      });
    //console.log("fin :" + Ret);
  } catch (err) {
    const Retour = new Ret(1, err.message);
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
      const Retour = new Ret(0, "Password updated.");
      res.status(200).json(Retour);
      return;
    } else {
      const Retour = new Ret(1, "Invalid current password");
      res.status(200).json(Retour);
      return;
    }
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log("Retour:", Retour);
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
          const Retour = new Ret(1, "No such document!");
          console.log("Retour:", Retour);
          res.status(500).json(Retour);
          return;
        } else {
          //console.log('Document data:', doc.data());
          const Retour = new Ret(0, doc.data());
          res.status(200).json(Retour);
          return;
        }
      })
      .catch((err) => {
        const Retour = new Ret(1, err.message);
        console.log("Retour:", Retour);
        res.status(500).json(Retour);
        return;
      });
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log("Retour:", Retour);
    res.status(500).json(Retour);
    return;
  }
};

exports.ReNew = async (req, res) => {
  try {
    let token = req.headers.authorization.substring(7);
    console.log(token);
    const PayLoad = global.DecToken(token);

    let obj = {
      userid: PayLoad.userid,
      nickname: PayLoad.nickname,
      email: PayLoad.email,
    };
    const Retour = new Ret(
      0,
      jwt.sign(obj, jwtpwd.secret, {
        algorithm: "HS256",
        expiresIn: ExpToken,
      })
    );

    res.status(200).json(Retour);
    return;
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log("Retour:", Retour);
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
    const Retour = new Ret(0, tokTmp);
    res.status(200).json(Retour);
    return;
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log("Retour:", Retour);
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

    const Retour = new Ret(0, "Account confirmed");
    res.status(200).json(Retour);
    return;
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log("Retour:", Retour);
    res.status(500).json(Retour);
    return;
  }
};

exports.ResendToken = async (req, res) => {
  try {
    const user = await ReturnAccountByEmail(req.params.email);
    let Retour = new Ret(0, "Token account resend");

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
      res.status(200).send(Retour);
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

exports.ResetPassword = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await ReturnAccountByEmail(email);
    let Retour = new Ret(0, "Email send");

    if (!user) {
      Retour.status = 1;
      Retour.detail = "Email not exist";
      console.log(Retour);
      res.status(401).json(Retour);
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
    let nacc = template.reset_password.replace("%nickname%", user.nickname).replace("%tokenTmp%", tokenTmp).replace("%tokenTmp%", tokenTmp);
    aws
      .SendEmailAws("contact@deco-recup.fr", user.email, "ShareRPG : password reset", nacc)
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
    const Retour = new Ret(1, err);
    console.log(Retour);
    res.status(500).json(Retour);
    return;
  }
};

exports.NewPassword = async (req, res) => {
  try {
    const pwd = req.body.password;
    const npwd = EncPwd(pwd);
    let token = req.headers.authorization.substring(7);
    var decoded = await jwt.verify(token, jwtpwd.secret);
    const userid = decoded.userid;

    let db = cnx.CnxDB();
    let updDoc = await db.collection("users").doc(userid);
    let upd = updDoc.update({ password: npwd });
    const Retour = new Ret(0, "Password changed");
    res.status(200).send(Retour);
    return;
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log(Retour);
    res.status(500).json(Retour);
    return;
  }
};
