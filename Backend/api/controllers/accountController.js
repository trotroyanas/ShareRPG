const admin = require('firebase-admin');
const {
  v4: uuidv4
} = require('uuid');
let serviceAccount = require('../config/sharerpg-firebase.json')
const User = require("../models/User.json");
const crypto = require("crypto-js");

function EncPwd(pw) {
  const hash = crypto.SHA256(pw);
  const npwd = hash.toString(crypto.enc.Base64)
  return npwd;
}

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

exports.accountAdd = (req, res) => {
  try {

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
    let docRef = db.collection('users').doc(uuid);

    let er = {
      status: 0,
      detail: {}
    }
    docRef.set(nUser)
      .then(e => {
        console.log("success");
        er.detail = {
          ...nUser,
          id: uuid
        }
        //console.log(er);
        //console.log("fin");
        res.status(200).json(er)
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
/* 
exports.accountAdd = async (req, res) => {
  try {
    const post = new Blog({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      author: req.body.author
    });
    let newPost = await post.save();
    res.status(200).json({
      data: newPost
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.deleteBlogPost = async (req, res) => {
  try {
    const id = req.params.blogId;
    let result = await Blog.remove({
      _id: id
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
}; 

exports.updateBlogPost = async (req, res) => {
  try {
    const id = req.params.blogId;
    let result = await Blog.findByIdAndUpdate(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

*/