"use strict";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

/* exports.makeUppercase = functions
  .region("europe-west1")
  .firestore.document("/users/{documentId}")
  .onCreate((snap, context) => {
    // [END makeUppercaseTrigger]
    // [START makeUppercaseBody]
    // Grab the current value of what was written to Cloud Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    console.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Cloud Firestore.
    // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
    // [END makeUppercaseBody]
  });
 */
exports.makeUppercaseUpdate = functions
  .region("europe-west1")
  .firestore.document("/users/{documentId}")
  .onWrite((change, context) => {
    //if new data no deleted
    const data = change.after.exists ? change.after.data() : null;
    if (data === null) return null;
    // return old data before change

    const previousData = change.before.exists ? change.before.data() : null;
    // This is crucial to prevent infinite loops.
    if (previousData !== null) {
      if (data.original === previousData.original) return null;
    }

    //action  si Create or Update
    //const ori = data.original.toUpperCase();
    const original = data.original.toUpperCase();

    //save result
    return change.after.ref.set({ original }, { merge: true });
  });

// [END makeUppercase]
// [END all]
