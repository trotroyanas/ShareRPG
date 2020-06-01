<script>
  import Navbar from "./components/navbar.svelte";
  import { url } from "@sveltech/routify";
  import Cooks from "./configs/SessionCookie.js";

  let isConnect;
  $: isConnect = Cooks.isConnect();
</script>

<style>
  .BodyRoutify {
    border: solid 1px blue;
    margin-top: 104px;
    min-height: calc(100vh - (104px + 272px + 48px + 72px));
  }

  .form-account-marge {
    min-height: calc(100vh -60px);
    padding-top: 50px;
  }

  @media screen and (max-width: 992px) {
    .form-account-marge {
      min-height: calc(100vh -60px);
    }

    .BodyRoutify {
      border: solid 1px orange;
      margin-top: 74px;
      min-height: calc(100vh - (74px + 368px + 72px));
    }

    .form-account-marge {
      min-height: calc(100vh -60px);
      padding-top: 50px;
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

<div class="BodyRoutify">
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
