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
  let CssX;

  function listFiles(e) {
    var preview = document.querySelector("#pulp");
    let SvelteCss = preview.className.split(" ");
    SvelteCss = SvelteCss[1];

    if (e.target.files) {
      [].forEach.call(e.target.files, readAndPreview);
    }

    function readAndPreview(file) {
      // Make sure `file.name` matches our extensions criteria
      if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
        return alert(file.name + " is not an image");
      } // else...

      var reader = new FileReader();

      reader.addEventListener("load", function() {
        const img = document.getElementById("modimg");
        const div01 = document.getElementById("divMaster");
        const div02 = document.getElementById("divTxt");
        const div03 = document.getElementById("divBtn");

        var image = new Image();
        image.className = img.className;
        image.title = file.name;
        image.src = this.result;

        var divImg = document.createElement("div");
        divImg.className = "divThumb " + SvelteCss;
        divImg.appendChild(image);

        var divTxt = document.createElement("div");
        var TxtSpan01 = document.createElement("span");
        TxtSpan01.textContent = file.size;
        TxtSpan01.className = div02.className;
        var TxtSpan02 = document.createElement("span");
        TxtSpan02.textContent = file.type;

        divTxt.className = div02.className;
        divTxt.appendChild(TxtSpan01);

        var divButton = document.createElement("div");

        var divMaster = document.createElement("div");
        divMaster.className = div01.className;
        divMaster.appendChild(divImg);
        divMaster.appendChild(divTxt);

        preview.appendChild(divMaster);
      });

      reader.readAsDataURL(file);
    }
  }

  function del(key) {
    let ff = Array.from(files);
    console.log(ff);
    ff.splice(key, 1);
    console.log(ff);
    files = ff;
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
  }

  .divTxt {
    text-align: right;
    font-size: 10px;
    font-style: italic;
  }

  .divBtn {
    text-align: right;
    font-size: 20px;
    font-style: italic;
  }

  .dd {
    text-align: center;
  }

  /* on personnalise le label comme on veut */
  .label-file {
    cursor: pointer;
    color: #00b1ca;
    font-weight: bold;
    border: 2px solid #25a5c4;
    padding: 15px;
  }
  .label-file:hover {
    color: #25a5c4;
  }
  /* et on masque le input */
  .input-file {
    display: none;
  }

  .pulp {
    margin: auto;
    text-align: left;
    border: 0px solid red;
    max-width: 160px;
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
      <div class="zzz" style="visibility:hidden" />

      <div class="dd">
        <label for="file" class="label-file">Choisir une image</label>
        <input
          id="file"
          class="input-file"
          type="file"
          multiple
          on:change={listFiles} />

        <div id="pulp" class="pulp" />

      </div>
    </div>
  </div>
</div>

<img id="modimg" class="thumb" src="" alt="" style="visibility:hidden" />
<div id="divMaster" class="divMaster" style="visibility:hidden" />
<div id="divTxt" class="divTxt" style="visibility:hidden" />
<div id="divBtn" class="divBtn" style="visibility:hidden" />
