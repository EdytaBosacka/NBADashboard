import { createWebHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from "vue-router";
import PlayersList from '@/components/PlayersList.vue'
import PlayerStats from '@/components/PlayerStats.vue'

const routes: Array<RouteRecordRaw> = [
    {
      path: "/",
      alias: "/playersList",
      name: "PlayersList",
      component: PlayersList
    },
    {
      path: "/player/:id/stats",
      alias: "/playerStats",
      name: "PlayerStats",
      component: PlayerStats,
      props: true
    },
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  export default router;
  