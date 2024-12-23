import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';


const serviceAccount = JSON.parse(
  readFileSync(resolve(__dirname, '../secrets/serviceAccountKey.json'), 'utf8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    //storageBucket: "<your-bucket-name>.appspot.com" // si usarás Storage
  });
}

export const firestore = admin.firestore();
//export const storage = admin.storage().bucket();
