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
        getQueryParams: this.getQueryParams,
        getSearchFromAdd: this.getSearchFromAdd,
        getSearchFromRemove: this.getSearchFromRemove,
        getSearchFromUpdate: this.getSearchFromUpdate,
        getTranslatedParams: this.getTranslatedParams
      }
    }

    getSearchFromAdd = (key, value) => {
      const queryParams = this.getQueryParams()

      let nextValue = value
      const previousValue = queryParams[key]
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
      const { location } = this.props
      const queryParams = this.getQueryParams()

      let queryParamsUpdater = notTranslatedQueryParamsUpdater
      if (translater) {
        queryParamsUpdater = translater(queryParamsUpdater)
      } else if (mapper) {
        queryParamsUpdater = getObjectWithMappedKeys(
          queryParamsUpdater, invertedMapper)
      }

      const queryParamsUpdaterKeys = Object.keys(queryParamsUpdater)
      const concatenatedQueryParamKeys = Object.keys(queryParams)
                                               .concat(queryParamsUpdaterKeys)
      const queryParamsKeys = uniq(concatenatedQueryParamKeys)

      const nextQueryParams = {}
      queryParamsKeys.forEach(queryParamsKey => {
        if (queryParamsUpdater[queryParamsKey]) {
          nextQueryParams[queryParamsKey] = queryParamsUpdater[queryParamsKey]
          return
        }
        if (
          queryParamsUpdater[queryParamsKey] !== null &&
          typeof queryParams[queryParamsKey] !== 'undefined'
        ) {
          nextQueryParams[queryParamsKey] = queryParams[queryParamsKey]
          return
        }
        if (queryParamsUpdater[queryParamsKey] === '') {
          nextQueryParams[queryParamsKey] = null
        }
      })

      const nextLocationSearch = stringify(nextQueryParams)

      return nextLocationSearch
    }

    getQueryParams = () => {
      const { location } = this.props
      return selectQueryParamsFromQueryString(location.search)
    }

    getSearchFromRemove = (key, value) => {
      const queryParams = this.getQueryParams()

      const previousValue = queryParams[key]
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
      const queryParams = this.getQueryParams()
      if (translater) {
        return translater(queryParams)
      }
      if (mapper) {
        return getObjectWithMappedKeys(queryParams, mapper)
      }
      return queryParams
    }

    render() {
      return <WrappedComponent {...this.props} query={this.query} />
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
