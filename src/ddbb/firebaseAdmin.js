const admin = require("firebase-admin");

// Inicializa Firebase Admin con tu archivo de clave privada JSON
admin.initializeApp({
  credential: admin.credential.cert(require("./path-to-your-service-account-file.json")),
  databaseURL: "https://your-project-id.firebaseio.com"
});

const analytics = admin.analytics();