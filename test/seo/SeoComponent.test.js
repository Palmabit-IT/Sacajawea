/* global jest, describe, test, expect */
'use strict'

import { shallow } from 'enzyme'
import Seo from './../../src/seo/seoComponent'
import Route from './../../src/Route'
import mocks from 'node-mocks-http'
import { Routes as nextRoutes } from './../../src'


describe('Component: Seo', () => {
  let req = {}
  let res = {}
  let routes
  beforeAll(() => {
    routes = nextRoutes({ locale: 'it', siteUrl: 'https://test.com' })
      .add('home', 'en', '/', 'homepage')
      .add('home', 'it', '/', 'homepage')
      .add('home', 'de', '/', 'homepage')
      .add('home', 'fr', '/', 'homepage')
      .add('newsDetail', 'it', '/:slug', 'newsDetail')

    req = mocks.createRequest({
      method: 'GET',
      url: '/en'
    })
    res = mocks.createResponse()
  })

  describe('title tags', () => {
    test('can return component with og:title field', () => {
      const result = shallow(<Seo title={'foo'} />)
      expect(result.contains(<meta property="og:title" content="foo" />)).toBeTruthy()
    })
    test('can return component with tw:title field', () => {
      const result = shallow(<Seo title={'foo'} />)
      expect(result.contains(<meta property="twitter:title" content="foo" />)).toBeTruthy()
    })
  })

  describe('description tags', () => {
    test('can return component with description field', () => {
      const result = shallow(<Seo description={'Lorem ipsum dolor sit amet'} />)
      expect(result.contains(<meta name="description" content="Lorem ipsum dolor sit amet" />)).toBeTruthy()
    })
    test('can return component with og:description field', () => {
      const result = shallow(<Seo description={'Lorem ipsum dolor sit amet'} />)
      expect(result.contains(<meta property="og:description" content="Lorem ipsum dolor sit amet" />)).toBeTruthy()
    })
    test('can return component with tw:description field', () => {
      const result = shallow(<Seo description={'Lorem ipsum dolor sit amet'} />)
      expect(result.contains(<meta property="twitter:description" content="Lorem ipsum dolor sit amet" />)).toBeTruthy()
    })
  })

  describe('og:locale', () => {

    test('can return null on getOgLocale function', () => {
      const seoComponent = shallow(<Seo description={'Lorem ipsum dolor sit amet'} />)

      const result = seoComponent.instance().getOgLocale({})

      expect(result).toBeNull()

    })

    test('getOgLocale should return null if called with falsy locale', () => {
      const seoComponent = shallow(<Seo description={'Lorem ipsum dolor sit amet'} />)

      const result = seoComponent.instance().getOgLocale({ nextRoute: { locale: undefined } })

      expect(result).toBeNull()

    })

    test('can return component with locale field', () => {
      const routeData = { name: 'home', locale: 'it', page: 'home', pattern: '/', forceLocale: true }
      const activeRoute = new Route(routeData)
      const result = shallow(<Seo req={{ nextRoute: activeRoute }} />)
      expect(result.contains(<meta property="og:locale" content="it_IT" />)).toBeTruthy()
    })
  })

  describe('canonical', () => {

    test('can return caononical correctly', () => {
      req = mocks.createRequest({
        method: 'GET',
        url: '/foo-bar'
      })
      res = mocks.createResponse()


      routes.getRequestHandler({ getRequestHandler: () => jest.fn(), render: jest.fn() })(req)

      const result = shallow(<Seo req={req} canonicalUrl="https://test.com/foo-bar" />)
      expect(result.contains(<link rel="canonical" href="https://test.com/foo-bar" />)).toBeTruthy()
    })
    
    // test('can return component with canonical field', () => {
    //   routes.getRequestHandler({ getRequestHandler: jest.fn(), render: jest.fn() })(req)
    //   const result = shallow(<Seo req={req} />)
    //   expect(result.contains(<link rel="canonical" href="https://test.com/en" />)).toBeTruthy()
    // })

    // test('can return component without canonical field because siteUrl is not setted', () => {
    //   routes.siteUrl = ''
    //   routes.getRequestHandler({ getRequestHandler: jest.fn(), render: jest.fn() })(req)
    //   const result = shallow(<Seo req={req} />)
    //   expect(result.contains(<link rel="canonical" href="https://test.com/en" />)).toBeFalsy()
    // })

  })


  test('can not return hreflang if lang is once', () => {
    routes = nextRoutes({ locale: 'it', siteUrl: 'https://test.com' })
      .add('home', 'it', '/', 'homepage')
      .add('newsDetail', 'en', '/:slug', 'newsDetail')
      .add('newsDetail', 'it', '/:slug', 'newsDetail')
      .add('newsDetail', 'de', '/:slug', 'newsDetail')
      .add('newsDetail', 'fr', '/:slug', 'newsDetail')

    req = mocks.createRequest({
      method: 'GET',
      url: '/'
    })
    res = mocks.createResponse()


    routes.getRequestHandler({ getRequestHandler: () => jest.fn(), render: jest.fn() })(req)

    const result = shallow(<Seo req={req} />)
    expect(result.contains(<link rel="alternate" href="https://test.com/" hrefLang="it" />)).toBeFalsy()
  })

  test('can return component with hreflang', () => {
    routes = nextRoutes({ locale: 'it', siteUrl: 'https://test.com' })
      .add('newsDetail', 'en', '/:slug', 'newsDetail')
      .add('newsDetail', 'it', '/:slug', 'newsDetail')
      .add('newsDetail', 'de', '/:slug', 'newsDetail')
      .add('newsDetail', 'fr', '/:slug', 'newsDetail')

    req = mocks.createRequest({
      method: 'GET',
      url: '/en/hello'
    })
    res = mocks.createResponse()


    routes.getRequestHandler({ getRequestHandler: jest.fn(), render: jest.fn() })(req)
    const result = shallow(<Seo req={req} />)
    expect(result.contains(<link rel="alternate" href="https://test.com/en/hello" hrefLang="en" />)).toBeTruthy()
    expect(result.contains(<link rel="alternate" href="https://test.com/de/hello" hrefLang="de" />)).toBeTruthy()
    expect(result.contains(<link rel="alternate" href="https://test.com/fr/hello" hrefLang="fr" />)).toBeTruthy()
  })
})
