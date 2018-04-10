import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCcRbIomf7aetYpnOrQfKtBo_Vuegx-sKc",
  authDomain: "shepherd-78773.firebaseapp.com",
  databaseURL: "https://shepherd-78773.firebaseio.com",
  projectId: "shepherd-78773",
  storageBucket: "",
  messagingSenderId: "593666617113"
};

firebase.initializeApp(config);

const database = firebase.database();

export { firebase, database as default };