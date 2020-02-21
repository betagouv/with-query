import PropTypes from 'prop-types'
import React from 'react'

import useQuery from './useQuery'


export default config => WrappedComponent => {
  const _withQuery = props => (
    <WrappedComponent
      query={useQuery(props.location.search, config)}
      {...props}
    />
  )

  _withQuery.propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string.isRequired
    }).isRequired
  }

  _withQuery.WrappedComponent = WrappedComponent

  return _withQuery
}
