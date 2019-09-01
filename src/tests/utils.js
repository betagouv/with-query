import { withRouter } from 'react-router-dom'

import withQuery from '../withQuery'

const Test = () => null

export const QueryRouterTest = withRouter(withQuery()(Test))

export const FrenchQueryRouterTest = withRouter(withQuery({
  mapper: {
    'lieu': "venue"
  }
})(Test))
