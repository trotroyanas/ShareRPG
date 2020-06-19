<script>
  // import admin from "firebase-admin";
  //import serviceAccount from "../../configs/frontend_gcp.json";
  //var serviceAccount = require("../../configs/frontend_gcp.json");
  /* admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "sharerpg-772e6.appspot.com"
  });
 */
  //var bucket = admin.storage().bucket();
  /* 
  var storageRef = firebase.storage().ref();
  // Create a reference to 'mountains.jpg'
  var mountainsRef = storageRef.child("mountains.jpg");

  // Create a reference to 'images/mountains.jpg'
  var mountainImagesRef = storageRef.child("images/mountains.jpg");

  // While the file names are the same, the references point to different files
  mountainsRef.name === mountainImagesRef.name; // true
  mountainsRef.fullPath === mountainImagesRef.fullPath; // false */

  /* 
  let files = [];
  function UploadChange(e) {
    console.log(e);
    files = e.target.files;
    console.log("files:", files);
  }
  function SubmitForm(e) {
    console.log(e);
  }
 */
</script>

<!-- 
<form
  on:submit|preventDefault={SubmitForm}
  id="formUpload"
  enctype="multipart/form-data">
  <input type="file" id="fileinput" multiple on:change={UploadChange} />
  <button type="submit">submit</button>
</form>

{#each files as d, i}
  <li>{d.name}, {d.size}, {d.type}</li>
{/each}
 -->
