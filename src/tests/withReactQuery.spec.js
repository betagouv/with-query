import { mount, shallow } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import { Route, Router } from 'react-router-dom'

import { FrenchQueryRouterTest, QueryRouterTest } from './utils'

describe('src | components | pages | hocs | withQuery', () => {
  describe('snapshot', () => {
    it('should match snapshot', () => {
      // when
      const wrapper = shallow(<QueryRouterTest />)

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('functions ', () => {
    describe('getParams', () => {
      it('withQuery passes a query.getParams function that formats the location search string into in a params object', () => {
        // given
        const history = createBrowserHistory()
        history.push('/test?page=1&keywords=test&orderBy=offer.id+desc')

        // when
        const wrapper = mount(
          <Router history={history}>
            <Route path="/test">
              <QueryRouterTest />
            </Route>
          </Router>
        )

        // then
        const { query } = wrapper.find('Test').props()
        const expectedParams = {
          keywords: "test",
          orderBy: "offer.id desc",
          page: "1",
        }
        expect(query.getParams()).toEqual(expectedParams)
      })
    })

    describe('getTranslatedParams', () => {
      it('withQuery passes query.getTranslatedParams function that transforms queryParams into transltaed params thanks to a mapper', () => {
        // given
        const history = createBrowserHistory()
        history.push('/test?lieu=AE')
        const wrapper = mount(
          <Router history={history}>
            <Route path="/test">
              <FrenchQueryRouterTest />
            </Route>
          </Router>
        )
        let props = wrapper.find('Test').props()

        // when
        const translatedQueryParams = props.query.getTranslatedParams()

        // then
        const expectedTranslatedQueryParams = {
          venue: "AE"
        }
        expect(translatedQueryParams).toEqual(expectedTranslatedQueryParams)
      })
    })

    describe('getSearchFromUpdate', () => {
      it('withQuery passes query.getSearchFromUpdate that overwrites the location.search', () => {
        // given
        const history = createBrowserHistory()
        history.push('/test?page=1&keywords=test')
        const wrapper = mount(
          <Router history={history}>
            <Route path="/test">
              <QueryRouterTest />
            </Route>
          </Router>
        )
        const { query } = wrapper.find('Test').props()

        // when
        const search = query.getSearchFromUpdate({ keywords: null, page: 2 })

        // then
        expect(search).toStrictEqual('?page=2')
      })
    })

    describe('getSearchFromAdd', () => {
      it('withQuery passes query.getSearchFromAdd function that concatenates values in the location.search', () => {
        // given
        const history = createBrowserHistory()
        history.push('/test?jours=0,1&keywords=test')
        const wrapper = mount(
          <Router history={history}>
            <Route path="/test">
              <QueryRouterTest />
            </Route>
          </Router>
        )
        const { query } = wrapper.find('Test').props()

        // when
        const search = query.getSearchFromAdd('jours', '2')

        // then
        expect(search).toStrictEqual('?jours=0%2C1%2C2&keywords=test')
      })
    })

    describe('getSearchFromRemove', () => {
      it('withQuery passes query.getSearchFromRemove function that pops values from the location.search', () => {
        // given
        const history = createBrowserHistory()
        history.push('/test?jours=0,1&keywords=test')
        const wrapper = mount(
          <Router history={history}>
            <Route path="/test">
              <QueryRouterTest />
            </Route>
          </Router>
        )
        const { query } = wrapper.find('Test').props()

        // when
        const search = query.getSearchFromRemove('jours', '1')

        // then
        expect(search).toStrictEqual('?jours=0&keywords=test')
      })
    })
  })
})
