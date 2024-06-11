import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
// import 'firebase/firestore'

// Get a Firestore instance

// const firebaseConfig = {
//   apiKey: '### FIREBASE API KEY ###',
//   authDomain: '### FIREBASE AUTH DOMAIN ###',
//   databaseURL: '### DATABASE DOMAIN ###',
//   projectId: '### CLOUD FIRESTORE PROJECT ID ###',
//   appId: '### APP PROJECT ID ###'
// }

const firebaseConfig = {
    
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)