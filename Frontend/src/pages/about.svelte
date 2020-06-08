<script>
  import Navbar from "./components/navbar.svelte";
  import { goto } from "@sveltech/routify";

  import cook from "./configs/SessionCookie.js";

  function login() {
    $goto("/account/login");
  }
  function logout() {
    cook.delLS();
    window.location.replace("/");
    //$goto("/");
  }

  function rcook() {
    let tt = cook.readCookie();
    console.log(tt);
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
<button on:click={rcook}>ReadCookie</button>
<br />
<button on:click={rsess}>Session</button>
<br />
<br />
<button on:click={logout}>LogOut</button>
