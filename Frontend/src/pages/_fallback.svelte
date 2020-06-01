<script>
  import Navbar from "./components/navbar.svelte";
  import { url } from "@sveltech/routify";
  import Cooks from "./configs/SessionCookie.js";

  let isConnect;
  $: isConnect = Cooks.isConnect();
</script>

<style>
  .form-account-marge {
    min-height: calc(100vh -60px);
    padding-top: 50px;
  }

  @media screen and (max-width: 1012px) {
    .form-account-marge {
      margin-top: 15px;
      min-height: calc(100vh -60px);
    }
  }

  @media screen and (max-width: 800px) {
    .form-account-marge {
      margin-top: 15px;
      min-height: calc(100vh -60px);
    }
  }

  .huge {
    font-size: 12rem;
  }
  .e404 {
    left: 50%;
    top: 50%;
    text-align: center;
  }
</style>

<div>
  <Navbar Connect={isConnect} />
  <div class="form-account-marge">
    <div class="e404">
      <div class="huge">404</div>
      <div class="big">
        Page not found.
        <!-- link to the parent folder of _fallback.svelte -->
        <a href={$url('/')}>Go back</a>
      </div>
    </div>
  </div>
</div>
