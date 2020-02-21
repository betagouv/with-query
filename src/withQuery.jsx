import React from 'react'

import useQuery from './useQuery'


const withQuery = config => WrappedComponent => {
  const _withQuery = props => (
    <WrappedComponent
      {...props}
      query={useQuery(props.location.search, config)}
    />
  )

  _withQuery.WrappedComponent = WrappedComponent

  return _withQuery
}

export default withQuery
