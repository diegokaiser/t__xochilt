import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/app/libs/utils/firebase'

const tables = {
  GetTable: (uid, callback) => {
    const tableRef = doc(db, 'tables', uid)

    return onSnapshot(tableRef, (tableDoc) => {
      if ( tableDoc.exists() ) {
        callback({
          uid: tableDoc.id,
          ...tableDoc.data()
        })
      } else {
        callback(null)
      }
    })
  },

  GetTables: (callback) => {
    const tablesRef = collection(db, 'tables')
    const tablesQuery = query(tablesRef, orderBy('nombre'))

    return onSnapshot(tablesQuery, (querySnapshot) => {
      const tables = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }))
      callback(tables)
    })
  },

  GetTablesByStatus: (status, callback) => {
    const tablesRef = collection(db, 'tables')
    const tablesQuery = query(tablesRef, where('status', '==', status), orderBy('nombre'))

    return onSnapshot(tablesQuery, (querySnapshot) => {
      const tables = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }))
      callback(tables)
    })
  },

  PostTable: async (table) => {
    const docRef = await addDoc(collection(db, 'tables'), table)

    return {
      uid: docRef.id,
      ...menu
    }
  },

  PatchTable: async (uid, table) => {
    const tableRef = doc(db, 'tables', uid)

    await updateDoc(tableRef, table)
    const updatedTableDoc = await getDoc(tableRef)
    return {
      uid: updatedTableDoc.id,
      ...updatedTableDoc.doc()
    }
  },

  ActivateTable: async (uid) => {
    const tableRef = doc(db, 'tables', uid)
    await updateDoc(tableRef, { status: 'Activo' })
  },

  OpenTable: async (uid) => {
    const tableRef = doc(db, 'tables', uid)
    await updateDoc(tableRef, { status: 'Abierto' })
  },

  DisableTable: async (uid) => {
    const tableRef = doc(db, 'tables', uid)
    await updateDoc(tableRef, { status: 'Cerrado' })
  }
}

export default tables
