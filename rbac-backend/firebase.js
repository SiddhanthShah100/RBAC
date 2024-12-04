const admin = require('firebase-admin');

const serviceAccount = require('./config/firebase-admin-sdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rbac-fc27a-default-rtdb.firebaseio.com/"
});

const database = admin.database();

module.exports = { database };

