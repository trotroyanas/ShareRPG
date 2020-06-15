<script>
  import Navbar from "./components/navbar.svelte";
  import toastr from "toastr";
  import axios from "axios";
  import Urls from "./configs/call-urls.js";
  import { goto } from "@sveltech/routify";
  import Cooks from "./configs/SessionCookie.js";
  import Joi from "@hapi/joi";

  import toastrOptions from "./configs/toastroptions.js";
  toastr.options = toastrOptions;

  let NotifySuccessVisible = false;
  let NotifyErrorVisible = false;
  let NotifyErrorMessage = "";

  let er = { status: 0, detail: "" };

  let user = {
    email: "trotroyanas@gmail.com",
    nickname: "trotro",
    lastname: "Perps",
    name: "Perpi",
    password: "U425ve!!K^A^U!X2jx",
    passwordConfirm: "U425ve!!K^A^U!X2jx"
  };
  //const pattern = /^[a-zA-Z0-9!@#$~^%&*]{3,25}$/;
  const passwordPatern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const schema = Joi.object({
    email: Joi.string()
      .min(3)
      .pattern(new RegExp(/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/))
      .required(),
    nickname: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    lastname: Joi.string()
      .min(3)
      .max(50)
      .required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp(passwordPatern)),
    passwordConfirm: Joi.ref("password")
  });

  async function formSubmit(e) {
    try {
      const value = await schema.validateAsync(user);
      console.log("value:", value);
    } catch (err) {
      console.log("err:", err.message);
      NotifyErrorMessage = err.message;
      NotifySuccessVisible = false;
      NotifyErrorVisible = true;
      toastr["error"](NotifyErrorMessage, "Error");
      return;
    }

    const tt = await axios.get(Urls.maketoken);
    const tmpToken = tt.data.detail;
    //console.log("tmpToken:", tmpToken);

    const valid = await axios
      .get(Urls.emailexist + "/" + user.email, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tmpToken
        }
      })
      .then(async ret => {
        //console.log(ret.data);
        if (ret.data.status === 0) {
          await axios
            .post(
              Urls.add,
              {
                email: user.email,
                nickname: user.nickname,
                lastname: user.lastname,
                name: user.name,
                password: user.password,
                valid: false
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + tmpToken
                }
              }
            )
            .then(rr => {
              //console.log(rr.data);
              if (rr.data.status === 0) {
                toastr["success"]("Add Account", "Success");
                NotifySuccessVisible = true;
                NotifyErrorVisible = false;
                //Reset les champs du formulaire sur success
                //e.target.reset();
                $goto("/login");
                return;
              } else {
                NotifyErrorMessage = rr.data.detail;
                NotifySuccessVisible = false;
                NotifyErrorVisible = true;
                toastr["error"](NotifyErrorMessage, "Error");
                return;
              }
            })
            .catch(er => {
              NotifyErrorMessage = er.message;
              NotifySuccessVisible = false;
              NotifyErrorVisible = true;
              toastr["error"]("Error unknow", "Error");
              console.log(NotifyErrorMessage);
              return;
            });
        } else {
          NotifyErrorMessage = ret.data.detail;
          NotifySuccessVisible = false;
          NotifyErrorVisible = true;
          toastr["error"](NotifyErrorMessage, "Error");
        }
      })
      .catch(er => {
        NotifyErrorMessage = er.message;
        NotifySuccessVisible = false;
        NotifyErrorVisible = true;
        toastr["error"](NotifyErrorMessage, "Error");
        console.log(er.message);
      });
  }
</script>

<style lang="scss">
  @import "./src/pages/styles/account.scss";
</style>

<div>
  <Navbar />
  <div class="form-account-marge">
    <div class="form-account">
      <div class="form-account-title">Add Account</div>

      <form
        on:submit|preventDefault={formSubmit}
        class="form-grid"
        id="Form-AddAccount"
        method="post"
        action="/api/account/add">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            class="form-control"
            bind:value={user.email}
            required />
        </div>
        <div class="form-group">
          <label for="nickname">Nickname</label>
          <input
            type="text"
            id="nickname"
            name="pseudo"
            class="form-control"
            bind:value={user.nickname}
            required />
        </div>
        <div class="form-group">
          <label for="lastname">Lastname</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            class="form-control"
            bind:value={user.lastname}
            required />
        </div>
        <div class="form-group">
          <label for="ame">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            class="form-control"
            bind:value={user.name}
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
          <label for="password-confirm">Confirm Password</label>
          <input
            type="password"
            id="password-confirm"
            name="password-confirm"
            class="form-control"
            bind:value={user.passwordConfirm}
            required />
        </div>
        <div class="form-notify">
          <span
            class="notify-success"
            style={NotifySuccessVisible === true ? 'display:visible' : 'display:none'}>
            Success : Your account added.
          </span>
          <span
            class="notify-error"
            style={NotifyErrorVisible === true ? 'display:visible' : 'display:none'}>
            Error : {NotifyErrorMessage}
          </span>
        </div>
        <div class="btn-submit">
          <button type="submit" class="btn btn-primary">Create</button>
        </div>

      </form>
    </div>
  </div>
</div>
