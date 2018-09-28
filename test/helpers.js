import { Routes as nextRoutes } from '../src'

export const setupRouterMethods = (routerMethods, ...args) => {
  const { routes, route } = setupRoute(...args)

  const testMethods = (argoments, expected) => {
    routerMethods.forEach(method => {
      const Router = routes.getRouter({ [method]: jest.fn() })
      Router[`${method}Route`](...argoments)
      expect(Router[method]).toBeCalledWith(...expected)
    })
  }

  return { routes, route, testMethods }
}

export const setupRoute = (...args) => {
  const routes = nextRoutes({ locale: 'en' }).add(...args)
  const route = routes.routes[routes.routes.length - 1]
  return { routes, route }
}