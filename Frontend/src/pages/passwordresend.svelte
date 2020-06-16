<script>
  import Navbar from "./components/navbar.svelte";
  import { goto } from "@sveltech/routify";
  import toastr from "toastr";
  import axios from "axios";
  import Urls from "./configs/call-urls.js";
  import Joi from "@hapi/joi";
  import toastrOptions from "./configs/toastroptions.js";
  toastr.options = toastrOptions;

  import Cooks from "./configs/SessionCookie.js";

  let NotifyVisible = false;
  let NotifyMessage = "";
  let NotifyClass = "";

  let isConnect = false;

  let emailPassword = { email: "trotroyanas@gmail.com" };
  let emailToken = { email: "trotroyanas@gmail.com" };

  const schema = Joi.object({
    email: Joi.string()
      .min(3)
      .pattern(new RegExp(/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/))
      .required()
  });

  async function SendNewPassword() {
    try {
      const value = await schema.validateAsync(emailPassword);
    } catch (err) {
      console.log("err:", err.message);
      NotifyMessage = "Bad email.";
      toastr["error"](NotifyMessage, "Error");
      return;
    }

    const tt = await axios.get(Urls.maketoken);
    const tmpToken = tt.data.detail;
    console.log("tmpToken:", tmpToken);

    const valid = await axios
      .get(Urls.resetpassword + "/" + emailPassword.email, {
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
    try {
      const value = await schema.validateAsync(emailToken);
    } catch (err) {
      console.log("err:", err.message);
      NotifyMessage = "Bad email.";
      toastr["error"](NotifyMessage, "Error");
      return;
    }

    const tt = await axios.get(Urls.maketoken);
    const tmpToken = tt.data.detail;
    //console.log("tmpToken:", tmpToken);

    const valid = await axios
      .get(Urls.resendtoken + "/" + emailToken.email, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tmpToken
        }
      })
      .then(ret => {
        if (ret.data.status === 0) {
          NotifyMessage = ret.data.detail;
          toastr["success"](NotifyMessage, "Success");
          $goto("/login");
        } else {
          console.log(ret.data.detail);
          NotifyMessage = ret.data.detail;
          toastr["error"](NotifyMessage, "error");
        }
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
            bind:value={emailPassword.email}
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
            bind:value={emailToken.email}
            required />
        </div>
        <div class="">
          <button type="submit" class="btn btn-primary">Resend</button>
        </div>
      </form>
    </div>
  </div>
</div>
