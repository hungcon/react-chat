import * as firebase from 'firebase';
var firebaseConfig = {
  apiKey: "AIzaSyCYtxLHpR9hooKqriAAOaVMAKaHLAyhLX0",
  authDomain: "chat-app-793e8.firebaseapp.com",
  databaseURL: "https://chat-app-793e8.firebaseio.com",
  projectId: "chat-app-793e8",
  storageBucket: "chat-app-793e8.appspot.com",
  messagingSenderId: "929178656220",
  appId: "1:929178656220:web:c4d9ff633934be90000319",
  measurementId: "G-FTHW7VQQ14"
};

export const firebaseConnect =   firebase.initializeApp(firebaseConfig);