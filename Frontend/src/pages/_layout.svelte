<script>
  import cook from "./configs/SessionCookie.js";
  import axios from "axios";
  import Urls from "./configs/call-urls.js";

  async function RenewToken() {
    const token = cook.readConnected();
    console.log("passe par _layout.svelte");
    if (token) {
      await axios
        .get(Urls.renew, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        })
        .then(r => {
          try {
            if (r.data.status === 0) {
              //console.log(r.data.detail);
              cook.saveCookie(r.data.detail);
            }
          } catch (error) {
            console.log(error);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
</script>

<slot />
