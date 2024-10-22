import instance from "./instance"

const print = {
  PostPrint: async (template) => {
    return await instance.post(
      '/printers',
      {
        body: JSON.stringify({ template })
      }
    )
  }
}

export default print
