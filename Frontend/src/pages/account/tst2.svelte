<script>
  import firebase from "@firebase/app";
  import "firebase/storage";
  import Cooks from "../configs/SessionCookie.js";
  import { uuid } from "uuidv4";
  // Your web app's Firebase configuration
  import firebaseConfig from "../configs/storage_gcp.js";
  firebase.initializeApp(firebaseConfig);

  let isConnect = Cooks.isConnect();
  let userid = Cooks.rUserid();

  let files = [];
  function UploadChange(e) {
    $: files = e.target.files;
    console.log("files:", files);
    //create a storage reference

    // Create a root reference
    var storageRef = firebase.storage().ref();

    files.forEach(el => {
      const newid = uuid();
      let ext = el.name.split(".").pop();
      const task = storageRef.child(userid + "/" + newid + "." + ext).put(el);
      task.then(sn => {
        console.log("sn:", sn);
      });
    });
  }

  function clickForm() {
    files = document.getElementById("fileinput").files;
    //let formData = new FormData();
    //formData.append("photo", photo);
    //fetch('/upload/image', {method: "POST", body: formData});
    // Create a root reference
    var storageRef = firebase.storage().ref();
    files.forEach(el => {
      const newid = uuid();
      let ext = el.name.split(".").pop();
      const task = storageRef.child(userid + "/" + newid + "." + ext).put(el);
      task.then(sn => {
        console.log("sn:", sn);
      });
    });
  }
</script>

<form on:submit|preventDefault={clickForm}>

  <input type="file" id="fileinput" multiple />
  {#each files as d, i}
    <li>{d.name}, {d.size}, {d.type}</li>
  {/each}

  <input type="submit" value="Submit" />

</form>
