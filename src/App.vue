<template>
  <div class="app">
    <question></question>
    <login></login>
  </div>
</template>

<script>
import Login from 'components/login/index'
import Question from 'components/question/index'
import { mapGetters, mapActions } from 'vuex'
import service from 'common/js/service'
export default {
  computed: {
    ...mapGetters(['token'])
  },
  created () {
    this.verifyToken()
  },
  methods: {
    async verifyToken () {
      if (this.token.length) {
        const result = await service.post('/token/verify', {
          token: this.token
        })
        // 令牌过期，重新登录
        if (!result.is_valid) {
          this.clearToken()
        }
      }
    },
    ...mapActions(['clearToken'])
  },
  components: {
    Login,
    Question
  },
}
</script>
<style lang="stylus"></style>