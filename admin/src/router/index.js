import Vue from 'vue';
import Router from 'vue-router';
/* eslint-disable */
Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/* Router Modules */
import componentsRouter from './modules/components';
import chartsRouter from './modules/charts';
import tableRouter from './modules/table';
import nestedRouter from './modules/nested';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true,
  },
  {
    path: '/editor',
    component: () => import('@/views/new-blog/editor'),
  },
  {
    path: '/editblog',
    component: Layout,
    meta: { title: '文章管理', icon: 'dashboard', affix: true },
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/new-blog/new-blog'),
        name: '发布文章',
        meta: { title: '发布文章', icon: 'dashboard', affix: true },
      },
      {
        path: ':hash?',
        component: () => import('@/views/new-blog/new-blog'),
        name: '编辑文章',
        meta: { title: '编辑文章', icon: 'dashboard', affix: true },
      },
    ],
  },
  {
    path: '/',
    component: Layout,
    redirect: '/bloglist',
    children: [
      {
        path: 'bloglist',
        component: () => import('@/views/blog-list/blog-list'),
        name: '文章管理',
        meta: { title: '文章管理', icon: 'dashboard', affix: true },
      },
    ],
  },
  {
    path: '/label',
    component: Layout,
    redirect: '/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/label-list/label-list'),
        name: '标签管理',
        meta: { title: '标签管理', icon: 'dashboard', affix: true },
      },
    ],
  },
  {
    path: '/folder',
    component: Layout,
    redirect: '/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/folder-list/folder-list'),
        name: '目录管理',
        meta: { title: '目录管理', icon: 'dashboard', affix: true },
      },
    ],
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [];

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
