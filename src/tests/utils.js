import { withRouter } from 'react-router-dom'

import withReactQuery from '../withReactQuery'

const Test = () => null

export const QueryRouterTest = withRouter(withReactQuery()(Test))

export const FrenchQueryRouterTest = withRouter(withReactQuery({
  mapper: {
    'lieu': "venue"
  }
})(Test))
