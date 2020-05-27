const defUnk = {
    userId: "0",
    nickname: "unknow",
    email: "unknow@unknow.com"
}

function defCook(ck) {
    let date = new Date(Date.now() + (86400000 * 7)); //86400000ms = 1 jour
    let dte = date.toUTCString();
    let cs = null;
    if (ck) {
        cs = `user='${JSON.stringify(ck)}';path=/;expires='${dte}';SameSite=Strict`;
    } else {
        cs = `user='${JSON.stringify(defUnk)}';path=/;expires='${dte}';SameSite=Strict`;
    }
    //console.log(cs);
    return cs;
}

const Cooks = {

    saveCookie(v) {
        document.cookie = defCook(v);
        sessionStorage.setItem('user', JSON.stringify(v));
    },


    delCookie() {
        document.cookie = defCook();
        sessionStorage.setItem('user', JSON.stringify(defUnk));
    },


    readCookie() {
        try {
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            let co = ca[0].substr(6, (ca[0].length) - 7);
            sessionStorage.setItem('user', JSON.stringify(co));
            //console.log("yop");
            //console.log(co);
            return co;
        } catch {
            document.cookie = defCook();
            sessionStorage.setItem('user', JSON.stringify(defUnk));
            //console.log("yup");
            //console.log(JSON.stringify(defUnk));
            return defUnk;
        }
    }
}


export default Cooks;