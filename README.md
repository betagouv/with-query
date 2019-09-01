# with-query

A small wrapper of react-router parsing the query params from the location.search

[![CircleCI](https://circleci.com/gh/betagouv/with-query/tree/master.svg?style=svg)](https://circleci.com/gh/betagouv/with-query/tree/master)
[![npm version](https://img.shields.io/npm/v/with-query.svg?style=flat-square)](https://npmjs.org/package/with-query)

## Basic usage with `parse`
```javascript

// Let's say you are at location '/foo?counter=1'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import withQueryRouter from 'with-query'

class FooPage extends PureComponent {

  onIncrementCounter = () => {
    const { query } = this.props
    const { counter } = query.parse()
    // navigate to /foo?counter=2
    query.change({ counter: counter + 1 })
  }

  render () {
    const { query } = this.props
    const { counter } = query.parse()
    return (
      <div>
        My counter is equal to {counter}
        <button onClick={this.onIncrementCounter}>
          Increment
        </button>
      </div>
    )
  }
}

export default withRouter(withQuery()(FooPage))
```

## Usage for url in foreign language with `translate`
```javascript

// Let's say you are at location '/foo/compteur=1'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import withQueryRouter from 'with-query'

class FooPage extends PureComponent {

  onIncrementCounter = () => {
    const { query } = this.props
    const { counter } = query.translate()
    // navigate to /foo?compteur=2
    query.change({ counter: counter + 1 })
  }

  render () {
    const { query } = this.props
    const { counter } = query.translate()
    return (
      <div>
        My counter is equal to {counter}
        <button onClick={this.onIncrementCounter}>
          Increment
        </button>
      </div>
    )
  }
}

export default withRouter(withQuery({
  mapper: { compteur: "counter" }
})(FooPage))
```
