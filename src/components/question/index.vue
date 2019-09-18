<template>
  <div class="question">
    <el-container>
      <el-header class="header">
        <div class="left">
          <canvas ref="title"></canvas>
        </div>
        <div class="right">
          <el-autocomplete placeholder="请输入你的问题"
                           suffix-icon="el-icon-search"
                           v-model="state"
                           :fetch-suggestions="querySearchAsync"
                           @select="handleSelect"
                           class="input">
          </el-autocomplete>
          <el-button type="success"
                     round
                     class="button"
                     @click="sendQuestion">提问</el-button>
          <div class="log-res"
               v-show="!token.length">
            <span class="question-login"
                  @click="login">登录</span>
            <el-divider direction="vertical"></el-divider>
            <span class="question-register"
                  @click="register">注册</span>
          </div>
          <el-tooltip effect="dark"
                      content="点击退出登录"
                      placement="bottom">
            <div class="log-res"
                 v-show="token.length"
                 @click="noLogin">
              <span class="text">已登录</span>
              <i class="el-icon-check"></i>
            </div>
          </el-tooltip>
        </div>
      </el-header>
      <div class="containerBox">
        <el-container class="container">
          <el-main class="container-mian">
            <el-tabs v-model="activeTag"
                     type="border-card"
                     @tab-click="changeTab">
              <el-tab-pane label="热门回答"
                           name="hot"></el-tab-pane>
              <el-tab-pane label="最新回答"
                           name="new"></el-tab-pane>
              <el-tab-pane label="等我回答"
                           name="wait"></el-tab-pane>
              <keep-alive>
                <router-view></router-view>
              </keep-alive>
            </el-tabs>
          </el-main>
          <el-aside width="280px"
                    class="container-aside">
            <div class="user">
              <div class="top">
                <el-avatar> user </el-avatar>
                <div class="right">
                  <span class="nickName">{{nickName?nickName:'游客'}}</span>
                  <span class="num">积分：2</span>
                </div>
              </div>
              <el-divider></el-divider>
              <div class="bottom">
                <div class="col">
                  <span class="col-num">{{count.ask_num?count.ask_num:0}}</span>
                  <span class="col-text">我提问的</span>
                </div>
                <div class="col">
                  <span class="col-num">{{count.follow_num?count.follow_num:0}}</span>
                  <span class="col-text">我关注的</span>
                </div>
                <div class="col">
                  <span class="col-num">{{count.reply_num?count.reply_num:0}}</span>
                  <span class="col-text">我回答的</span>
                </div>
              </div>
            </div>
            <div class="rank">
              <h3>回答排行榜</h3>
              <div class="rank-box">
                <div v-for="rank in rankList"
                     :key='rank.id'>
                  <div class="row">
                    <div class="userMsg">
                      <el-avatar :size="48"> user </el-avatar>
                      <div class="smallMsg">
                        <span class="top"
                              v-html="rank.nickName"></span>
                        <div class="bot">
                          <span>{{rank.reply_num}}个回答</span>
                          <span class="ml">{{rank.follow_num}}个支持</span>
                        </div>
                      </div>
                      <el-button round
                                 size="mini">+关注</el-button>
                    </div>

                  </div>
                  <el-divider></el-divider>
                </div>
              </div>
            </div>
          </el-aside>
        </el-container>
        <el-footer class="footer">
          <span>Copyright &copy; 2019 赣ICP备19011987号-1</span>
        </el-footer>
      </div>
    </el-container>
    <el-dialog title="提出问题"
               width="640px"
               :modal-append-to-body='false'
               :visible.sync="showDialog">
      <el-input v-model="title"
                placeholder="请一句话说明你的问题"
                class="dialog-title"></el-input>
      <el-input type="textarea"
                :rows="7"
                placeholder="问题补充"
                v-model="content">
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   round
                   @click="commitQuestion">提 问</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex"
