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
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) {
    console.log(err.message);
  }

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
  let proms = [];

  function listFiles(e) {
    var preview = document.querySelector("#pulp");

    if (e.target.files.length > 0) {
      [].forEach.call(e.target.files, readAndPreview);
    } else {
      //$: lstImgs = [];
      return;
    }

    function readAndPreview(file) {
      proms.push(
        new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.addEventListener("load", function() {
            // Make sure `file.name` matches our extensions criteria
            let imgUrl;
            let typ;
            switch (file.name.split(".").pop()) {
              case "jpg":
              case "jpeg":
              case "png":
              case "gif":
                imgUrl = this.result;
                typ = file.type;
                break;
              case "pdf":
                imgUrl =
                  "https://firebasestorage.googleapis.com/v0/b/sharerpg-772e6.appspot.com/o/images%2Fpdf.jpg?alt=media&token=74f14196-e867-4469-9f85-7e31531f8459";
                typ = "document/pdf";
                break;
              case "zip":
                imgUrl =
                  "https://firebasestorage.googleapis.com/v0/b/sharerpg-772e6.appspot.com/o/images%2Fzip.jpg?alt=media&token=2e65e80c-941a-4931-b147-896e7dc54172";
                typ = "document/zip";
                break;
              default:
                alert(file.name + " is not good for manager document");
                resolve();
                return;
            }

            lstImgs.push({
              fic: file,
              thumb: imgUrl,
              type: typ,
              size: (file.size / 1024 / 1024).toFixed(2).toString() + " Mo",
              nameori: file.name,
              ext: file.name.split(".").pop(),
              userid: userid,
              name: uuid() + "." + file.name.split(".").pop()
            });
            resolve();
          });
          reader.readAsDataURL(file);
        })
      );
    }

    Promise.all(proms)
      .then(() => {
        $: lstImgs = lstImgs;
        console.log("lstImgs:", lstImgs);
        console.log("finish...");
      })
      .catch(e => {
        console.log(e);
      });
  }

  function removeByName(kk) {
    lstImgs.filter((zu, i) => {
      if (zu.nameori === kk) {
        //console.log("i:", i);
        lstImgs.splice(i, 1);
        $: lstImgs = lstImgs;
      }
    });
  }

  function removeDoc(key) {
    //console.log("lstImgs:", lstImgs.length);
    lstImgs.splice(key, 1);
    $: lstImgs = lstImgs;
  }

  function UploadLst() {
    var storageRef = firebase.storage().ref();
    lstImgs.forEach((ff, i) => {
      const wr = document.getElementById("doc_" + i);
      const ld = document.getElementById("load_" + i);
      wr.style.display = "none";
      ld.style.display = "block";
      const task = storageRef
        .child("documents/" + ff.userid + "/" + ff.name)
        .put(ff.fic);
      task.then(sn => {
        //console.log("sn:", sn);
        removeByName(ff.nameori);
      });
    });
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

  .tc {
    text-align: center;
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
    margin-top: 30px;
  }

  .cloader {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0px;
    grid-auto-rows: minmax(10px, auto);
    width: 152px;
    height: 215px;
    margin: 0 0 10px 10px;
    border: 1px solid #eee;
    background-color: #2c3e50;
    color: white;
    text-align: center;
  }

  .dwrapper {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0px;
    grid-auto-rows: minmax(10px, auto);
    width: 152px;
    height: 215px;
    margin: 0 0 10px 10px;
    text-align: center;
    border: 1px solid #eee;
  }
  .done {
    grid-column: 1 / 3;
    grid-row: 1;
    text-align: center;
    padding: 0px;
    width: 150px;
    height: 150px;
    object-fit: contain;
    background-color: white;
    border: 0px solid #999;
  }
  .dtwo {
    grid-column: 1 / 1;
    grid-row: 2;
    border: 0px solid yellow;
    font-size: 10px;
    font-style: italic;
    padding-left: 2px;
    height: 20px;
    color: #999;
    text-align: left;
  }
  .dthree {
    grid-column: 2/2;
    grid-row: 2;
    border: 0px solid yellow;
    font-size: 10px;
    font-style: italic;
    height: 20px;
    padding-right: 5px;
    color: #999;
    text-align: right;
  }
  .dfour {
    grid-column: 1/3;
    grid-row: 3;
    border: 0px solid green;
    font-size: 10px;
    font-style: italic;
    padding: 2px;
    color: #999;
    height: 20px;
  }
  .dfive {
    grid-column: 1/3;
    grid-row: 3;
    border: 0px solid yellow;
    color: var(--blood-dark);
    text-align: center;
    font-size: 16px;
    font-style: normal;
    bottom: 0px;
    /* max-height: 20px; */
    padding-top: 0px;
    align-self: self-end;
  }
  .sep {
    grid-column: 1/3;
    grid-row: 2/4;
    width: 150px;
    border: 0px solid #999;
    height: 40px;
  }

  /* Loader */
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    top: 67px;
  }
  .lds-ellipsis div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
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
        <label for="file" class="label-file">Coose document(s)</label>
        <input
          id="file"
          class="input-file"
          type="file"
          multiple
          on:change={listFiles} />

        <div id="pulp" class="pulp">
          {#each lstImgs as item, i}
            <div id="load_{i}" class="cloader" style="display:none">
              <div class="lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
            <div id="doc_{i}" class="dwrapper" style="display:grid">
              <div class="done">
                <img src={item.thumb} class="thumb" alt="" />
              </div>
              <div class="sep" />
              <div class="dtwo">{item.type}</div>
              <div class="dthree">{item.size}</div>
              <div class="dfive">
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
        {#if lstImgs.length > 0}
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
