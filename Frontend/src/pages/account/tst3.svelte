<script>
  import Cooks from "../configs/SessionCookie.js";
  import { uuid } from "uuidv4";

  // Your web app's Firebase configuration
  import firebase from "@firebase/app";
  import "firebase/storage";
  import firebaseConfig from "../configs/storage_gcp.js";
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) {
    console.log(err.message);
  }

  function test() {
    const mess = "boloossss";
    var storageRef = firebase.storage().ref();
    const task = storageRef.child(`hello-${uuid()}.txt`).putString(mess);
    task.then(sn => {
      console.log("sn:", sn);
    });
  }
</script>

<input type="button" on:click={test} value="Send" />
