<script>
  import Navbar from "./components/navbar.svelte";
  import { goto } from "@sveltech/routify";
  import toastr from "toastr";
  import axios from "axios";
  import Urls from "./configs/call-urls.js";
  import toastrOptions from "./configs/toastroptions.js";
  toastr.options = toastrOptions;

  import Cooks from "./configs/SessionCookie.js";

  let NotifyVisible = false;
  let NotifyMessage = "";
  let NotifyClass = "";

  let isConnect = false;

  let emailPassword = "trotroyanas@gmail.com";
  let emailToken = "trotroyanas@gmail.com";

  async function SendNewPassword() {
    const tt = await axios.get(Urls.maketoken);
    const tmpToken = tt.data.detail;
    console.log("tmpToken:", tmpToken);

    const valid = await axios
      .get(Urls.resetpassword + "/" + emailPassword, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tmpToken
        }
      })
      .then(re => {
        NotifyMessage = re.data.detail;
        toastr["success"](NotifyMessage, "Success");
        //$goto("/login");
      })
      .catch(er => {
        console.log(er.message);
        NotifyMessage = er.message;
        toastr["error"](NotifyMessage, "error");
      });
  }

  async function SendNewToken() {
    const tt = await axios.get(Urls.maketoken);
    const tmpToken = tt.data.detail;
    console.log("tmpToken:", tmpToken);

    const valid = await axios
      .get(Urls.resendtoken + "/" + emailToken, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tmpToken
        }
      })
      .then(re => {
        NotifyMessage = re.data.detail;
        toastr["success"](NotifyMessage, "Success");
        $goto("/login");
      })
      .catch(er => {
        console.log(er.message);
        NotifyMessage = er.message;
        toastr["error"](NotifyMessage, "error");
      });
  }
</script>

<style lang="scss">
  @import "./src/pages/styles/account.scss";
</style>

<div>
  <Navbar Connect={isConnect} />
  <div class="form-account-marge">
    <div class="form-account login-size">
      <div class="form-account-title">Lost Password</div>
      <form
        on:submit|preventDefault={SendNewPassword}
        class="form-grid"
        id="Form-Login"
        method="post"
        action="/api/account/login">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            class="form-control"
            bind:value={emailPassword}
            required />
        </div>
        <div class="">
          <button type="submit" class="btn btn-primary">New Password</button>
        </div>
      </form>

      <div class="form-separator sep-top sep-bot mg-top25 mg-bot25">OR</div>

      <div class="form-account-title pdt25">Resend email validation</div>
      <form
        on:submit|preventDefault={SendNewToken}
        class="form-grid"
        id="Form-Login"
        method="post"
        action="/api/account/login">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            class="form-control"
            bind:value={emailToken}
            required />
        </div>
        <div class="">
          <button type="submit" class="btn btn-primary">Resend</button>
        </div>
      </form>
    </div>
  </div>
</div>
