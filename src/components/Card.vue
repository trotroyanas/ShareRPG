<template>
  <!--begin::Card-->
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3 class="card-label">
          {{Title}}&nbsp;
          <small>le mangeur de haricots...</small>
        </h3>
      </div>
    </div>
    <div class="card-body">
      <img class="card-img-top" src="http://placehold.it/500x325" alt />
    </div>
  </div>
  <!--end::Card-->
</template>

<style>
@import "../assets/css/card.css";
</style>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private Title!: string;
}
</script>

