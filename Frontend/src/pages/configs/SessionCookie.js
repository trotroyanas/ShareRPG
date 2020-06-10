let TokenExp = 24; //hours
import base64 from "base-64";

const defUnk = {
  userid: "0",
  nickname: "unknow",
  email: "unknow@unknow.com",
};

function retGetTime(v) {
  return Math.floor(v / 1000);
}

function defCook(ck) {
  var dt = new Date(Date.now());
  dt.setHours(dt.getHours() + TokenExp);
  let ts = retGetTime(dt.getTime());
  //console.log(ts);
  if (ck) {
    localStorage.setItem("token", ck.toString());
    localStorage.setItem("expire", ts);
    return ck;
  } else {
    console.log("pas de cookiepas de localStorage");
    delLS();
    return;
  }
  return;
}

const Cooks = {
  isConnect() {
    try {
      let conn = localStorage.getItem("token");
      if (conn) {
        let ls = localStorage.getItem("expire");
        var ts = retGetTime(new Date(Date.now()).getTime());
        //console.log("compare");
        //console.log(ls);
        //console.log(ts);
        if (ts > ls) {
          delLS();
          return false;
        }
        return true;
      } else {
        delLS();
        return false;
      }
    } catch {
      //delLS();
      return false;
    }
  },
  saveCookie(v) {
    defCook(v);
    return;
  },
  delLS() {
    //document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("expire");
      localStorage.clear();
    } catch (err) {
      console.log(err);
    }
    return;
  },
  decPayload(token) {
    const tok = token.split(".");
    var jsonPayload = base64.decode(tok[1]);
    //console.log(decodedData);
    return JSON.parse(jsonPayload);
  },
  rUserid() {
    return this.decPayload(this.readConnected()).userid;
  },

  /*   readCookie() {
    try {
      //console.log("read cookie");
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      let co = ca[0].substring(7, ca[0].length - 1);
      localStorage.setItem("token", co);
      return co;
    } catch (err) {
      console.log("Error Read Cookie");
      return;
    }
  }, */
  readConnected() {
    try {
      let u = localStorage.getItem("token");
      return u;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};

export default Cooks;
