import invert from 'lodash.invert'
import uniq from 'lodash.uniq'
import { parse, stringify } from 'query-string'
import React, { useCallback, useMemo } from 'react'

import getObjectWithMappedKeys from './getObjectWithMappedKeys'


const useQuery = (location, config={}) => {
  const { mapper, translater } = config
  const { search } = location

  const invertedMapper = useMemo(() => mapper && invert(mapper), [mapper])
  const params = useMemo(() => parse(search), [search])

  const getSearchFromUpdate = useCallback(notTranslatedQueryParamsUpdater => {
    let paramsUpdater = notTranslatedQueryParamsUpdater
    if (translater) {
      paramsUpdater = translater(paramsUpdater)
    } else if (mapper) {
      paramsUpdater = getObjectWithMappedKeys(paramsUpdater, invertedMapper)
    }

    const paramsUpdaterKeys = Object.keys(paramsUpdater)
    const concatenatedQueryParamKeys = Object.keys(params)
                                             .concat(paramsUpdaterKeys)
    const paramsKeys = uniq(concatenatedQueryParamKeys)

    const nextQueryParams = {}
    paramsKeys.forEach(paramsKey => {
      if (paramsUpdater[paramsKey]) {
        nextQueryParams[paramsKey] = paramsUpdater[paramsKey]
        return
      }
      if (
        paramsUpdater[paramsKey] !== null &&
        typeof params[paramsKey] !== 'undefined'
      ) {
        nextQueryParams[paramsKey] = params[paramsKey]
        return
      }
      if (paramsUpdater[paramsKey] === '') {
        nextQueryParams[paramsKey] = null
      }
    })

    const nextLocationSearch = stringify(nextQueryParams)

    return `?${nextLocationSearch}`
  }, [params])


  const getSearchFromAdd = useCallback((key, value) => {
    let nextValue = value
    const previousValue = params[key]
    if (previousValue && previousValue.length) {
      const args = previousValue.split(',').concat([value])
      args.sort()
      nextValue = args.join(',')
    } else if (typeof previousValue === 'undefined') {
      /* eslint-disable no-console */
      console.warn(
        `Weird did you forget to mention this ${key} query param in your withQuery hoc?`
      )
    }

    return getSearchFromUpdate({ [key]: nextValue })
  }, [params])


  const getSearchFromRemove = useCallback((key, value) => {
    const previousValue = params[key]
    if (previousValue && previousValue.length) {
      let nextValue = previousValue
        .replace(`,${value}`, '')
        .replace(value, '')
      if (nextValue[0] === ',') {
        nextValue = nextValue.slice(1)
      }
      if (nextValue.trim() === "") {
        nextValue = null
      }
      return getSearchFromUpdate({ [key]: nextValue })
    }
    if (typeof previousValue === 'undefined') {
      console.warn(
        `Weird did you forget to mention this ${key} query param in your withQuery hoc?`
      )
    }
  }, [params])


  const translatedParams = useMemo(() => {
    if (translater) return translater(params)
    if (mapper) return getObjectWithMappedKeys(params, mapper)
    return params
  }, [params])


  return {
    getSearchFromAdd,
    getSearchFromRemove,
    getSearchFromUpdate,
    params,
    translatedParams
  }
}


export default useQuery
