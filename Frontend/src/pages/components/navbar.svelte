<script>
  import cook from "../configs/SessionCookie.js";
  import _ from "lodash";
  export let Connect = cook.isConnect();
</script>

<nav class="navbar navbar-expand-lg bg-secondary fixed-top" id="mainNav">
  <div class="container">
    <a class="navbar-brand js-scroll-trigger" href="/#page-top">
      Share
      <span style="color: red;">RPG</span>
    </a>
    <button
      class="navbar-toggler navbar-toggler-right font-weight-bold bg-primary
      text-white rounded"
      type="button"
      data-toggle="collapse"
      data-target="#navbarResponsive"
      aria-controls="navbarResponsive"
      aria-expanded="false"
      aria-label="Toggle navigation">
      Menu
      <i class="fas fa-bars" />
    </button>
    <div class="collapse navbar-collapse" id="navbarResponsive">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item mx-0 mx-lg-1">
          <a
            class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger"
            href="/about">
            ABOUT
          </a>
        </li>
        <li class="nav-item mx-0 mx-lg-1">
          <a
            class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger"
            href="/contact">
            CONTACT
          </a>
        </li>
        <li class="nav-item mx-0 mx-lg-1 text-white pt-2">
          <div
            id="userLogin"
            style={Connect === true ? 'display:none' : 'display:visible'}>
            <a href="/login">
              <i class="far fa-user fa-2x" />
            </a>
          </div>
          <div
            id="userConnect"
            style={Connect === true ? 'display:visible' : 'display:none'}>
            <a href="/account/home">
              <i class="fas fa-user fa-2x" />
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</nav>
