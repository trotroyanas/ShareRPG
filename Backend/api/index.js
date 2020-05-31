const express = require("express");
const PORT = process.env.PORT || 3000;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
//const config = require("./config/sharerpg-firebase.json");
const app = express();

//configure database and mongoose
//registering cors
app.use(cors());
//configure body parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
//configure body-parser ends here
app.use(morgan("dev")); // configire morgan
// define first route

app.get("/", (req, res) => {
  res.json("Hola Svelte Developers...Shall we fight??");
});

const account = require("./src/routes/account.js");
app.use("/account", account);

/* const account = path.basename("../src/routes/account.js");
app.use("/account", account); */

const mycache = require("./src/controllers/cache.js");
mycache.FillCache();

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