import service from 'common/js/service'
export default {
  data () {
    return {
      activeTag: 'hot',
      count: [],
      nickName: '',
      rankList: [],
      showDialog: false,
      title: '',
      content: '',
      restaurants: [{
        "value": "请输入搜索内容",
        "key": 0
      }],
      state: '',
      timeout: null
    }
  },
  created () {
    // 确保dom渲染完成
    setTimeout(() => {
      this.drawText()
      this._getCount()
    }, 20)
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    // 搜索框
    async querySearchAsync (queryString, cb) {
      let restaurants = this.restaurants
      let results = queryString ? await this.getSearch(queryString) : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 700)
    },
    async getSearch (queryString) {
      let res = await service.post('/question/search', {
        title: queryString
      })
      res.forEach(element => {
        element.value = element.title
      })
      return res
    },
    handleSelect (item) {
      this.state = ''
      if (item.key == 0) {
        return
      }
      this.set_questionDetail(item)
      this.$router.push({
        path: `/detail/search`
      })
    },
    // 获取用户的提问、关注、回答数量
    async _getCount () {
      this.rankList = await service.get('/count/rank', {
      })
      if (this.token.length) {
        this.count = await service.get('/count', {
        }, this.token)
        const res = await service.get('/user/nickName', {
        }, this.token)
        this.nickName = res.nickName
        global.nickName = this.nickName
      }
    },
    // 切换路由
    changeTab () {
      this.$router.push({
        path: `${this.activeTag}`
      })
    },
    // 绘制logo
    drawText () {
      const canvas = this.$refs.title
      canvas.width = 300
      canvas.height = 60
      const context = canvas.getContext('2d')
      context.font = "22px Arial"
      const linearGrad = context.createLinearGradient(0, 0, 300, 60)
      linearGrad.addColorStop(0, '#F1CA74')
      linearGrad.addColorStop(1.0, '#A64DB6')
      context.fillStyle = linearGrad
      context.fillText('wiselee.cn 让知识连接你和我', 0, 40)
    },
    // 退出登录
    noLogin () {
      this.clearToken()
      this.$notify({
        title: '退出成功',
        message: '已经成功清除你的数据',
        duration: 1500,
        type: 'success'
      })
    },
    // 登录框
    login () {
      this.set_isLogin(true)
      this.set_loginFull(true)
    },
    // 注册框
    register () {
      this.set_isLogin(false)
      this.set_loginFull(true)
    },
    // 提问
    sendQuestion () {
      this.showDialog = true
    },
    async commitQuestion () {
      const res = await service.post('/question/create', {
        title: this.title,
        content: this.content,
        tag: 'html5,vue,css3'
      }, this.token)
      if (res.status === 400) {
        this.$notify({
          title: '提交错误',
          message: res.data.msg,
          duration: 1500,
          type: 'error'
        })
        return
      }
      if (res.status === 403) {
        this.clearToken()
        this.showDialog = false
        this.$notify({
          title: '提交失败',
          message: '请登录后提交你的问题',
          duration: 1500,
          type: 'error'
        })
        return
      }
      this.$notify({
        title: '提交成功',
        message: '你的问题提交成功',
        duration: 1500,
        type: 'success'
      })
      this.showDialog = false
    },
    ...mapMutations({
      'set_isLogin': 'SET_ISLOGIN',
      'set_loginFull': 'SET_LOGINFULL',
      'set_questionDetail': 'SET_QUESTIONDETAIL'
    }),
    ...mapActions(['clearToken'])
  },
  watch: {
    async token (newValue) {
      if (newValue.length) {
        this.count = await service.get('/count', {
        }, this.token)
        const res = await service.get('/user/nickName', {
        }, this.token)
        this.nickName = res.nickName
        global.nickName = this.nickName
      } else {
        this.count = []
        this.nickName = ''
        global.nickName = ''
      }
    }
  },
}
</script>

<style lang="stylus">
@import '~common/stylus/variable'
.question
  .dialog-title
    margin-bottom 20px
  .header
    width 100%
    min-width 1088px
    box-shadow 0 8px 16px 0 rgba(28, 31, 33, 0.1)
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    .right
      color $text-grey
      font-size $font-size-small-s
      .input
        width 480px
        border-radius 8px
        .el-input__inner
          height 36px
          font-size 14px
          color $text-grey
          box-shadow 2px 0 5px 0 #fff
          background $input-backgroundColor
          border 0
          border-radius inherit
      .button
        margin-left 56px
        margin-right 30px
        color $backgroundColor
        border-color $btn-backgroundColor
        background $btn-backgroundColor
        opacity 1
      .log-res
        display inline-block
        cursor pointer
        .text
          color $success
          padding-right 10px
        .el-icon-check
          color $success
        .question-login:hover, .question-register:hover
          cursor pointer
          color $theme
  .containerBox
    .container
      width 1088px
      margin 0 auto
      margin-top 24px
    .container-aside
      margin-top 20px
      min-height 600px
      .user
        background rgba(56, 61, 66, 0.06)
        border-radius 8px
        padding 24px 23px
        margin-bottom 24px
        height 135px
        .top
          display flex
          flex-direction row
          .right
            display flex
            flex-direction column
            padding-left 20px
            .nickName
              color $text-title
              font-size $font-size-small
              font-weight 700
            .nickName:hover
              color $success
              cursor pointer
            .num
              font-size $font-size-tip
              color $text-grey
              line-height 24px
            .num:hover
              cursor pointer
        .bottom
          display flex
          flex-direction row
          justify-content space-around
          .col
            display flex
            flex-direction column
            justify-content center
            align-items center
            color $text-num
            .col-num
              font-size $font-size-small
              line-height 24px
            .col-text
              font-size $font-size-tip
          .col:hover
            cursor pointer
            color $success
      .rank
        overflow hidden
        margin-left 15px
        h3
          display block
        .rank-box
          .row
            width 100%
            height 48px
            margin-bottom 16px
            .userMsg
              display flex
              flex-direction row
              .el-button
                margin-left 35px
                height 30px
                line-height 12px
              .smallMsg
                display flex
                flex-direction column
                justify-content space-between
                margin-left 15px
                .top
                  max-width 135px
                  font-weight 700
                  font-size 14px
                  color #383d42
                  line-height 24px
                  margin-bottom 2px
                  overflow hidden
                  text-overflow ellipsis
                  white-space nowrap
                .bot
                  font-size 12px
                  color #9199a1
                  line-height 18px
                  .ml
                    margin-left 15px
              .top:hover, .bot:hover, .el-avatar:hover
                cursor pointer
    .footer
      display flex
      flex-direction row
      justify-content center
      align-items center
      font-size $font-size-tip
      color $text-num
</style>