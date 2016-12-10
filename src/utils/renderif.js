import _isFunction from 'lodash/isFunction'

export default predicate => elemOrThunk => // eslint-disable-line no-confusing-arrow
  predicate ? (_isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : null // eslint-disable-line no-nested-ternary
