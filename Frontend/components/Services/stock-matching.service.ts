export const StockMatchingService = {
  match_stock: async (image: File, list_id: number) => {
    const formData = new FormData()
    formData.append("image", image)
    formData.append("list_id", list_id.toString())

    return fetch(process.env.NEXT_PUBLIC_BACKEND_URI! + "/api/stock-matching/", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        return data
      })
  },
}

export default StockMatchingService
