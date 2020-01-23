const METHOD_WHITELIST = new Set([
  'add',
  'cat',
  'dagPut',
  'dagGet',
  'setHost'
])

export default async function (request, proxy, wrapper) {
  const datastore = wrapper.datastore
  const [
    method,
    ...params
  ] = request.params

  return METHOD_WHITELIST.has(method)
    ? Promise.resolve(datastore[method](...params))
    : Promise.reject(
      new Error(`Given datastore method (${method}) is not whitelisted`)
    )
}
