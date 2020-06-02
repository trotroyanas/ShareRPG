<script>
  import Navbar from "../components/navbar.svelte";
  import toastr from "toastr";
  import axios from "axios";
  import Urls from "../configs/call-urls.js";
  import toastrOptions from "../configs/toastroptions.js";
  toastr.options = toastrOptions;

  import { goto } from "@sveltech/routify";
  import _ from "lodash";
  /*  Sécurité */
  let isConnect;
  isConnect = Cooks.isConnect();
  if (!_.isEmpty(isConnect) || isConnect === false) {
    $goto("/login");
  }

  let NotifySuccessVisible = false;
  let NotifyErrorVisible = false;
  let NotifyErrorMessage = "";

  let er = { status: 0, detail: "" };

  let user = {
    email: "",
    nickname: "",
    lastname: "",
    name: ""
  };

  async function load() {
    console.log("Load data");
  }

  async function formSubmit(e) {
    // donne les options à toastr
    if (user.password !== user.passwordConfirm) {
      toastr["error"]("Passwords not match", "Error");
      NotifyErrorMessage = "Passwords not match";
      NotifySuccessVisible = false;
      NotifyErrorVisible = true;
      return;
    }

    await axios
      .post(Urls.add, {
        email: user.email,
        nickname: user.nickname,
        lastname: user.lastname,
        name: user.name,
        password: user.password,
        cle_api: kapi.cle_api
      })
      .then(r => {
        //console.log(r.data);
        if (r.data.status === 0) {
          toastr["success"]("Add Account", "Success");
          NotifySuccessVisible = true;
          NotifyErrorVisible = false;
          //Reset les champs du formulaire sur success
          e.target.reset();
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
