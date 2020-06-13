var AWS = require("aws-sdk");
let sesConfig = require("../config/aws.json");
//AWS.config.update(sesConfig);
// Create sendEmail params

// Handle promise's fulfilled/rejected states
/* sendPromise
  .then(function (data) {
    console.log(data.MessageId);
  })
  .catch(function (err) {
    console.error(err, err.stack);
  }); */

async function SendEmailAws(EmailFrom, emailDest, emailSubject, emailMsg) {
  var params = {
    Destination: {
      /* required */ ToAddresses: [emailDest],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: emailMsg,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: emailSubject,
      },
    },
    Source: EmailFrom /* required */,
    ReplyToAddresses: [
      EmailFrom,
      /* more items */
    ],
  };

  // Create the promise and SES service object
  return new AWS.SES(sesConfig).sendEmail(params).promise();
}

module.exports = {
  SendEmailAws,
};
