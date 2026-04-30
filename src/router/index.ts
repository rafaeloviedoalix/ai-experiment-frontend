import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/roster' },
    {
      path: '/roster',
      name: 'roster-analysis',
      component: () => import('@/views/RosterAnalysis/RosterAnalysisView.vue'),
    },
    {
      path: '/financial',
      name: 'financial-data-pull',
      component: () => import('@/views/FinancialDataPull/FinancialDataPullView.vue'),
    },
    {
      path: '/integrated',
      name: 'integrated-analysis',
      component: () => import('@/views/IntegratedAnalysis/IntegratedAnalysisView.vue'),
    },
  ],
})

export default router
