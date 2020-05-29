<script>

    import cook from "./configs/SessionCookie.js";

    let date = new Date(Date.now() + (86400000 * 7)); //86400000ms = 1 jour
    let dte = date.toUTCString();
    let cs = null;

    const defUnk = {
    userId: "0",
    nickname: "unknow",
    email: "unknow@unknow.com"
}

function rr(){

    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    console.log(ca);
    let co = ca[0].substr(6, (ca[0].length) - 7);
    console.log(co);
}


function sav(){
    let obb = {"userid":"123132", "nickname":"bolos","email":"bolos@bb.com"}
    let bob = {...obb, isConnect: true}
    cs = `user='${ JSON.stringify(bob)}';path=/;expires='${dte}';SameSite=Strict`;
    document.cookie = cs;
    localStorage.setItem('user',JSON.stringify(bob));
    console.log(cs);
}

function err(){
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('user');
    localStorage.clear();
    console.log("efface cookie et localstorage");
}

function rsto() {
    let rs = localStorage.getItem('user');
    console.log(rs);
}

</script>

<button on:click={rr}>readCookie</button>
<br />
<button on:click={sav}>SaveCookie</button>
<br />
<button on:click={err}>ErraseCookie</button>
<br />
<button on:click={rsto}>Read Storage</button>
