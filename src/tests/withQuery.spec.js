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
    describe('getQueryParams', () => {
      it('withQuery passes a query.getQueryParams function that formats the location search string into in a params object', () => {
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
          keywords: 'test',
          orderBy: 'offer.id desc',
          page: '1',
        }
        expect(query.getQueryParams()).toStrictEqual(expectedParams)
      })
    })

    describe('getTranslatedParams', () => {
      it('withQuery passes query.translate function that transforms queryParams into transltaed params thanks to a mapper', done => {
        // given
        const history = createBrowserHistory()
        history.push('/test?lieu=AE')
        const wrapper = mount(
          <Router history={history}>
            <Route path="/test">
              <FrenchQueryRouterTest onUpdate={onUpdate} />
            </Route>
          </Router>
        )
        let props = wrapper.find('Test').props()

        // when
        const translatedQueryParams = props.query.translate()

        // then
        const expectedTranslatedQueryParams = {
          venue: "AE"
        }
        expect(translatedQueryParams).toStrictEqual(expectedTranslatedQueryParams)

        // when
        props.query.change({ venue: "BF" })

        // then
        function onUpdate(props, prevProps) {
          const { location, query } = props
          const { pathname, search } = location
          const queryParams = query.getQueryParams()
          const translatedQueryParams = query.translate()

          props = wrapper.find('Test').props()
          const expectedQueryParams = {
            lieu: "BF"
          }
          const expectedTranslatedQueryParams = {
            venue: "BF"
          }
          expect(prevProps.location.pathname).toStrictEqual('/test')
          expect(prevProps.location.search).toStrictEqual('?lieu=AE')
          expect(pathname).toStrictEqual('/test')
          expect(search).toStrictEqual('?lieu=BF')
          expect(queryParams).toStrictEqual(expectedQueryParams)
          expect(translatedQueryParams).toStrictEqual(expectedTranslatedQueryParams)

          done()
        }

      })
    })

    describe('clear', () => {
      it('withQuery passes query.clear function that erases the location.search string', done => {
        // given
        const history = createBrowserHistory()
        history.push('/test?page=1&keywords=test')
        const wrapper = mount(
          <Router history={history}>
            <Route path="/test">
              <QueryRouterTest onUpdate={onUpdate}/>
            </Route>
          </Router>
        )
        const { query } = wrapper.find('Test').props()

        // when
        query.clear()

        // then
        function onUpdate(props, prevProps) {
          const { location, query } = props
          const { pathname, search } = location
          const expectedParams = {}

          expect(prevProps.location.pathname).toStrictEqual('/test')
          expect(prevProps.location.search).toStrictEqual('?page=1&keywords=test')
          expect(pathname).toStrictEqual('/test')
          expect(search).toStrictEqual('')
          expect(query.getQueryParams()).toStrictEqual(expectedParams)

          done()
        }
      })
    })

    describe('getSearchFromUpdate', () => {
      it('withQuery passes query.getSearchFromUpdate that overwrites the location.search', done => {
        // given
        const history = createBrowserHistory()
        history.push('/test?page=1&keywords=test')
        const wrapper = mount(
          <Router history={history}>
            <Route path="/test">
              <QueryRouterTest onUpdate={onUpdate}/>
            </Route>
          </Router>
        )
        const { query } = wrapper.find('Test').props()

        // when
        query.getSearchFromUpdate({ 'keywords': null, page: 2 })

        // then
        function onUpdate(props, prevProps) {
          const { location, query } = props
          const { pathname, search } = location
          const expectedParams = { page: '2' }

          expect(prevProps.location.pathname).toStrictEqual('/test')
          expect(prevProps.location.search).toStrictEqual('?page=1&keywords=test')
          expect(pathname).toStrictEqual('/test')
          expect(search).toStrictEqual('?page=2')
          expect(query.getQueryParams()).toStrictEqual(expectedParams)

          done()
        }
      })
    })

    describe('getSearchFromAdd', () => {
      it('withQuery passes query.getSearchFromAdd function that concatenates values in the location.search', done => {
        // given
        const history = createBrowserHistory()
        history.push('/test?jours=0,1&keywords=test')
        const wrapper = mount(
          <Router history={history}>
            <Route path="/test">
              <QueryRouterTest onUpdate={onUpdate} />
            </Route>
          </Router>
        )
        const { query } = wrapper.find('Test').props()

        // when
        query.getSearchFromAdd('jours', '2')

        // then
        function onUpdate(props, prevProps) {
          const { location, query } = props
          const { pathname, search } = location

          const expectedParams = { jours: '0,1,2', 'keywords': 'test' }
          expect(prevProps.location.pathname).toStrictEqual('/test')
          expect(prevProps.location.search).toStrictEqual('?jours=0,1&keywords=test')
          expect(pathname).toStrictEqual('/test')
          expect(search).toStrictEqual('?jours=0%2C1%2C2&keywords=test')
          expect(query.getQueryParams()).toStrictEqual(expectedParams)

          done()
        }
      })
    })

    describe('getSearchFromRemove', () => {
      it('withQuery passes query.getSearchFromRemove function that pops values from the location.search', done => {
        // given
        const history = createBrowserHistory()
        history.push('/test?jours=0,1&keywords=test')
        const wrapper = mount(
          <Router history={history}>
            <Route path="/test">
              <QueryRouterTest onUpdate={onUpdate} />
            </Route>
          </Router>
        )
        const { query } = wrapper.find('Test').props()

        // when
        query.getSearchFromRemove('jours', '1')

        // then
        function onUpdate(props, prevProps) {
          const { location, query } = props
          const { pathname, search } = location
          const expectedParams = { jours: '0', 'keywords': 'test' }

          expect(prevProps.location.pathname).toStrictEqual('/test')
          expect(prevProps.location.search).toStrictEqual('?jours=0,1&keywords=test')
          expect(pathname).toStrictEqual('/test')
          expect(search).toStrictEqual('?jours=0&keywords=test')
          expect(query.getQueryParams()).toStrictEqual(expectedParams)

          done()
        }
      })
    })
  })
})
