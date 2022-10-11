import { createRouter, createWebHashHistory } from "vue-router";

import Home from './components/Home.vue';
import Room from './components/Room/Room.vue';
import Player from './components/Player/Player.vue';

export const routes = [
	{path: '/', component: Home },
	{ path: '/room', component: Room },
	{ path: '/player', component: Player },
]

export default createRouter({
	history: createWebHashHistory(),
	routes,
});