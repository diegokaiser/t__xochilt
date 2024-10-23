const print = {
  PostPrint: async (template) => {
    console.log(template)
    try {
      const response = await fetch('http://localhost:3000/printers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
      })

      if ( response.ok ) {
        const result = await response.json()
        console.log('Impresión exitosa', result)
        return result
      } else {
        const error = await response.json()
        console.log('Error en la impresión', error)
        return error
      }
    } catch (error) {
      console.error('Error al intentar imprimir:', error)
      throw error
    }
  }
}

export default print
