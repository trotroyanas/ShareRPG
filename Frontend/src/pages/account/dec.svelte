<script>
  import Cooks from "../configs/SessionCookie.js";

  const payLoad = Cooks.decPayload(Cooks.readConnected());
  console.log(payLoad.userid);
</script>
