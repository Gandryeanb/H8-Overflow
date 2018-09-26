<template>
<div>
    <div v-for="(question, index) in allData" :key="index">
        <div class="ui fluid card" v-bind:class="{ orange : question.userId._id == currentUser.id, raised: question.userId._id == currentUser.id,  segment: question.userId._id == currentUser.id}" style="margin-bottom: 20px;">
            <div class="content">
                <div class="ui grid">
                    <div class="ui three wide column">
                        <div class="ui grid">
                            <div class="ui thirteen wide column">
                            <h2 style="color: brown;">{{ question.title }}</h2>
                            </div>
                            <div class="ui three wide column">
                            </div>
                        </div>
                    </div>
                    <div class="ui thirteen wide column">
                        <a class="ui green large right ribbon label" v-if="question.solved">Solved</a>
                        <a class="ui yellow large right ribbon label" v-else>Unsolved</a>
                    </div>
                </div>
            </div>
            <div class="content">
            <h4 class="ui meta" style="color: orange;">
                <i class="user icon"></i>
                {{ question.userId.fname }}
                </h4>
            <div class="ui large feed">
                <div class="content">
                    <div class="summary">
                    {{ question.description }}
                    </div>
                </div>
            </div>
            </div>
                <div class="extra content">
            <div class="ui grid">
            <div class="ui ten wide column">
                <div class="ui labeled button" tabindex="0" v-bind:class="{disabled: question.userId._id == currentUser.id || question.upvote.indexOf(currentUser.id) !== -1 || !currentUser.isLogin }" @click="upvote({ id: question._id, target: 'questions' })">
                    <div class="ui orange tiny button">
                        <i class="chevron up icon"></i> Upvote
                        </div>
                        <a class="ui basic label">
                        {{ question.upvote.length }}
                        </a>
                    </div>
                    <div class="ui left labeled button" tabindex="0" v-bind:class="{disabled: question.userId._id == currentUser.id || question.downvote.indexOf(currentUser.id) !== -1 || !currentUser.isLogin }" @click="downvote({ id: question._id, target: 'questions' })">
                        <a class="ui basic right pointing label">
                        {{ question.downvote.length }}
                        </a>
                        <div class="ui yellow tiny button">
                        <i class="chevron down icon"></i> Downvote
                        </div>
                    </div>
                </div>
                <div class="ui six wide column">
                    <button class="ui right floated orange tiny button" style="margin-top:5px;" @click="redirectToDetailQ(question._id)">read more</button>
                    <div>
                        <h3 class="ui right floated" style="margin-right: 20px; margin-top:8px; color: orange;"> {{ question.answer.length }} answer</h3>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
import questionDetail from './questionDetail.vue'

export default {
  name: 'listQuestion',
  computed: {
    ...mapState(['allData', 'currentUser'])
  },
  methods: {
    ...mapActions(['upvote', 'downvote', 'removePost']),
    redirectToDetailQ (id) {
      this.$router.push(`/question/${id}`, { component: questionDetail })
    }
  }
}
</script>

<style>

</style>
