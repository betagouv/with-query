# with-react-query

A small wrapper of react-router parsing the query params from the location.search

[![CircleCI](https://circleci.com/gh/betagouv/with-react-query/tree/master.svg?style=svg)](https://circleci.com/gh/betagouv/with-react-query/tree/master)
[![npm version](https://img.shields.io/npm/v/with-react-query.svg?style=flat-square)](https://npmjs.org/package/with-react-query)

## Basic usage with `params`

Make your app starting at `/foo?counter=1`.

### react old school

```javascript
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import withQuery from 'with-react-query'

class Foo extends PureComponent {

  handleIncrementCounter = () => {
    const { history, query } = this.props
    const { getSearchFromUpdate, params: { counter } } = query
    history.push(getSearchFromUpdate({ counter: counter + 1 }))
  }

  render () {
    const { query } = this.props
    const { params: { counter } } = query
    return (
      <div>
        My counter is equal to {counter}
        <button onClick={this.handleIncrementCounter}>
          Increment
        </button>
      </div>
    )
  }
}

export default withRouter(withQuery()(Foo))
```

### react hooks school

```javascript
import React, { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from 'with-react-query'

const Foo = () => {
  const history = useHistory()
  const location = useLocation()
  const { getSearchFromUpdate, params: { counter } } = useQuery(location.search)

  const handleIncrementCounter = useCallback(() =>
    history.push(getSearchFromUpdate({ counter: counter + 1 })),
    [counter, getSearchFromUpdate, history])

  return (
    <div>
      My counter is equal to {counter}
      <button onClick={handleIncrementCounter}>
        Increment
      </button>
    </div>
  )
}

export default Foo
```


## Usage for url in foreign language with `getTranslatedParams`

Make your app starting at `/foo?compteur=1`.

```javascript
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import withReactQuery from 'with-react-query'

class Foo extends PureComponent {

  handleIncrementCounter = () => {
    const { history, query } = this.props
    const { counter } = query.getTranslatedParams()
    history.push(query.getSearchFromUpdate({ counter: counter + 1 }))
  }

  render () {
    const { query } = this.props
    const { counter } = query.getTranslatedParams()
    return (
      <div>
        My counter is equal to {counter}
        <button onClick={this.handleIncrementCounter}>
          Increment
        </button>
      </div>
    )
  }
}

export default withRouter(withQuery({
  mapper: { compteur: "counter" }
})(Foo))
```
