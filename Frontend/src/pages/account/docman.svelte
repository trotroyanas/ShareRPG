<script>
  import Navbar from "../components/navbar.svelte";
  import Cooks from "../configs/SessionCookie.js";
  import toastr from "toastr";
  import toastrOptions from "../configs/toastroptions.js";
  toastr.options = toastrOptions;

  import { goto } from "@sveltech/routify";
  import _ from "lodash";

  /*  Sécurité */
  let isConnect;
  isConnect = Cooks.isConnect();
  if (!_.isEmpty(isConnect) || isConnect === false) {
    $goto("/login");
  }
</script>

<style lang="scss">
  .pdt10 {
    padding-top: 10px;
  }
</style>

<div>
  <div class="workplace bdr">
    <Navbar Connect={isConnect} />
    <div class="mt50">
      <div class="text-center">
        <h2
          class="page-section-heading text-secondary pdt10 mb-0 d-inline-block">
          Documents Manager
        </h2>
      </div>

      <div id="drag-drop-area" />
    </div>
  </div>
</div>
