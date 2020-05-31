import _ from "lodash";

const defUnk = {
  userId: "0",
  nickname: "unknow",
  email: "unknow@unknow.com",
};

function defCook(ck) {
  let date = new Date(Date.now() + 86400000 * 7); //86400000ms = 1 jour
  let dte = date.toUTCString();
  let cs = null;
  if (ck) {
    cs = `user='${JSON.stringify(ck)}';path=/;expires='${dte}';SameSite=Strict`;
    document.cookie = cs;
    let bob = cs.toString();
    localStorage.setItem("user", bob);
    //console.log(cs);
    return bob;
  } else {
    console.log("pas de cookie");
    cs = `user='${JSON.stringify(
      defUnk
    )}';path=/;expires='${dte}';SameSite=Strict`;
    document.cookie = cs;
    let bob = defUnk.toString();
    localStorage.setItem("user", bob);
    //console.log(bob);
    return bob;
  }
  //console.log(cs);
  return cs;
}

const Cooks = {
  isConnect() {
    try {
      let conn = localStorage.getItem("user");
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
    //defCook();
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("user");
    localStorage.clear();
    return;
  },
  readCookie() {
    try {
      //console.log("read cookie");
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      let co = ca[0].substr(6, ca[0].length - 7);
      let bob = co.toString();
      localStorage.setItem("user", bob);
      //console.log(bob);
      return bob;
    } catch (err) {
      //console.log("pass catch readcookie");
      //document.cookie = defCook();
      //return defUnk;
      //defCook();
      console.log("Error Read Cookie");
      return null;
    }
  },
};

export default Cooks;
