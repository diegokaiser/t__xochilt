import instance from "./instance"

const print = {
  GetPrinters: async () =>
    await instance.get('impresoras'),

  PostPrinters: async ( print ) =>
    await instance.post('imprimir', print)
}

export default print
