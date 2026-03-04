import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyAYihLGDo5iBmk4W8zFPXCBeUA3utV2tTc",
  authDomain:        "taskflow-8f012.firebaseapp.com",
  projectId:         "taskflow-8f012",
  storageBucket:     "taskflow-8f012.firebasestorage.app",
  messagingSenderId: "354497143809",
  appId:             "1:354497143809:web:f03fbeaecd491dea3ecc00",
}

export const app      = initializeApp(firebaseConfig)
export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const gProvider = new GoogleAuthProvider()
