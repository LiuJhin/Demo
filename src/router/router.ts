/*
 * @Author: J_in
 * @Date: 2022-12-09 16:13:25
 * @LastEditors: J_in
 * @LastEditTime: 2022-12-09 16:14:14
 * @FilePath: /demo/src/router/router.ts
 */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const HelloWorld = () => import('../components/HelloWorld.vue')
const Login = () => import('../views/Login.vue')
const main = () => import('../Layout/main/index.vue')

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default  router