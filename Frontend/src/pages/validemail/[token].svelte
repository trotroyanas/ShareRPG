<script>
  import Navbar from "../components/navbar.svelte";
  import Cooks from "../configs/SessionCookie.js";
  import Urls from "../configs/call-urls.js";
  import { params } from "@sveltech/routify";
  import toastr from "toastr";
  import axios from "axios";

  let NotifyMessage = "";
  let col = "";
  let displayLogin = false;
  let displayResend = false;

  async function validAccount() {
    console.log("params:", $params.token);

    const valid = await axios
      .get(Urls.validmail, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + $params.token
        }
      })
      .then(ret => {
        console.log(ret);
        NotifyMessage = ret.data.detail;
        displayLogin = true;
        col = "cok";
        toastr["success"](NotifyMessage, "Success");
      })
      .catch(err => {
        console.log(err.message);
        NotifyMessage = "Token Expired";
        col = "cnok";
        displayLogin = false;
        displayResend = true;
        toastr["error"](err.message, "Error");
      });
  }

  Cooks.delLS();
  validAccount();
</script>

<style>
  .t1 {
    padding-top: 100px;
    display: block;
    margin: auto;
    text-align: center;
    border: solid 0px pink;
    max-width: 520px;
    font-size: 24px;
    font-weight: bold;
  }

  .t2 {
    display: block;
    margin: auto;
    text-align: center;
    border: solid 0px pink;
    max-width: 520px;
    font-size: 16px;
    font-weight: normal;
  }
  .cok {
    color: #51a351;
  }
  .cnok {
    color: var(--blood);
  }
</style>

<div>
  <Navbar />
</div>

<div class="t1 {col}">{NotifyMessage}</div>
{#if displayLogin}
  <div class="t2">
    Go to
    <a href="/login">login</a>
  </div>
{/if}
{#if displayResend}
  <div class="t2">
    Go to
    <a href="/passwordresend">Resend new Token</a>
  </div>
{/if}
