import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  alias: {
    '@': require('path').resolve(__dirname, 'src'),
  },
  routes: [
    { path: '/', component: '@/pages/index.tsx' },
  ],
  fastRefresh: {},
});
