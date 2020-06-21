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

  let files = [];
  function listFiles(e) {
    $: files = e.target.files;
  }

  function del(key) {
    console.log("key:", key);

    let ff = files;
    let nn = Array.from(ff);
    console.log(nn);
    nn.splice(key, 1);
    console.log(nn);
    files = nn;
  }
</script>

<style lang="scss">
  .pdt10 {
    padding-top: 10px;
  }

  .dd {
    text-align: center;
  }

  /* on personnalise le label comme on veut */
  .label-file {
    cursor: pointer;
    color: #00b1ca;
    font-weight: bold;
    border: 1px solid #25a5c4;
    padding: 15px;
  }
  .label-file:hover {
    color: #25a5c4;
  }
  /* et on masque le input */
  .input-file {
    display: none;
  }

  .pup {
    text-align: left;
    padding-left: 10px;
    border: 1px solid red;
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
      <!-- Nous avons ici notre label et l'input afférent -->

      <div class="dd">
        <label for="file" class="label-file">Choisir une image</label>
        <input
          id="file"
          class="input-file"
          type="file"
          multiple
          on:change={listFiles} />

        {#each files as d, i}
          <div class="pup">
            {d.name}, {d.size}, {d.type}
            <input type="button" on:click={() => del(i)} value="del" />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
