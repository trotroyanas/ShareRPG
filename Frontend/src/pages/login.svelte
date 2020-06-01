<script>
  import Navbar from "./components/navbar.svelte";
  import { goto } from "@sveltech/routify";
  import toastr from "toastr";
  import axios from "axios";
  import Urls from "./configs/call-urls.js";
  import toastrOptions from "./configs/toastroptions.js";
  toastr.options = toastrOptions;

  import kapi from "./configs/cle_api.json";
  import Cooks from "./configs/SessionCookie.js";

  let NotifyVisible = false;
  let NotifyMessage = "";
  let NotifyClass = "";

  let isConnect = false;
  //Cooks.isConnect();

  let email = "trotroyanas@gmail.com";
  let password = "colosus";

  async function formSubmit(e) {
    //console.log(email);
    //console.log(password);

    await axios
      .post(Urls.login, {
        email: email,
        password: password
      })
      .then(r => {
        //console.log(r.data);
        if (r.data.status === 0) {
          let msg = "You're connected";
          toastr["success"](msg, "Success");
          NotifyVisible = true;
          NotifyMessage = "Succes : " + msg;
          NotifyClass = "notify-success";
          e.target.reset();
          Cooks.saveCookie(r.data.detail);
          //console.log(r.data.detail);
          isConnect = true;
          $goto("/account/home");

          //window.location.replace("/account/account");
          //location.reload();
        } else {
          toastr["error"](r.data.detail, "Error");
          NotifyMessage = r.data.detail;
          NotifyVisible = true;
          NotifyClass = "notify-error";
          Cooks.delCookie();
          isConnect = false;
        }
      })
      .catch(e => {
        console.log("Catch Error");
        console.log(e);
        toastr["error"](e, "Error");
        //$goto("/");
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
      <div class="form-account-title">Login</div>
      <form
        on:submit|preventDefault={formSubmit}
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
            bind:value={email}
            required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-control"
            bind:value={password}
            required />
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <div class="form-notify text-center mt30">
        <span
          class={NotifyClass}
          style={NotifyVisible === true ? 'display:visible' : 'display:none'}>
          {NotifyMessage}
        </span>
      </div>
      <div class="form-separator sep-top sep-bot mg-top25 mg-bot25">OR</div>
      <div class="pt mg-bot25 sep-bot pdb25 text-center">
        <a href="/account">Create account</a>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-primary facebook">
          <i class="fab fa-facebook facebook" />
          &nbsp;facebook
        </button>
      </div>
      <div class="form-group mt30">

        <button type="button" class="btn btn-primary google">
          <i class="fab fa-google" />
          &nbsp;google
        </button>
      </div>
    </div>
  </div>
</div>
