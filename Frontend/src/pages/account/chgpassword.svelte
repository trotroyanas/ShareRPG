<script>
  import Navbar from "../components/navbar.svelte";
  import toastr from "toastr";
  import axios from "axios";
  import Urls from "../configs/call-urls.js";
  import Joi from "@hapi/joi";
  import toastrOptions from "../configs/toastroptions.js";
  toastr.options = toastrOptions;

  import Cooks from "../configs/SessionCookie.js";

  import { goto } from "@sveltech/routify";

  /*  Sécurité */
  let isConnect;
  isConnect = Cooks.isConnect();
  if (!isConnect) {
    $goto("/login");
  }

  let NotifyVisible = false;
  let NotifyMessage = "";
  let NotifyClass = "";

  let user = {
    current_password: "U425ve!!K^A^U!X2jx",
    password: "U425ve!!K^A^U!X2jx",
    password_confirm: "U425ve!!K^A^U!X2jx"
  };

  //const pattern = /^[a-zA-Z0-9!@#$~^%&*]{3,25}$/;
  const passwordPatern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  const schema = Joi.object({
    current_password: Joi.string().required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp(passwordPatern)),
    password_confirm: Joi.ref("password")
  });

  async function formSubmit(e) {
    try {
      const value = await schema.validateAsync(user);
    } catch (err) {
      console.log("err:", err.message);
      NotifyMessage = err.message;
      NotifyVisible = true;
      NotifyClass = "notify-error";
      toastr["error"](NotifyMessage, "Error");
      return;
    }

    let sess = await Cooks.readConnected();

    let axiosData = {
      current_password: user.current_password,
      password: user.password
    };

    axios
      .post(Urls.chgpwd, axiosData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sess
        }
      })
      .then(r => {
        console.log(r.data);
        if (r.data.status === 0) {
          console.log("p001");
          let msg = r.data.detail;
          toastr["success"](msg, "Success");
          NotifyVisible = true;
          NotifyMessage = "Succes : " + msg;
          NotifyClass = "notify-success";
          e.target.reset();
        } else {
          toastr["error"](r.data.detail, "Error");
          NotifyMessage = r.data.detail;
          NotifyVisible = true;
          NotifyClass = "notify-error";
          e.target.reset();
        }
      })
      .catch(e => {
        console.log("Catch Error");
        console.log(e.message);
        toastr["error"](e.message, "Error");
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
            bind:value={user.current_password}
            required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-control"
            bind:value={user.password}
            required />
        </div>
        <div class="form-group">
          <label for="passwordConf">Confirm Password</label>
          <input
            type="password"
            id="copwd"
            name="passwordConf"
            class="form-control"
            bind:value={user.password_confirm}
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
