import { parse } from 'query-string'
import createCachedSelector from 're-reselect'

function mapArgsToCacheKey(queryString) {
  return queryString
}

export default createCachedSelector(
  queryString => queryString,
  queryString => parse(queryString)
)(mapArgsToCacheKey)
