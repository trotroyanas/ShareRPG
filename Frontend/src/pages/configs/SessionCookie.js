import _ from "lodash";

const defUnk = {
  userid: "0",
  nickname: "unknow",
  email: "unknow@unknow.com",
};

function defCook(ck) {
  let date = new Date(Date.now() + 86400000 * 7); //86400000ms = 1 jour
  let dte = date.toUTCString();
  let cs = "";
  if (ck) {
    let ckk = ck.toString();
    let cs = "";
    cs = `token='${ckk}';path=/;expires='${dte}';SameSite=Strict`;
    document.cookie = cs;
    localStorage.setItem("token", ckk);
    return ck;
  } else {
    console.log("pas de cookie");
    delCookie();
    return;
  }
  //console.log(cs);
  return cs;
}

const Cooks = {
  isConnect() {
    try {
      let conn = localStorage.getItem("token");
      if (!_.isEmpty(conn)) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  },
  saveCookie(v) {
    defCook(v);
    return;
  },
  delCookie() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("token");
    localStorage.clear();
    return;
  },
  readCookie() {
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
  },
  readConnected() {
    try {
      let u = localStorage.getItem("token");
      return u;
    } catch (err) {
      console.log(err);
    }
  },
};

export default Cooks;
