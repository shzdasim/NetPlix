import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Browse from '../pages/Browse.vue'
import Movies from '../pages/Movies.vue'
import Series from '../pages/Series.vue'
import MovieDetail from '../pages/MovieDetail.vue'
import TvDetail from '../pages/TvDetail.vue'
import Watch from '../pages/Watch.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/browse', name: 'browse', component: Browse },
  { path: '/movies', name: 'movies', component: Movies },
  { path: '/series', name: 'series', component: Series },
  { path: '/movie/:id', name: 'movie', component: MovieDetail },
  { path: '/tv/:id', name: 'tv', component: TvDetail },
  { path: '/watch/:type/:id', name: 'watch', component: Watch },
]


export default createRouter({
  history: createWebHistory(),
  routes,
})

