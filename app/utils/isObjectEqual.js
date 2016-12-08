import isEqual from 'lodash.isequal'
import isPlainObject from 'lodash.isplainobject'
import { fromJS } from 'immutable'

const isObjectEqual = (obj1, obj2) => {
  const a = fromJS(obj1).toJS(),
        b = fromJS(obj2).toJS(),
        item1Keys = Object.keys(a).sort(),
        item2Keys = Object.keys(b).sort()

  if (!isPlainObject(a) || !isPlainObject(b)) {
    return false
  }

  if (isEqual(a, b)) {
    return true
  }

  if (!isEqual(item1Keys, item2Keys)) {
    return false
  }

  return item2Keys.every((key) => {
    const value = a[key],
          nextValue = b[key]

    if (isEqual(value, nextValue)) {
      return true
    }

    return Array.isArray(value) && Array.isArray(nextValue) && isEqual(value, nextValue)
  })
}

export default isObjectEqual
