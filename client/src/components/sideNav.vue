<template>
  <div class="ui vertical fluid menu">
    <a class="orange active aligned center item" style="font-size:15px;" @click="allList">
        <h3>All Question</h3>
    </a>
    <a class="orange item" style="font-size:15px; color: orange; font-weight: bold;" v-for="(question, index) in allDataFix" :key="index" @click="redirect(question._id)">
        {{ question.title }}
        <div class="ui yellow left label" v-bind:class="{ green: question.solved }">{{ question.answer.length }}</div>
    </a>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'sidenav',
  computed: {
    ...mapState(['selectedQ', 'allDataFix'])
  },
  methods: {
    ...mapActions(['loadData', 'detailQ']),
    redirect (id) {
      this.detailQ(id)
      this.$router.push(`/question/${id}`)
    },
    allList () {
      this.$router.push(`/`)
    }
  }
}
</script>

<style>

</style>
