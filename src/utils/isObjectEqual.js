import _isEqual from 'lodash/isEqual'
import _isPlainObject from 'lodash/isPlainObject'
import { fromJS } from 'immutable'

const isObjectEqual = (obj1, obj2) => {
  const a = fromJS(obj1).toJS(),
        b = fromJS(obj2).toJS(),
        item1Keys = Object.keys(a).sort(),
        item2Keys = Object.keys(b).sort()

  if (!_isPlainObject(a) || !_isPlainObject(b)) {
    return false
  }

  if (_isEqual(a, b)) {
    return true
  }

  if (!_isEqual(item1Keys, item2Keys)) {
    return false
  }

  return item2Keys.every((key) => {
    const value = a[key],
          nextValue = b[key]

    if (_isEqual(value, nextValue)) {
      return true
    }

    return Array.isArray(value) && Array.isArray(nextValue) && _isEqual(value, nextValue)
  })
}

export default isObjectEqual
