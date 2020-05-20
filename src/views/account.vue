<template>
  <div class="zzz">
    <div class="form-account">
      <div class="form-account-title">Add Account</div>
      <form class="form-grid" method="post" action="/api/account/add" @submit="checkForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" name="email" class="form-control" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="pseudo">Pseudo</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            class="form-control"
            v-model="pseudo"
            required
          />
        </div>
        <div class="form-group">
          <label for="nom">Nom</label>
          <input type="text" id="nom  " name="nom" class="form-control" />
        </div>
        <div class="form-group">
          <label for="prenom">Prenom</label>
          <input type="text" id="prenom" name="prenom" class="form-control" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" class="form-control" />
        </div>
        <div class="form-group">
          <label for="password-confirm">Confirm Password</label>
          <input type="password" id="password-confirm" name="password-confirm" class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    </div>
  </div>
</template>


<style lang="scss" rel="stylesheet">
@import "../assets/css/account.scss";
</style>




<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Account",
  data() {
    return {
      email: "trotro@gmail.com",
      pseudo: "Bolos",
      nom: "",
      prenom: ""
    };
  },
  methods: {
    checkForm: function(e: any) {
      e.preventDefault();
      console.log("coucou");
      const dat = { email: this.email, pseudo: this.pseudo };
      console.log(dat);
    }
  }
});
</script>

