<script>
  import Navbar from "./components/navbar.svelte";
  import Cooks from "./configs/SessionCookie.js";

  Cooks.delLS();
</script>

<style>
  .t1 {
    padding-top: 100px;
    display: block;
    margin: auto;
    text-align: center;
    border: solid 0px pink;
    max-width: 520px;
    color: var(--blood);
    font-size: 24px;
    font-weight: bold;
  }
</style>

<div>
  <Navbar />
</div>

<div class="t1">Please confirm the email you will receive</div>
