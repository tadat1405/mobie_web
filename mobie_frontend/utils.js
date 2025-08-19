export const isJsonString = (data)=>{
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
}
export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export const renderOptions = (arr)=>{
  let results = []
  if(arr){
    results = arr?.map((opt)=>{
      return {
        value: opt,
        lable: opt
      }
    })
  }
  results.push({
    label: 'Thêm Type',
    value: 'add_type'
  })
  return results
}

export const converPeice = (price)=>{
  try {
    const result = price?.toLocaleString().replaceAll(',', '.')
    return `${result} VND`
  } catch (error) {
      return null
  }
}