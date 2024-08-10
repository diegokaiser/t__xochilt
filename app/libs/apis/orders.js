import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/app/libs/utils/firebase'

const orders = {
  GetOrder: (uid, callback) => {
    const orderRef = doc(db, 'orders', uid)

    return onSnapshot(orderRef, (orderDoc) => {
      if ( orderDoc.exists() ) {
        callback({
          uid: orderDoc.id,
          ...orderDoc.data()
        })
      } else {
        callback(null)
      }
    })
  },

  GetAllOrders: (callback) => {
    const orderRef = collection(db, 'orders')
    const ordersQuery = query(orderRef, orderBy('createdAt', 'desc'))

    return onSnapshot(ordersQuery, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }))
      callback(orders)
    })
  },

  GetOrdersByTable: (uid, callback) => {
    const orderRef = collection(db, 'orders')
    const ordersQuery = query(
      orderRef,
      where('mesaUid', '==', uid)
    )

    return onSnapshot(ordersQuery, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }))
      callback(orders)
    })
  },

  PostOrder: async (order) => {
    const docRef = await addDoc(collection(db, 'orders'), order)

    return {
      uid: docRef.id,
      ...order
    }
  },

  PatchOrder: async (uid, order) => {
    const orderRef = doc(db, 'orders', uid)

    await updateDoc(orderRef, order)
    const updatedOrderDoc = await getDoc(orderRef)
    return {
      uid: updatedOrderDoc.id,
      ...updatedOrderDoc.doc()
    }
  },

  TerminateOrder: async (uid) => {
    const orderRef = doc(db, 'orders', uid)
    await updateDoc(orderRef, { status: 'Completado' })
  },

  RTSOrder: async (uid) => {
    const orderRef = doc(db, 'orders', uid)
    await updateDoc(orderRef, { status: 'Listo para servir' })
  },

  CancelOrder: async (uid) => {
    const orderRef = doc(db, 'orders', uid)
    await updateDoc(orderRef, { status: 'Cancelado' })
  }
}

export default orders
