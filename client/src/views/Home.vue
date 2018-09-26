<template>
  <div class="home">
    <!-- nav bar -->
    <div class="ui attached segment" style="background-color: orange;">
      <div class="ui grid">
        <div class="three wide column">
          <h1 style="color: brown;" @click="home">Q Answer</h1>
        </div>
        <div class="ten wide column">
          <div class="ui container">
            <div class="ui form">
              <div class="ui icon large fluid input">
                <input type="text" placeholder="Find your answer" v-model="querySearch">
                <i class="search icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="three wide column">
          <div v-if="!currentUser.isLogin">
            <button class="ui large inverted right floated button" tabindex="0" @click="loginRedirect"> Login </button>
            <button class="ui large inverted right floated button" tabindex="0" @click="registRedirect"> Register </button>
          </div>
          <div v-else>
            <button class="ui large inverted right floated button" tabindex="0" @click="logout"> Logout </button>
          </div>
        </div>
      </div>
    </div>
    <!-- notif message -->
    <div class="ui container text" style="margin-top:20px;" v-if="notif">
      <div class="ui green tiny message">
        <i class="close icon"></i>
        <div class="header">
          {{ notifVal }}
        </div>
      </div>
    </div>
    <div class="ui container" style="margin-top: 30px;">
      <div class="ui grid">
        <div class="ui four wide column">
          <button class="ui fluid big yellow button" @click="createFormToggle" v-if="currentUser.isLogin"> Create Question </button>
          <div class="ui" style="margin-top:20px;">
            <!-- side-nav -->
            <sideNav></sideNav>
          </div>
        </div>
        <div class="ui twelve wide column">
          <createQuestion v-if="createForm" @formswitch="createFormToggle"></createQuestion>
          <router-view></router-view>
          <div style="margin-bottom: 150px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import createQuestion from '../components/createQuestion.vue'
import sideNav from '../components/sideNav.vue'

export default {
  name: 'home',
  data () {
    return {
      notif: false,
      notifVal: '',
      createForm: false,
      querySearch: ''
    }
  },
  computed: {
    ...mapState(['currentUser', 'selectedQ'])
  },
  watch: {
    querySearch () {
      if (this.querySearch != '') {
        this.searchTitle(this.querySearch)
      } else {
        this.loadData()
      }
    }
  },
  created () {
    this.isAlreadyLoginAct()
    this.loadData()
  },
  methods: {
    ...mapActions(['isAlreadyLoginAct', 'loadData', 'searchTitle']),
    home () {
      this.$router.push('/')
    },
    createFormToggle () {
      this.createForm = !this.createForm
    },
    logout () {
      localStorage.removeItem('authorization')
      this.isAlreadyLoginAct()
    },
    loginRedirect () {
      this.$router.push('/login')
    },
    registRedirect () {
      this.$router.push('/register')
    }
  },
  components: {
    createQuestion, sideNav
  }
}
</script>
