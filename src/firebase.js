import * as firebase from 'firebase'
// import "firebase/auth"
// import "firebase/database"
// import "firebase/storage"

const config = {
  apiKey: "AIzaSyAVd8-RMH8B4BjOom-ZYWPDlLTjw-FI8eE",
  authDomain: "upskill-project.firebaseapp.com",
  databaseURL: "https://upskill-project-default-rtdb.firebaseio.com",
  projectId: "upskill-project",
  storageBucket: "upskill-project.appspot.com",
  messagingSenderId: "557430637036",
  appId: "1:557430637036:web:feaf0a0543c605a67e00c9",
  measurementId: "G-WLDYZCEG51"
};

firebase.initializeApp(config)

export default firebase;
