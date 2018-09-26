<template>
  <div class="ui" style="margin-bottom: 100px;">
    <div class="ui fluid card raised segment" style="margin-bottom: 20px;">
      <div class="content">
        <div class="ui grid">
          <div class="ui three wide column">
            <div class="ui grid">
              <div class="ui thirteen wide column">
                <h2 style="color: brown;">{{ selectedQ.title }}</h2>
              </div>
              <div class="ui three wide column">
              </div>
            </div>
          </div>
          <div class="ui thirteen wide column">
            <a class="ui green large right ribbon label" v-if="selectedQ.solved">Solved</a>
            <a class="ui yellow large right ribbon label" v-else>Unsolved</a>
          </div>
        </div>
      </div>
      <div class="content">
        <h4 class="ui meta" style="color: orange;">
          <i class="user icon"></i>
          {{ selectedQ.userId.fname }}
        </h4>
        <div class="content">
          <div class="summary">
            {{ selectedQ.description }}
          </div>
        </div>
      </div>
      <div class="extra content">
        <div class="ui grid">
          <div class="ui ten wide column">
            <div class="ui labeled button" tabindex="0" v-bind:class="{disabled: selectedQ.userId._id == currentUser.id || selectedQ.upvote.indexOf(currentUser.id) !== -1 || !currentUser.isLogin}"
              @click="upvote({ id:selectedQ._id, target: 'questions' })">
              <div class="ui orange tiny button">
                <i class="chevron up icon"></i> Upvote
              </div>
              <a class="ui basic label">
                {{ selectedQ.upvote.length }}
              </a>
            </div>
            <div class="ui left labeled button" tabindex="0" v-bind:class="{disabled: selectedQ.userId._id == currentUser.id || selectedQ.downvote.indexOf(currentUser.id) !== -1 || !currentUser.isLogin}"
              @click="downvote({ id:selectedQ._id, target: 'questions' })">
              <a class="ui basic right pointing label">
                {{ selectedQ.downvote.length }}
              </a>
              <div class="ui yellow tiny button">
                <i class="chevron down icon"></i> Downvote
              </div>
            </div>
          </div>
          <div class="ui six wide column">
            <div v-if="selectedQ.userId._id === currentUser.id">
              <button class="ui green right floated icon tiny right labeled button" @click="solvedQ" v-if="!selectedQ.solved"> <i class="ui check icon" ></i> Mark as solved </button>
              <button class="ui orange right floated icon tiny button" @click="modalEditQuestion(selectedQ.title, selectedQ.description)"><i class="ui pencil alternate icon"></i></button>
              <button class="ui yellow right floated icon tiny button" @click="removeQ"> <i class="ui trash alternate outline icon"></i> </button>
            </div>
              <h3 class="ui right floated" style="margin-right: 20px; margin-top:5px; color: orange;"> {{ selectedQ.answer.length }} answer</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="ui form segment" style="margin-top: 20px;" v-if="!selectedQ.solved && selectedQ.userId._id !== currentUser.id && currentUser.isLogin">
      <div class="field">
        <h3 style="color: brown;">Answer :</h3>
        <textarea placeholder="type your idea" rows="2" v-model="description"></textarea>
        <button class="ui fluid orange labeled submit icon button" style="margin-top: 15px; margin-bottom: 0px;" @click="submitAnswer"> <i class="icon edit"></i> Submit </button>
      </div>
    </div>
    <div style="margin-top:30px;"></div>
    <h3 class="ui dividing center aligned header" style="padding-left:10px; margin-bottom:20px; color: orange; margin-top:40px;" v-if="selectedQ.answer.length === 0"> <i class="ui comments outline icon"></i> There's no answer yet </h3>
    <h3 class="ui dividing center aligned header" style="padding-left:10px; margin-bottom:20px; color: orange; margin-top:60px;" v-else> <i class="ui comments outline icon"></i> All Answer </h3>
    <div>
    <div class="ui cards " v-for="(answer, index) in selectedQ.answer" :key="index">
      <div class="ui fluid card raised segment" v-bind:class="{orange: currentUser.id === answer.userId._id}">
        <div class="content">
          <div class="ui dividing header" style="color: brown ;"> {{ answer.userId.fname }} </div>
          <div class="floating ui orange large label"> {{ (answer.upvote.length - answer.downvote.length) * 10 }} </div>
          <div class="meta"> {{ new Date(answer.createdAt).getDate() }} - {{ new Date(answer.createdAt).getMonth()+1 }} - {{ new Date(answer.createdAt).getFullYear() }} </div>
          <div class="description">
            {{ answer.description }}
          </div>
        </div>
        <div class="extra content">
          <div v-if="currentUser.id === answer.userId._id">
            <button class="ui mini orange right floated labeled icon button" @click="modalEditAnswer(answer.description, answer._id)"> <i class="ui pencil alternate icon"></i> edit </button>
          </div>
          <div class="ui mini right floated buttons" v-if="currentUser.id !== answer.userId._id">
            <button class="ui orange button" @click="upvote({ target: 'answers', id: answer._id, on: selectedQ._id})" v-bind:class="{disabled: answer._id == currentUser.id || answer.upvote.indexOf(currentUser.id) !== -1 || !currentUser.isLogin}">best solution</button>
            <div class="or" data-text="or"></div>
            <button class="ui yellow button" @click="downvote({ target: 'answers', id: answer._id, on: selectedQ._id})" v-bind:class="{disabled: answer.userId._id == currentUser.id || answer.downvote.indexOf(currentUser.id) !== -1 || !currentUser.isLogin}">bad solution</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  <!-- modal -->
    <div class="ui modal small answerModal">
      <div class="header">
        <i class="ui pencil icon"></i>
        Updating your answer
      </div>
      <div class="content">
        <div class="ui description form">
          <label for=""><h3>Description :</h3> </label>
          <textarea style="margin-top:10px;" rows="3" placeholder="type you fix idea" v-model="modalEditAnswerVal"></textarea>
        </div>
      </div>
      <div class="actions">
        <div class="ui small yellow deny button">Cancel</div>
        <div class="ui small orange deny button" @click="editAnswer()">Renew my asnwer</div>
      </div>
    </div>

    <div class="ui modal small questionModal">
      <div class="header">
        <i class="ui pencil icon"></i>
        Updating your Question
      </div>
      <div class="content">
        <div class="ui description form">
          <label for=""><h3>Title :</h3> </label>
          <input type="text" style="margin-bottom: 10px;" v-model="titleUpdateVal">
          <label for=""><h3>Description :</h3> </label>
          <textarea style="margin-top:10px;" rows="3" placeholder="type you fix idea" v-model="descriptionUpdateVal"></textarea>
        </div>
      </div>
      <div class="actions">
        <div class="ui small yellow deny button">Cancel</div>
        <div class="ui small orange deny button" @click="editQuestion()">Renew my Question</div>
      </div>
    </div>

  </div>

