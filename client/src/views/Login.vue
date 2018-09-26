<template>
  <div class="ui" style="margin-top: 70px;">
    <a class="ui center aligned header" @click="homeRedirect" style="font-size:80px; color: brown;">
      <p>Q Answer</p>
    </a>
    <div class="ui container text" style="margin-top:10px; margin-bottom:20px;" v-if="notif">
      <div class="ui red tiny message">
        <i class="close icon"></i>
        <div class="header">
          {{ notifVal }}
        </div>
      </div>
    </div>
    <div class="wrapper" style="height: 57px" v-else></div>
    <div class="ui container text">
      <a class="ui right aligned header link"  style="color: brown" @click="signUpRedirect"><h4>Doesn't have an account?</h4></a>
    </div>
    <div class="ui container text segment" style="backgroundColor: orange; margin-top:10px;">
      <h2 class="ui dividing header" style="color: brown;">Login</h2>
      <form class="ui form">
        <div class="field">
          <!-- <div class="two fields"> -->
            <div class="field required">
              <label style="color: brown;">Email</label>
              <input type="text" placeholder="Email" v-model="email">
            </div>
            <div class="field required">
              <label style="color: brown;">Password</label>
              <input type="password" placeholder="Password" v-model="password">
            </div>
          <!-- </div> -->
        </div>
      </form>
    </div>
    <div class="ui container text" style="margin-top: 20px;">
      <button class="ui right floated brown right labeled medium icon button" @click="loginMail">
        <i class="right arrow icon"></i>
        Log me in
    </button>
      <div class="ui right floated facebook button" @click="loginFb">
        <i class="facebook icon"></i>
        Facebook
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import facebookLogin from 'facebook-login'
import config from '../config'
const api = facebookLogin({ appId: config.API_KEY_FB })

export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: '',
      notif: false,
      notifVal: ''
    }
  },
  created () {
    let auth = localStorage.getItem('authorization')
    if (auth) {
      this.$router.push('/')
    }
  },
  methods: {
    signUpRedirect () {
      this.$router.push('/register')
    },
    homeRedirect () {
      this.$router.push('/')
    },
    loginMail () {
      axios({
        url: `${config.host}/users/login`,
        method: 'post',
        data: {
          email: this.email,
          password: this.password
        }
      })
        .then(response => {
          localStorage.setItem('authorization', response.data.authorization)
          this.$router.push('/')
        })
        .catch(response => {
          this.notif = true
          this.notifVal = response.response.data.message
          setTimeout(() => {
            this.notif = false
          }, 4000)
        })
    },
    loginFb () {
      api.login()
        .then((response) => {
          axios({
            url: `${config.host}/users/login/facebook`,
            method: 'get',
            headers: {
              token: response.authResponse.accessToken
            }
          })
            .then(response => {
              localStorage.setItem('authorization', response.data.authorization)
              this.$router.push('/')
            })
            .catch(response => {
              this.notif = true
              this.notifVal = response.response.data.message
              setTimeout(() => {
                this.notif = false
              }, 4000)
            })
        })
    }
  }
}
</script>

<style>

</style>
