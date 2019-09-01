import { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

import withQuery from '../withQuery'

export class Test extends PureComponent {
  componentDidUpdate(prevProps) {
    const { onUpdate } = this.props
    if (onUpdate) {
      onUpdate(this.props, prevProps)
    }
  }
  render () {
    return null
  }
}
export const QueryRouterTest = withRouter(withQuery()(Test))

export const FrenchQueryRouterTest = withRouter(withQuery({
  creationKey: 'nouveau',
  mapper: {
    'lieu': "venue"
  },
  modificationKey: 'changement',
})(Test))
