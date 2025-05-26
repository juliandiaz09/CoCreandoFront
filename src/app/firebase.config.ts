import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDnCfzF5psHLcnmbeJGrBuWpxOkUp01Lfo",
  authDomain: "cocreando-2dbd1.firebaseapp.com",
  projectId: "cocreando-2dbd1",
  storageBucket: "cocreando-2dbd1.appspot.com",
  messagingSenderId: "862709485856",
  appId: "1:123456789:web:abcd1234"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
