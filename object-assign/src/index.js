var obj = {
  price: 0,
  name: 'xxx'
}

function hasProperty (obj, prop) {
  Object.keys(obj).forEach(v => {
    console.log(v)
    if (v === prop) return true
  })
  return false
}

console.log(Object.keys(obj))

console.log(hasProperty(obj, 'price'))