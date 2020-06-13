const aws = require("./sendEmail.js");
const template = require("../templates/emails.json");

let nacc = template.new_account.replace("%nickname%", "Bolossss");
aws.SendEmailAws("contact@deco-recup.fr", "ch66.perez@gmail.com", "subject test", nacc).then((e) => {
  console.log("message send & Finish");
  console.log("e:", e.MessageId);
});
