<template>
    <div class="row">
        <Card v-for="a in items" :key="a.id" :Title=a.name />
    </div>
</template>

<script>
// @ is an alias to /src
import Card from '@/components/Card.vue'



export default {
  name: 'Contact',
  data() {
      return {
    items: [
        {"id":1,"name": "toto"},
        {"id":2,"name": "lolo"},
        {"id":3,"name": "fufu"},
        {"id":4,"name": "bubu"},
        {"id":5,"name": "mumu"}]
  }
  },
  components: {
    Card
  }
}
</script>
