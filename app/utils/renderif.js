import isFunction from 'lodash.isfunction'

export default predicate => elemOrThunk => // eslint-disable-line no-confusing-arrow
  predicate ? (isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : null // eslint-disable-line no-nested-ternary
