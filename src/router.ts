import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { kebabCase } from 'lodash';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [];

const requireView = require.context('@/views', true, /[\w-]+\.vue$/);
requireView.keys().forEach(fileName => {
  const viewConfig = requireView(fileName);
  const component = viewConfig.default;
  const viewName = kebabCase(
    fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
  );
  const { path, name, beforeEnter } = component;
  const paths = Array.isArray(path) ? path : [path];
  paths.forEach((path, i) => {
    let pathName = name || viewName;
    if (i > 0) pathName += `-${i}`;
    routes.push({
      path: path || `/${viewName}`,
      name: pathName,
      component,
      beforeEnter
    });
  });
});

const router = new VueRouter({ routes });

export default router;
