<script>
  import Navbar from "../components/navbar.svelte";
  import toastr from "toastr";
  import axios from "axios";
  import Urls from "../configs/call-urls.js";
  import toastrOptions from "../configs/toastroptions.js";
  toastr.options = toastrOptions;

  import kapi from "../configs/cle_api.json";
  import Cooks from "../configs/SessionCookie.js";

  import { goto } from "@sveltech/routify";
  import _ from "lodash";
  /*  Sécurité */
  let isConnect;
  isConnect = Cooks.isConnect();
  if (!_.isEmpty(isConnect) || isConnect === false) {
    $goto("/login");
  }

  let NotifyVisible = false;
  let NotifyMessage = "";
  let NotifyClass = "";

  let password = "colosus";
  let cupwd = "colosus";
  let copwd = "colosus";

  async function formSubmit(e) {
    //console.log(password);
    if (password !== copwd) {
      toastr["error"]("Passwords not match.", "Error");
      e.target.reset();
      return;
    }

    let sess = Cooks.readConnected();
    console.log(sess);

    let axiosData = {
      current_password: cupwd,
      password: password
    };

    axios
      .post(Urls.chgpwd, axiosData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sess
        }
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
          //console.log(r.data.detail);
          //isConnect = true;
          //$goto("/account/home");

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
        Cooks.delCookie();
        $goto("/login");
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
      <div class="form-account-title">Change Password</div>
      <form
        on:submit|preventDefault={formSubmit}
        class="form-grid"
        id="Form-Login"
        method="post"
        action="/api/account/chgpwd">
        <div class="form-group">
          <label for="password">Current Password</label>
          <input
            type="password"
            id="cupwd"
            name="password"
            class="form-control"
            bind:value={cupwd}
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
        <div class="form-group">
          <label for="passwordConf">Confirm Password</label>
          <input
            type="password"
            id="copwd"
            name="passwordConf"
            class="form-control"
            bind:value={copwd}
            required />
        </div>
        <button type="submit" class="btn btn-primary">Change</button>
      </form>
      <div class="form-notify text-center mt30">
        <span
          class={NotifyClass}
          style={NotifyVisible === true ? 'display:visible' : 'display:none'}>
          {NotifyMessage}
        </span>
      </div>
    </div>
  </div>
</div>
