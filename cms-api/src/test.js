const getCache = () => {
  const _cache = {}
  const get = (key) => _cache[key]
  const set = (key, value) => _cache[key] = value
  return{get, set}
}
const cache = getCache()
cache.set('a',1)
cache.set('b',2)
cache.set('a',3)

console.log(cache.get('a'))
