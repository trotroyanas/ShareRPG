<script>
  import Navbar from "../components/navbar.svelte";
  import toastr from "toastr";
  import axios from "axios";
  import Urls from "../configs/call-urls.js";
  import Cooks from "../configs/SessionCookie.js";
  import Joi from "@hapi/joi";
  import toastrOptions from "../configs/toastroptions.js";
  toastr.options = toastrOptions;

  import { goto } from "@sveltech/routify";

  /*  Sécurité */
  let isConnect;
  isConnect = Cooks.isConnect();
  if (!isConnect) {
    $goto("/login");
  }

  let emailOri = "";
  let NotifySuccessVisible = false;
  let NotifyErrorVisible = false;
  let NotifyErrorMessage = "";

  const userid = Cooks.rUserid();
  const token = Cooks.readConnected();

  let er = { status: 0, detail: "" };

  let user = {
    email: "",
    nickname: "",
    lastname: "",
    name: "",
    valid: true
  };

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
    valid: Joi.boolean()
  });

  async function load() {
    //console.log(userid);
    //console.log(token);
    await axios
      .get(Urls.profil + "/" + userid, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then(r => {
        //console.log(r.data);
        if (r.data.status === 0) {
          user.email = r.data.detail.email;
          user.nickname = r.data.detail.nickname;
          user.lastname = r.data.detail.lastname;
          user.name = r.data.detail.name;
          emailOri = r.data.detail.email;
          return;
        } else {
          NotifyErrorMessage = r.data.detail;
          NotifySuccessVisible = false;
          NotifyErrorVisible = true;
          toastr["error"](NotifyErrorMessage, "Error");
          return;
        }
      })
      .catch(e => {
        NotifyErrorMessage = e;
        NotifySuccessVisible = false;
        NotifyErrorVisible = true;
        toastr["error"]("Error unknow", "Error");
        console.log(e);
        return;
      });
  }

  async function formSubmit(e) {
    // donne les options à toastr

    //console.log(user.email);
    //console.log(userid);
    //console.log(Urls.emailexist);

    try {
      const value = await schema.validateAsync(user);
    } catch (err) {
      console.log("err:", err.message);
      NotifyErrorMessage = err.message;
      NotifySuccessVisible = false;
      NotifyErrorVisible = true;
      toastr["error"](NotifyErrorMessage, "Error");
      return;
    }

    const valid = await axios
      .get(Urls.emailexist + "/" + user.email + "/" + userid, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then(async e => {
        if (e.data.status === 0) {
          if (emailOri != user.email) user.valid = false; //bascule a false si l'email change
          await axios
            .put(
              Urls.put + "/" + userid,
              {
                email: user.email,
                nickname: user.nickname,
                lastname: user.lastname,
                name: user.name,
                valid: user.valid
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token
                }
              }
            )
            .then(r => {
              //console.log(r.data);
              if (r.data.status === 0) {
                toastr["success"]("Account Updated", "Success");
                NotifySuccessVisible = true;
                NotifyErrorVisible = false;
                //Reset les champs du formulaire sur success
                if (user.valid === false) {
                  $goto("/validemail");
                  return;
                }
                $goto("/account/home");
                return;
              } else {
                NotifyErrorMessage = r.data.detail;
                NotifySuccessVisible = false;
                NotifyErrorVisible = true;
                toastr["error"](NotifyErrorMessage, "Error");
                return;
              }
            })
            .catch(e => {
              NotifyErrorMessage = e;
              NotifySuccessVisible = false;
              NotifyErrorVisible = true;
              toastr["error"]("Error unknow", "Error");
              console.log(e);
              return;
            });
        } else {
          NotifyErrorMessage = e.data.detail;
          NotifySuccessVisible = false;
          NotifyErrorVisible = true;
          toastr["error"](NotifyErrorMessage, "Error");
          return;
        }
      })
      .catch(er => console.log(er.message));
  }

  load();
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
            maxlength="30"
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
            maxlength="30"
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
            maxlength="30"
            bind:value={user.name}
            required />
        </div>
        <div class="form-notify">
          <span
            class="notify-success"
            style={NotifySuccessVisible === true ? 'display:visible' : 'display:none'}>
            Success : account updated.
          </span>
          <span
            class="notify-error"
            style={NotifyErrorVisible === true ? 'display:visible' : 'display:none'}>
            Error : {NotifyErrorMessage}
          </span>
        </div>
        <div class="btn-submit">
          <button type="submit" class="btn btn-primary">Update</button>
        </div>

      </form>
    </div>
  </div>
</div>
