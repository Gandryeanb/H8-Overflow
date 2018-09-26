<template>
  <div class="ui segment" style="margin-bottom:30px;">
    <h2 class="ui dividing header" style="color: brown;">Create Question</h2>
    <div class="ui form">
      <div class="ui field">
        <h3 style="color: orange">Title :</h3>
        <input type="text" placeholder="Title of your mistery" v-model="titleVal">
      </div>
      <div>
        <h3 style="color: orange; font-size: 19px; padding-top: -40px; position: absolute"> Describe it :</h3>
        <textarea class="ui textarea" rows="4" style="margin-top:29px;" type="text" placeholder="Describe to other why this bothering you" v-model="describeVal"></textarea>
      </div>
      <div class="ui grid">
        <div class="ui sixteen wide column">
          <button class="ui right floated orange labeled icon button" style="margin-top: 15px;" @click="createQ"><i class="ui pencil icon"></i> Create </button>
          <button class="ui right floated yellow button" style="margin-top: 15px;" @click="switchToggle"> Cancle </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

import config from '../config'

export default {
  name: 'createQestion',
  data () {
    return {
      titleVal: '',
      describeVal: ''
    }
  },
  methods: {
    ...mapActions(['loadData']),
    switchToggle () {
      this.$emit('formswitch')
    },
    createQ () {
      let self = this
      axios({
        url: `${config.host}/questions`,
        method: 'post',
        data: {
          title: this.titleVal,
          description: this.describeVal
        },
        headers: {
          authorization: localStorage.getItem('authorization')
        }
      })
        .then(response => {
          self.loadData()
          self.titleVal = ''
          self.describeVal = ''
          self.$emit('formswitch')
        })
        .catch(response => {
          console.log(response)
          self.$emit('formswitch')
          console.log('error when creating new question')
        })
    }
  }
}
</script>

<style>

</style>
