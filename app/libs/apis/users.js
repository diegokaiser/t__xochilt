import { getDoc, getDocs, doc, collection, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/app/libs/utils/firebase'
import bcrypt from 'bcryptjs';

const users = {
  Login: async (email, password) => {
    const q = query(collection(db, 'users'), where('email', '==', email))
    const querySnapshot = await getDocs(q)
    
    if ( querySnapshot.empty ) {
      return null
    }
    
    const userDoc = querySnapshot.docs[0]
    const user = userDoc.data()
    
    const isPasswordValid = password = user.password
    if ( !isPasswordValid ) {
      return null
    }

    return {
      uid: userDoc.id,
      ...user
    }
  },
  GetUser: async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid))
    
    if ( !userDoc.exists() ) {
      return null
    }

    return {
      uid: userDoc.id,
      ...userDoc.data()
    }
  },
  GetAllUsers: async () => {
    const querySnapshot = await getDocs(collection(db, 'users'))
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }))
  },
  PostUser: async (user) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    const userWithHashedPassword = {
      password: hashedPassword,
      ...user
    }
    const docRef = await addDoc(collection(db, 'users'), userWithHashedPassword)
    return {
      uid: docRef.id,
      ...userWithHashedPassword
    }
  },
  PatchUser: async (uid, user) => {
    const userRef = doc(db, 'users', uid)

    if ( user.password ) {
      user.password = await bcrypt.hash(user.password, 10)
    }

    await updateDoc(userRef, user)
    const updatedUserDoc = await getDoc(userRef)
    return {
      uid: updatedUserDoc.id,
      ...updatedUserDoc.data()
    }
  },
  DisableUser: async (uid) => {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { disabled: true })
    const updatedUserDoc = await getDoc(userRef)
    return {
      uid: updatedUserDoc.id,
      ...updatedUserDoc.data()
    }
  }
}

export default users