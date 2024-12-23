/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as NewGuideImport } from './routes/new-guide'
import { Route as LoginImport } from './routes/login'
import { Route as GuideImport } from './routes/guide'
import { Route as FaqImport } from './routes/faq'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const NewGuideRoute = NewGuideImport.update({
  id: '/new-guide',
  path: '/new-guide',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const GuideRoute = GuideImport.update({
  id: '/guide',
  path: '/guide',
  getParentRoute: () => rootRoute,
} as any)

const FaqRoute = FaqImport.update({
  id: '/faq',
  path: '/faq',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/faq': {
      id: '/faq'
      path: '/faq'
      fullPath: '/faq'
      preLoaderRoute: typeof FaqImport
      parentRoute: typeof rootRoute
    }
    '/guide': {
      id: '/guide'
      path: '/guide'
      fullPath: '/guide'
      preLoaderRoute: typeof GuideImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/new-guide': {
      id: '/new-guide'
      path: '/new-guide'
      fullPath: '/new-guide'
      preLoaderRoute: typeof NewGuideImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/faq': typeof FaqRoute
  '/guide': typeof GuideRoute
  '/login': typeof LoginRoute
  '/new-guide': typeof NewGuideRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/faq': typeof FaqRoute
  '/guide': typeof GuideRoute
  '/login': typeof LoginRoute
  '/new-guide': typeof NewGuideRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/faq': typeof FaqRoute
  '/guide': typeof GuideRoute
  '/login': typeof LoginRoute
  '/new-guide': typeof NewGuideRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/about' | '/faq' | '/guide' | '/login' | '/new-guide'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/about' | '/faq' | '/guide' | '/login' | '/new-guide'
  id: '__root__' | '/' | '/about' | '/faq' | '/guide' | '/login' | '/new-guide'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  FaqRoute: typeof FaqRoute
  GuideRoute: typeof GuideRoute
  LoginRoute: typeof LoginRoute
  NewGuideRoute: typeof NewGuideRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  FaqRoute: FaqRoute,
  GuideRoute: GuideRoute,
  LoginRoute: LoginRoute,
  NewGuideRoute: NewGuideRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/faq",
        "/guide",
        "/login",
        "/new-guide"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/faq": {
      "filePath": "faq.tsx"
    },
    "/guide": {
      "filePath": "guide.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/new-guide": {
      "filePath": "new-guide.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
