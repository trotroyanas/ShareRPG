<script>
  import Navbar from "../components/navbar.svelte";
  import Cooks from "../configs/SessionCookie.js";
  import toastr from "toastr";
  import toastrOptions from "../configs/toastroptions.js";
  toastr.options = toastrOptions;

  import firebase from "@firebase/app";
  import "firebase/storage";
  import { uuid } from "uuidv4";
  // Your web app's Firebase configuration
  import firebaseConfig from "../configs/storage_gcp.js";
  firebase.initializeApp(firebaseConfig);

  import { goto } from "@sveltech/routify";
  import _ from "lodash";

  /*  Sécurité */
  let isConnect;
  isConnect = Cooks.isConnect();
  if (!_.isEmpty(isConnect) || isConnect === false) {
    $goto("/login");
  }

  /* Variables  */
  let userid = Cooks.rUserid();

  let files = [];
  let lstImgs = [];
  let lstImgs2 = [];
  let proms = [];

  function listFiles(e) {
    var preview = document.querySelector("#pulp");

    if (e.target.files) {
      [].forEach.call(e.target.files, readAndPreview);
    }

    function readAndPreview(file) {
      proms.push(
        new Promise((resolve, reject) => {
          // Make sure `file.name` matches our extensions criteria
          if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
            return alert(file.name + " is not an image");
          } // else...

          var reader = new FileReader();
          reader.addEventListener("load", function() {
            lstImgs.push({
              img: this.result,
              type: file.type,
              size: file.size,
              name: file.name
            });
            resolve();
          });
          reader.readAsDataURL(file);
        })
      );
    }

    Promise.all(proms)
      .then(() => {
        $: lstImgs2 = lstImgs;
        console.log("finish...");
      })
      .catch(e => console.log(e.message));
  }

  function UploadLst() {
    var storageRef = firebase.storage().ref();
    lstImgs.forEach(el => {
      const newid = uuid();
      let ext = el.name.split(".").pop();
      const task = storageRef.child(userid + "/" + newid + "." + ext).put(el);
      task.then(sn => {
        console.log("sn:", sn);
      });
    });
  }

  function removeDoc(key) {
    lstImgs.splice(key, 1);
    $: lstImgs2 = lstImgs2;
  }
</script>

<style lang="scss">
  .pdt10 {
    padding-top: 10px;
  }

  .thumb {
    max-width: 150px;
    max-height: 150px;
  }

  .divMaster {
    max-width: 152px;
    border: 1px solid #bbb;
    padding-bottom: 5px;
    margin-bottom: 10px;
    margin: 5px;
  }

  .divTxt {
    display: flex;
    font-size: 10px;
    font-style: italic;
    padding: 5px;
    color: #999;
  }

  .divBtn {
    color: var(--blood-dark);
    text-align: center;
    font-size: 16px;
    font-style: normal;
  }

  .tle {
    border: 0px solid red;
    width: 50%;
    text-align: left;
  }

  .tlr {
    border: 0px solid red;
    width: 50%;
    text-align: right;
  }

  .dd {
    margin-top: 20px;
    text-align: center;
  }

  /* on personnalise le label comme on veut */
  .label-file {
    background-color: white;
    cursor: pointer;
    color: #2c3e50;
    font-weight: bold;
    border: 2px solid #2c3e50;
    padding: 15px;
  }
  .label-file:hover {
    color: #597d91;
    border: 2px solid #597d91;
  }
  /* et on masque le input */
  .input-file {
    display: none;
  }

  .pulp {
    display: flex;
    text-align: left;
    border: 0px solid red;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>

<div>
  <div class="workplace bdr">
    <Navbar Connect={isConnect} />
    <div class="mt50">
      <div class="text-left">
        <h2
          class="page-section-heading text-secondary tle pdt10 mb-0
          d-inline-block">
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

        <div id="pulp" class="pulp">

          {#each lstImgs2 as item, i}
            <div class="divMaster">
              <div>
                <img src={item.img} class="thumb" alt="" />
              </div>
              <div class="divTxt">
                <div class="tle">{item.type}</div>
                <div class="tlr">S:{item.size}</div>
              </div>
              <div class="divBtn">
                <a
                  href="#"
                  on:click|preventDefault={() => {
                    removeDoc(i);
                  }}>
                  remove
                </a>
              </div>
            </div>
          {/each}
        </div>
        {#if lstImgs2.length > 0}
          <div style="margin-top: 30px">
            <input
              class="label-file"
              type="button"
              on:click={UploadLst}
              value="Upload"
              style="display:hidden" />
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
