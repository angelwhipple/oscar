import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SettingView from "../views/SettingView.vue";

// import ScheduleDetailComponent from "@/components/Scheduling/ScheduleDetailComponent.vue";
import CreateGroup from "@/Grouping/CreatGroup.vue";
// import GroupDetail from "@/Grouping/GroupDetail.vue";
import GroupList from "@/Grouping/GroupList.vue";
import ManageGroup from "@/Grouping/ManageGroup.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
    {
      path: "/groups/create",
      name: "CreateGroup",
      component: CreateGroup,
    },
    {
      path: "/groups",
      name: "GroupList",
      component: GroupList,
    },
    // {
    //   path: "/groups/:id",
    //   name: "GroupDetail",
    //   component: GroupDetail,
    //   props: true,
    // },

    {
      path: "/groups/manage/:id",
      name: "ManageGroup",
      component: ManageGroup,
      props: true,
    },
    // {
    //   path: "/schedules/:id",
    //   name: "ScheduleDetail",
    //   component: ScheduleDetailComponent,
    //   props: true,
    // },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
