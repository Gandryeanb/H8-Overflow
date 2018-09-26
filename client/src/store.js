import config from './config'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      isLogin: false,
      name: 'none',
      mail: 'none'
    },
    allData: {},
    allDataFix: {},
    selectedQ: {}
  },
  mutations: {
    allDataFix (state, payload) {
      state.allDataFix= payload
    },
    isAlreadyLoginMut (state, payload) {
      state.currentUser = payload
    },
    resultLoadData (state, payload) {
      state.allData = payload
    },
    selectQ (state, payload) {
      state.selectedQ = payload
    }
  },
  actions: {
    searchTitle ({ commit }, payload) {
      axios({
        url: `${config.host}/questions/search/${payload}`,
        method: 'get'
      })
        .then(response => {
          commit('resultLoadData', response.data.data)
        })
        .catch(response => {
          console.log('failed load data', response.data)
        })
    },
    removePost ({ commit, dispatch }, payload) {
      axios({
        url: `${config.host}/${payload.target}/${payload.id}`,
        method: 'delete',
        headers: {
          authorization: localStorage.getItem('authorization')
        }
      })
        .then(response => {
          dispatch('loadData')
        })
        .catch(response => {
          console.log(response)
        })
    },
    detailQ ({ commit, dispatch }, payload) {
      axios({
        url: `${config.host}/questions/${payload}`,
        method: 'get'
      })
        .then(response => {
          commit('selectQ', response.data.data)
          dispatch('loadData')
        })
        .catch(response => {
          console.log('failed to get detail question')
        })
    },
    downvote ({ commit, dispatch }, payload) {
      axios({
        url: `${config.host}/${payload.target}/downvote/${payload.id}`,
        method: 'get',
        headers: {
          authorization: localStorage.getItem('authorization')
        }
      })
        .then(response => {
          if (payload.on) {
            dispatch('detailQ', payload.on)
          } else {
            dispatch('detailQ', payload.id)
          }
          dispatch('loadData')
        })
        .catch(response => {
          console.log('error when upvoting question')
        })
    },
    upvote ({ commit, dispatch }, payload) {
      axios({
        url: `${config.host}/${payload.target}/upvote/${payload.id}`,
        method: 'get',
        headers: {
          authorization: localStorage.getItem('authorization')
        }
      })
        .then(response => {
          if (payload.on) {
            dispatch('detailQ', payload.on)
          } else {
            dispatch('detailQ', payload.id)
          }
          dispatch('loadData')
        })
        .catch(response => {
          console.log('error when upvoting question')
        })
    },
    loadData ({ commit }, payload) {
      axios({
        url: `${config.host}/questions`,
        method: 'get'
      })
        .then(response => {
          commit('resultLoadData', response.data.data)
          commit('allDataFix', response.data.data)
        })
        .catch(response => {
          console.log('failed load data', response.data)
        })
    },
    isAlreadyLoginAct ({ commit }, payload) {
      let auth = localStorage.getItem('authorization')
      if (auth) {
        axios({
          url: `${config.host}/users`,
          method: 'get',
          headers: {
            'authorization': auth
          }
        })
          .then(response => {
            let data = {
              isLogin: true,
              id: response.data.data.id,
              fname: response.data.data.fname,
              email: response.data.data.email
            }
            commit('isAlreadyLoginMut', data)
          })
          .catch(response => {
            commit('isAlreadyLoginMut', {
              isLogin: false,
              name: 'none',
              email: 'none'
            })
          })
      } else {
        commit('isAlreadyLoginMut', {
          isLogin: false,
          name: 'none',
          email: 'none'
        })
      }
    }
  }
})
