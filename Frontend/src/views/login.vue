<template>
  <div class="form-account-marge">
    <div class="form-account login-size">
      <div class="form-account-title">Login</div>
      <form
        class="form-grid"
        id="Form-Login"
        method="post"
        action="/api/account/login"
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
        <button type="submit" class="btn btn-primary">Create</button>
      </form>
      <div class="form-separator">OR</div>
      <div class="form-group">
        <button type="button" class="btn btn-primary facebook">
          <i class="fab fa-facebook facebook"></i>&nbsp;facebook
        </button>
      </div>
      <div class="form-group mt30">
        <button type="button" class="btn btn-primary google">
          <i class="fab fa-google"></i>&nbsp;google
        </button>
      </div>
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
        password: "sdevknseozen"
      }
    };
  },
  methods: {
    EncPwd(pw: string) {
      const hash = crypto.SHA256(this.user.password);
      const npwd = hash.toString(crypto.enc.Base64);
      return npwd;
    }
  }
});
</script>