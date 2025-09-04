import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'airnext-na.firebaseapp.com',
  projectId: 'airnext-na',
  storageBucket: 'airnext-na.appspot.com',
  messagingSenderId: '250231535682',
  appId: '1:250231535682:web:46ea251543f701d38655db',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export { messaging }
