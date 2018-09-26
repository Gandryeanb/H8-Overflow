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
      <a class="ui right aligned header link"  style="color: brown" @click="loginRedirect"><h4  >Already have an account?</h4></a>
    </div>
    <div class="ui container text segment" style="backgroundColor: orange;">
      <h2 class="ui dividing header" style="color: brown;">Sign-up</h2>
      <form class="ui form">
        <div class="field">
          <div class="three fields">
            <div class="field required">
              <label style="color: brown;">First name</label>
              <input type="text" placeholder="First Name" v-model="fname">
            </div>
            <div class="field">
              <label style="color: brown;">Middle name</label>
              <input type="text" placeholder="Middle Name" v-model="mname">
            </div>
            <div class="field">
              <label style="color: brown;">Last name</label>
              <input type="text" placeholder="Last Name" v-model="lname">
            </div>
          </div>
        </div>
        <div class="field">
          <div class="two fields">
            <div class="field required">
              <label style="color: brown;">Email</label>
              <input type="text" placeholder="Email" v-model="email">
            </div>
            <div class="field required">
              <label style="color: brown;">Password</label>
              <input type="password" placeholder="Password" v-model="password">
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="ui container text" style="margin-top: 20px;">
      <div class="field">
        <div class="ui brown right floated button" @click="regist">
          Sign me up!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import { config } from '../config.js'
const config = require('../config.js')

export default {
  name: 'register',
  data () {
    return {
      fname: '',
      mname: '',
      lname: '',
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
    loginRedirect () {
      this.$router.push('/login')
    },
    homeRedirect () {
      this.$router.push('/')
    },
    regist () {
      let self = this
      axios({
        url: `${config.host}/users/register`,
        method: 'post',
        data: {
          fname: this.fname,
          lname: this.lname,
          email: this.email,
          password: this.password
        }
      })
        .then(response => {
          this.fname = ''
          this.mname = ''
          this.lname = ''
          this.email = ''
          this.password = ''
          self.$router.push('/login')
        })
        .catch(response => {
          this.notif = true
          this.notifVal = response.response.data.message
          setTimeout(() => {
            this.notif = false
          }, 4000)
        })
    }
  }
}
</script>

<style>

</style>
