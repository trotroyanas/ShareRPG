<script>
  import Navbar from "./components/navbar.svelte";
  import { goto } from "@sveltech/routify";

  import cook from "./configs/SessionCookie.js";
  const ck = cook.readCookie();

  function login() {
    $goto("/account/login");
  }
  function logout() {
    cook.delCookie();
    window.location.replace("/");
    //$goto("/");
  }
</script>

<div>
  <Navbar/>
</div>

<button on:click={login}>LogIn</button>
<br />
<button on:click={logout}>LogOut</button>
