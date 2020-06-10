<script>
  import Navbar from "./components/navbar.svelte";
  import { goto } from "@sveltech/routify";

  import cook from "./configs/SessionCookie.js";
  import axios from "axios";

  import Urls from "./configs/call-urls.js";

  function login() {
    $goto("/account/login");
  }
  function logout() {
    cook.delLS();
    window.location.replace("/");
    //$goto("/");
  }

  async function renew() {
    const token = cook.readConnected();
    const payload = "";

    await axios
      .get(Urls.renew, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then(r => {
        //console.log(r.data);
        if (r.data.status === 0) {
          console.log(r.data.detail);
        } else {
          console.log("catch");
        }
      })
      .catch(e => {
        console.log("catch2");
      });
  }

  function rsess() {
    let ss = cook.readConnected();
    console.log(ss);
  }
</script>

<div>
  <Navbar />
</div>

<button on:click={login}>LogIn</button>
<br />
<button on:click={renew}>ReNew</button>
<br />
<button on:click={rsess}>Session</button>
<br />
<br />
<button on:click={logout}>LogOut</button>
