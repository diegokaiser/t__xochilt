import { addDoc, collection, doc, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/app/libs/utils/firebase'

const menu = {
  GetMenu: (uid, callback) => {
    const menuRef = doc(db, 'items', uid)

    return onSnapshot(menuRef, (menuDoc) => {
      if ( menuDoc.exists() ) {
        callback({
          uid: menuDoc.id,
          ...menuDoc.data()
        })
      } else {
        callback(null)
      }
    })
  },

  GetMenues: (callback) => {
    const menusRef = collection(db, 'items')

    return onSnapshot(menusRef, (querySnapshot) => {
      const menues = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }))
      callback(menues)
    })
  },

  GetMenuesByType: (type, callback) => {
    const menuesRef = collection(db, 'items')
    const q = query(menuesRef, where('tipo', '==', type))

    return onSnapshot(q, (querySnapshot) => {
      const menues = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data()
      }))
      callback(menues)
    })
  },

  GetMenuTypes: (callback) => {
    const menusRef = collection(db, 'items')

    return onSnapshot(menusRef, (querySnapshot) => {
      const typesSet = new Set()

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data()
        if (data.tipo) {
          typesSet.add(data.tipo)
        }
      })

      const uniqueTypes = Array.from(typesSet)
      callback(uniqueTypes)
    })
  },

  PostMenu: async (menu) => {
    const docRef = await addDoc(collection(db, 'items'), menu)

    return {
      uid: docRef.id,
      ...menu
    }
  },

  PatchMenu: async (uid, menu) => {
    const menuRef = doc(db, 'items', uid)

    try {
      await updateDoc(menuRef, menu)
      const updatedMenuDoc = await getDoc(menuRef)

      if (updatedMenuDoc.exists()) {
        return {
          uid: updatedMenuDoc.id,
          ...updatedMenuDoc.data()
        }
      } else {
        throw new Error('El documento no existe')
      }
    } catch (error) {
      console.error(`Error actualizando el menú con uid ${uid}:`, error);
      throw error
    }
  },

  DisableMenu: async (uid) => {
    const menuRef = doc(db, 'items', uid)

    await updateDoc(menuRef, { status: 'Inactivo' })
    const updatedMenuDoc = await getDoc(menuRef)
    return {
      uid: updatedMenuDoc.id,
      ...updatedMenuDoc.doc()
    }
  },
}

export default menu
