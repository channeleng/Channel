import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

import Dashboard from '../views/Dashboard.vue'
import Episodes from '../views/Episodes.vue'
import Settings from '../views/Settings.vue'
import ProfileTab from '../views/ProfileTab.vue'

import SubscriptionsTab from '../views/SubscriptionsTab'
import Profile from '../views/Profile.vue'
import Episode from '../views/Episode.vue'

import store from '../store'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/dashboard',
        component: Dashboard,
        beforeEnter: () => {
            return store.state.isCreator ? true : '/'
        },
        children: [
            {
                path: '/dashboard/episodes',
                component: Episodes
            },
            {
                path: '/dashboard/settings',
                component: Settings,
                children: [
                    {
                        path: '/dashboard/settings/profile',
                        component: ProfileTab
                    },
                    {
                        path: '/dashboard/settings/subscriptions',
                        component: SubscriptionsTab
                    },
                ]
            }
        ]
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/profile/:address',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/episode/:cid',
        name: 'Episode',
        component: Episode
    },
]

const router = createRouter({ 
    history: createWebHistory(), 
    routes,
    scrollBehavior() {
        return { top: 0 }
    }, 
})
export default router