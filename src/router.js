import { createRouter, createWebHashHistory } from "vue-router";

import Room from './components/Room/Room.vue';
import Player from './components/Player/Player.vue';

export const routes = [
	{ path: '/room', component: Room },
	{ path: '/player', component: Player },
]

export default createRouter({
	history: createWebHashHistory(),
	routes,
});