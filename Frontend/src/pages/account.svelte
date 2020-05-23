<script>
  import toastr from "toastr";
  import axios from "axios";

  const toastrOptions = {
    closeButton: false,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    showDuration: 300,
    hideDuration: 1000,
    timeOut: 5000,
    extendedTimeOut: 1000,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
  };
  toastr.options = toastrOptions;

  let er = { status: 0, detail: "" };

  let user = {
    email: "trotroyanas@gmail.com",
    nickname: "trotro",
    lastname: "Perps",
    name: "Perpi",
    password: "colosus",
    passwordConfirm: "colosus"
  };

  function formSubmit(e) {
    // donne les options à toastr
    if (user.password !== user.passwordConfirm) {
      toastr["error"]("Passwords not match", "Error");
      return;
    }

    const urlVer = "http://localhost:3000/api/account/check";
    const urlSet = "http://localhost:3000/api/account/add";

    axios
      .post(urlVer, {
        email: user.email
      })
      .then(r => {
        /*         console.log("retour");
        console.log(r.data);
 */ if (
          r.data.status === 0
        ) {
          //Call Api Save User
          axios
            .post(urlSet, {
              email: user.email,
              nickname: user.nickname,
              lastname: user.lastname,
              name: user.name,
              password: user.password
            })
            .then(r => {
              //console.log(r.data);
              if (r.data.status === 0) {
                //console.log(r.data.detail);
                toastr["success"]("Add Account", "Success");
                //Reset les champs du formulaire sur success
                e.target.reset();
              } else {
                console.log("Error");
                console.log(r.data);
              }
            })
            .catch(e => {
              console.log("Catch Error");
              console.log(e);
            });
        } else {
          toastr["error"](r.data.detail, "Error");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
</script>

<style>
  .form-account-marge {
    min-height: calc(100vh -60px);
    padding-top: 50px;
  }

  .form-account {
    background-color: #fff;
    font-size: 16px;
    border: solid 1px #ccc;
    max-width: 1024px;
    min-width: 300px;
    margin: auto;
    padding: 40px;
    font-size: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }

  .form-account-title {
    font-size: 24px;
    font-weight: bold;
    color: #000;
    border-bottom: solid 1px #d7dbdf;
    margin-bottom: 30px;
  }

  .form-control {
    display: block;
    width: 100%;
    border: solid 1px #d2d6db;
    border-radius: 6px;
    font-size: 16px;
    padding: 14px 10px;
    background-color: #fff;
  }

  .form-group {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 8px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(297px, 1fr));
    grid-gap: 24px;
    grid-template-rows: 1fr 1fr;
  }

  .btn.btn-primary {
    align-items: center;
    background-color: var(--blood);
    align-items: center;
    border: none;
    color: #fff;
    font-weight: 500;
    padding: 15px 25px;
    border-radius: 6px;
    cursor: pointer;
  }

  .btn.btn-primary:hover {
    background-color: var(--blood-dark);
  }

  .form-account .btn.btn-primary {
    grid-column-end: -1;
  }

  .login-size {
    max-width: 400px !important;
  }

  .form-separator {
    margin-top: 25px;
    border-bottom: solid 1px gray;
    border-top: solid 1px gray;
    margin-bottom: 25px;
    padding: 25px 0px 25px;
    text-align: center;
  }

  .mt30 {
    margin-top: 30px;
  }

  .btn-social {
    width: 100%;
    height: 20px;
    margin: 10px 0px 10px;
    border-radius: 6px;
  }

  .google {
    background-color: #ff0000 !important;
  }

  .facebook {
    background-color: #4267b2 !important;
  }

  @media screen and (max-width: 1012px) {
    .form-account-marge {
      margin-top: 15px;
      min-height: calc(100vh -60px);
    }
  }

  @media screen and (max-width: 800px) {
    .form-account-marge {
      margin-top: 15px;
      min-height: calc(100vh -60px);
    }
  }
</style>

<div>
  <div class="form-account-marge">
    <div class="form-account">
      <div class="form-account-title">Add Account</div>

      <form
        on:submit|preventDefault={formSubmit}
        class="form-grid"
        id="Form-AddAccount"
        method="post"
        action="/api/account/add">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            class="form-control"
            bind:value={user.email}
            required />
        </div>
        <div class="form-group">
          <label for="nickname">Nickname</label>
          <input
            type="text"
            id="nickname"
            name="pseudo"
            class="form-control"
            bind:value={user.nickname}
            required />
        </div>
        <div class="form-group">
          <label for="lastname">Lastname</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            class="form-control"
            bind:value={user.lastname}
            required />
        </div>
        <div class="form-group">
          <label for="ame">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            class="form-control"
            bind:value={user.name}
            required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-control"
            bind:value={user.password}
            required />
        </div>
        <div class="form-group">
          <label for="password-confirm">Confirm Password</label>
          <input
            type="password"
            id="password-confirm"
            name="password-confirm"
            class="form-control"
            bind:value={user.passwordConfirm}
            required />
        </div>
        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    </div>
  </div>
</div>
