<template>
  <div id="app">
    <router-link class="nav-link" to="/about">about</router-link>|
    <router-link class="nav-link" to="/login">login</router-link>|
    <router-link class="nav-link" to="/contact">Contact</router-link>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#navbarNav {
  a:focus {
    font-weight: bold;
    &.router-link-exact-active {
      color: #fff;
    }
  }

  height: 30px;

  a:visited {
    font-weight: normal;
    color: #626d77;
  }
}
</style>