</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import config from '../config'

export default {
  name: 'questionDetail',
  props: ['id'],
  data () {
    return {
      description: '',
      modalEditAnswerVal: '',
      selectedIdAnswer: '',
      titleUpdateVal: '',
      descriptionUpdateVal: ''
    }
  },
  created () {
    this.detailQ(this.id)
  },
  computed: {
    ...mapState(['selectedQ', 'currentUser'])
  },
  methods: {
    ...mapActions(['detailQ', 'upvote', 'downvote', 'removePost']),
    solvedQ () {
      console.log('masuk client')
      let self = this
      axios({
        url: `${config.host}/questions/solve/${this.id}`,
        method: 'put',
        headers: {
          authorization: localStorage.getItem('authorization')
        }
      })
        .then(response => {
          self.detailQ(self.id)
        })
        .catch(response => {
          console.log('failed when mark as solved')
        })
    },
    removeQ () {
      this.removePost(({ target: 'questions', id: this.id }))
      this.$router.push('/')
    },
    submitAnswer () {
      let self = this
      axios({
        url: `${config.host}/answers/${this.id}`,
        method: 'post',
        data: {
          description: this.description
        },
        headers: {
          authorization: localStorage.getItem('authorization')
        }
      })
        .then(response => {
          self.detailQ(self.id)
          self.description = ''
        })
        .catch(response => {
          console.log('failed when create answer')
        })
    },
    modalEditAnswer (description, idAnswer) {
      this.modalEditAnswerVal = description
      this.selectedIdAnswer = idAnswer
      $('.ui.modal.small.answerModal').modal('show')
    },
    modalEditQuestion (title, description) {
      this.titleUpdateVal = title
      this.descriptionUpdateVal = description
      $('.ui.modal.small.questionModal').modal('show')
    },
    editAnswer () {
      axios({
        url: `${config.host}/answers/${this.selectedIdAnswer}`,
        method: 'put',
        data: {
          description: this.modalEditAnswerVal
        },
        headers: {
          authorization: localStorage.getItem('authorization')
        }
      })
        .then(response => {
          this.detailQ(this.id)
        })
        .catch(response => {
          console.log('failed when updating your answer')
          console.log(response.response.data.message)
        })
    },
    editQuestion () {
      axios({
        url: `${config.host}/questions/${this.id}`,
        method: 'put',
        data: {
          title: this.titleUpdateVal,
          description: this.descriptionUpdateVal
        },
        headers: {
          authorization: localStorage.getItem('authorization')
        }
      })
        .then(response => {
          this.detailQ(this.id)
        })
        .catch(response => {
          console.log('failed when updating your answer')
          console.log(response.response.data.message)
        })
    }
  }
}
</script>

<style>

</style>
