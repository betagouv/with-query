import invert from 'lodash.invert'
import uniq from 'lodash.uniq'
import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { PureComponent } from 'react'

import { selectQueryParamsFromQueryString } from './selectQueryParamsFromQueryString'
import { getObjectWithMappedKeys } from './getObjectWithMappedKeys'

const withQuery = (config={}) => WrappedComponent => {
  const { mapper, translater } = config

  let invertedMapper
  if (mapper) {
    invertedMapper = invert(mapper)
  }

  class _withQuery extends PureComponent {
    constructor(props) {
      super(props)
      this.query = {
        getParams: this.getParams,
        getSearchFromAdd: this.getSearchFromAdd,
        getSearchFromRemove: this.getSearchFromRemove,
        getSearchFromUpdate: this.getSearchFromUpdate,
        getTranslatedParams: this.getTranslatedParams
      }
    }

    getParams = () => {
      const { location } = this.props
      return selectQueryParamsFromQueryString(location.search)
    }

    getSearchFromAdd = (key, value) => {
      const params = this.getParams()

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

      return this.getSearchFromUpdate({ [key]: nextValue })
    }

    getSearchFromUpdate = notTranslatedQueryParamsUpdater => {
      const params = this.getParams()

      let paramsUpdater = notTranslatedQueryParamsUpdater
      if (translater) {
        paramsUpdater = translater(paramsUpdater)
      } else if (mapper) {
        paramsUpdater = getObjectWithMappedKeys(
          paramsUpdater, invertedMapper)
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
    }

    getSearchFromRemove = (key, value) => {
      const params = this.getParams()

      const previousValue = params[key]
      if (previousValue && previousValue.length) {
        let nextValue = previousValue
          .replace(`,${value}`, '')
          .replace(value, '')
        if (nextValue[0] === ',') {
          nextValue = nextValue.slice(1)
        }
        return this.getSearchFromUpdate({ [key]: nextValue })
      } else if (typeof previousValue === 'undefined') {
        console.warn(
          `Weird did you forget to mention this ${key} query param in your withQuery hoc?`
        )
      }
    }

    getTranslatedParams = () => {
      const params = this.getParams()
      if (translater) {
        return translater(params)
      }
      if (mapper) {
        return getObjectWithMappedKeys(params, mapper)
      }
      return params
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          query={this.query}
        />
      )
    }
  }

  _withQuery.propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string.isRequired
    }).isRequired,
  }

  _withQuery.WrappedComponent = WrappedComponent

  return _withQuery
}

export default withQuery
