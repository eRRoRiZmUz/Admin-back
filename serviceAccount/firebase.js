const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://error-9acc7.firebaseio.com",
  storageBucket : "gs://error-9acc7.appspot.com"
});

let storage = admin.storage()
let firebase = admin.firestore();

module.exports = {firebase, storage}