const admin = require("firebase-admin");

const serviceAccount = require("./carrinho-de-compras-1-firebase-adminsdk-1pzyd-c8d94950d0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };
