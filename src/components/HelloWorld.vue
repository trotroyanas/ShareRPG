<template>
  <div class="col-md-4">
    <div class="card" width="100%" height="225">
      <img class="card-img-top" src="http://placehold.it/500x325" alt />
      <div class="card-body">
        <h4 class="card-title">Card title</h4>
        <p class="card-text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo magni sapiente,
          tempore debitis beatae culpa natus architecto.
        </p>
      </div>
      <div class="card-footer">
        <a href="#" class="btn btn-primary">Find Out More!</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HelloWorld",
  props: {
    msg: String
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
