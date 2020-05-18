<template>
  <div id="app">
    <!-- Navigation -->
    <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand" href="#">Share RPG</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
          aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#">Home</a>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">About</router-link> |
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/contact">Contact</router-link> |
            </li>
          </ul>
        </div>
      </div>
    </nav> -->

    <!-- Navigation -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
  <div class="container">
  <a class="navbar-brand" href="#">Share RPG</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item active">
        <router-link class="nav-link" to="/">Home</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/contact">Contact</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/about">About</router-link>
      </li>
    </ul>
  </div>
  </div>
</nav>



    <router-view/>
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
      color: #FFF;
    }
  }

  height: 30px;

  a:visited {
      font-weight: normal;
      color: #626d77;
  }
}
</style>
