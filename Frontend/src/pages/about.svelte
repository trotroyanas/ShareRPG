<script>
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

<button on:click={login}>LogIn</button>
<br />
<button on:click={logout}>LogOut</button>
