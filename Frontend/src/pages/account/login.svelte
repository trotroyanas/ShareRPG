<script>
  import { goto } from "@sveltech/routify";
  import toastr from "toastr";
  import axios from "axios";
  import Urls from "../configs/call-urls.js";
  import toastrOptions from "../configs/toastroptions.js";
  toastr.options = toastrOptions;

  import kapi from "../configs/cle_api.json";

  import Cooks from "../configs/SessionCookie.js";

  let NotifySuccessVisible = false;
  let NotifyErrorVisible = false;
  let NotifyErrorMessage = "";

  let email = "trotroyanas@gmail.com";
  let password = "colosus";

  function ssdcs() {
    Cooks.delCookie();
    console.log("Del cookie");
  }

  async function formSubmit(e) {
    //console.log(email);
    //console.log(password);
    await axios
      .post(Urls.login, {
        email: email,
        password: password,
        cle_api: kapi.cle_api
      })
      .then(r => {
        //console.log(r.data);
        if (r.data.status === 0) {
          toastr["success"]("You're connected", "Success");
          NotifySuccessVisible = true;
          NotifyErrorVisible = false;
          e.target.reset();
          Cooks.saveCookie(r.data.detail);
        } else {
          toastr["error"](r.data.detail, "Error");
          NotifyErrorMessage = r.data.detail;
          NotifySuccessVisible = false;
          NotifyErrorVisible = true;
          sessionStorage.clear();
        }
      })
      .catch(e => {
        console.log("Catch Error");
        console.log(e);
        toastr["error"](e, "Error");
        $goto("/");
      });
  }
</script>

<style>
  .form-account-marge {
    min-height: calc(100vh -60px);
    padding-top: 50px;
  }

  .form-account {
    background-color: #fff;
    font-size: 16px;
    border: solid 1px #ccc;
    max-width: 1024px;
    min-width: 300px;
    margin: auto;
    padding: 40px;
    font-size: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }

  .form-account-title {
    font-size: 24px;
    font-weight: bold;
    color: #000;
    border-bottom: solid 1px #d7dbdf;
    margin-bottom: 30px;
  }

  .form-control {
    display: block;
    width: 100%;
    border: solid 1px #d2d6db;
    border-radius: 6px;
    font-size: 16px;
    padding: 14px 10px;
    background-color: #fff;
  }

  .form-group {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 8px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(297px, 1fr));
    grid-gap: 24px;
    grid-template-rows: 1fr 1fr;
  }

  .btn.btn-primary {
    align-items: center;
    background-color: var(--blood);
    align-items: center;
    border: none;
    color: #fff;
    font-weight: 500;
    padding: 15px 25px;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
  }

  .btn.btn-primary:hover {
    background-color: var(--blood-dark);
  }

  .form-account .btn-submit {
    grid-column-end: -1;
  }

  .login-size {
    max-width: 400px !important;
  }

  .form-separator {
    margin-top: 25px;
    border-bottom: solid 1px gray;
    border-top: solid 1px gray;
    margin-bottom: 25px;
    padding: 25px 0px 25px;
    text-align: center;
  }

  .mt30 {
    margin-top: 30px;
  }

  .btn-social {
    width: 100%;
    height: 20px;
    margin: 10px 0px 10px;
    border-radius: 6px;
  }

  .google {
    background-color: #ff0000 !important;
  }

  .facebook {
    background-color: #4267b2 !important;
  }

  .notify-success {
    color: var(--green-dark);
  }
  .notify-error {
    color: var(--blood-dark);
  }

  @media screen and (max-width: 1012px) {
    .form-account-marge {
      margin-top: 15px;
      min-height: calc(100vh -60px);
    }
  }

  @media screen and (max-width: 800px) {
    .form-account-marge {
      margin-top: 15px;
      min-height: calc(100vh -60px);
    }
  }
</style>

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
      <input type="button" on:click={ssdcs} value="qdscqcqs" />
      <span
        class="notify-success"
        style={NotifySuccessVisible === true ? 'display:visible' : 'display:none'}>
        Success : Your account added.
      </span>
      <span
        class="notify-error"
        style={NotifyErrorVisible === true ? 'display:visible' : 'display:none'}>
        {NotifyErrorMessage}
      </span>
    </div>
    <div class="form-separator">OR</div>
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
