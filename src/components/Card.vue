<template>
    <div class="col-md-4 pt-5">
      <div class="card" width="100%" height="225">
        <img class="card-img-top" src="http://placehold.it/500x325" alt />
        <div class="card-body">
          <h4 class="card-title">{{Title}}</h4>
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
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop() private Title!: string;
}
</script>