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
  routes.push({
    path: path || `/${viewName}`,
    name: name || viewName,
    component,
    beforeEnter
  });
});

const router = new VueRouter({ routes });

export default router;
