const extendConstants = (obj, src) => {
  for (const key in src) {
    if (src.hasOwnProperty(key)) {
      obj[key] = src[key]
    }
  }

  return obj
}

export default extendConstants
