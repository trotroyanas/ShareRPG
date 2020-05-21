<template>
  <div class="zzz">
    <div class="form-account">
      <div class="form-account-title">Add Account</div>
      <form
        class="form-grid"
        id="Form-AddAccount"
        method="post"
        action="/api/account/add"
        @submit="checkForm"
      >
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            class="form-control"
            v-model="user.email"
            required
          />
        </div>
        <div class="form-group">
          <label for="pseudo">Pseudo</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            class="form-control"
            v-model="user.pseudo"
            required
          />
        </div>
        <div class="form-group">
          <label for="nom">Nom</label>
          <input type="text" id="nom" name="nom" class="form-control" v-model="user.nom" required />
        </div>
        <div class="form-group">
          <label for="prenom">Prenom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            class="form-control"
            v-model="user.prenom"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-control"
            v-model="user.password"
            required
          />
        </div>
        <div class="form-group">
          <label for="password-confirm">Confirm Password</label>
          <input
            type="password"
            id="password-confirm"
            name="password-confirm"
            class="form-control"
            v-model="user.passwordConfirm"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    </div>
  </div>
</template>


<style lang="scss" rel="stylesheet">
@import "../assets/css/account.scss";
@import "../assets/css/toastr.min.css";
</style>

<script lang="ts">
import axios from "axios";
import Vue from "vue";
import crypto from "crypto-js";
import toastr from "toastr";

export default Vue.extend({
  name: "Account",
  data() {
    return {
      user: {
        email: "trotro@gmail.com",
        pseudo: "Bolos",
        nom: "Perps",
        prenom: "Ch.",
        password: "sdevknseozen",
        passwordConfirm: "sdevknseozen"
      },
      toastrOptions: {
        closeButton: false,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
      }
    };
  },
  methods: {
    EncPwd(pw: string) {
      const hash = crypto.SHA256(this.user.password);
      const npwd = hash.toString(crypto.enc.Base64);
      return npwd;
    },
    checkForm(e: any) {
      //empêche le clic->send du formulaire
      e.preventDefault();

      const nuser = {
        email: this.user.email,
        pseudo: this.user.pseudo,
        nom: this.user.nom,
        prenom: this.user.prenom,
        password: this.EncPwd(this.user.password)
      };

      const urlVer = "http://localhost:3000/api/VerifyAccount";
      const urlSet = "http://localhost:3000/api/set";

      axios
        .post(urlVer, {
          email: nuser.email
        })
        .then(r => {
          console.log("retour");
          console.log(r.data);
          if (r.data.status === 0) {
            //Call Api Save User
            axios
              .post(urlSet, {
                body: nuser
              })
              .then(r => {
                if (r.data.status === 0) {
                  console.log(r.data.detail);
                  toastr.options = this.toastrOptions;
                  toastr["success"]("Add Account", "Success");

                  //Reset les champs du formulaire sur success
                  e.target.reset();
                } else {
                  console.log("Error");
                  console.log(r.data);
                }
              })
              .catch(e => {
                console.log("Catch Error");
                console.log(e);
              });
          } else {
            toastr.options = this.toastrOptions;
            toastr["error"](r.data.detail, "Error");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
});
</script>


