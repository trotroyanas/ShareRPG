<script>
  import Navbar from "../components/navbar.svelte";
  import Cooks from "../configs/SessionCookie.js";
  import Urls from "../configs/call-urls.js";
  import { params } from "@sveltech/routify";
  import toastr from "toastr";
  import axios from "axios";
  import { goto } from "@sveltech/routify";

  let NotifyMessage = "";
  let col = "";
  let displayLogin = false;
  let displayResend = false;

  let pwd = "colosus";
  let cpwd = "colosus";

  async function formSubmit() {
    //console.log("params:", $params.token);

    if (pwd !== cpwd) {
      NotifyMessage = "Passwords not the same";
      toastr["error"](NotifyMessage, "Error");
      return;
    }

    const valid = await axios
      .post(
        Urls.newpassword,
        {
          password: pwd
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + $params.token
          }
        }
      )
      .then(ret => {
        console.log(ret.data);
        NotifyMessage = ret.data.detail;
        toastr["success"](NotifyMessage, "Success");
        $goto("/login");
      })
      .catch(err => {
        console.log(err.message);
        NotifyMessage = "Token Expired";
        toastr["error"](err.message, "Error");
      });
  }

  Cooks.delLS();
</script>

<style lang="scss">
  @import "./src/pages/styles/account.scss";
</style>

<div>
  <Navbar />
  <div class="form-account-marge">
    <div class="form-account login-size">
      <div class="form-account-title">Reset Password</div>
      <form
        on:submit|preventDefault={formSubmit}
        class="form-grid"
        id="Form-Login"
        method="post"
        action="/api/account/login">
        <div class="form-group">
          <label for="email">New Password</label>
          <input
            type="password"
            id="email"
            name="email"
            class="form-control"
            bind:value={pwd}
            required />
        </div>
        <div class="form-group">
          <label for="password">Confirm Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-control"
            bind:value={cpwd}
            required />
        </div>
        <button type="submit" class="btn btn-primary">Confirm</button>
      </form>

    </div>
  </div>
</div>
