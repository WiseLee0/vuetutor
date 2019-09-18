<template>
  <div class="detail"
       ref="detail"
       @click.stop>
    <div class="detailContent"
         ref="detailContent">
      <div>
        <el-tooltip class="item"
                    effect="dark"
                    content="返回列表"
                    placement="right">
          <el-button type="success"
                     icon="el-icon-d-arrow-left"
                     circle
                     class="back"
                     @click="goBack"></el-button>
        </el-tooltip>
        <el-container class="detail-container">
          <el-main class="detail-main">
            <div class="ques-header">
              <h1 v-html="questionDetail.title"></h1>
              <div class="user-tip">
                <div class="left">
                  <el-tag v-for="item in questionDetail.tag"
                          :key="item.id">
                    {{item}}
                  </el-tag>
                </div>
                <div class="right">
                  <span class="name"
                        v-html="nickName"></span>
                  <span>{{format(questionDetail.created_at)}}</span>
                </div>
              </div>
              <div class="article">
                <div class="content"
                     ref="content">
                  <p ref="contentDetail">
                    {{questionDetail.content}}
                  </p>
                </div>
                <div class="hide-article-box"
                     v-show="!showFlag"
                     @click="showAll">
                  查看完整描述
                </div>
              </div>
            </div>
            <div class="ques-list"
                 v-show="!lists.length">
              <div class="unData">
                <i class="el-icon-warning"></i>
                <p class="text">目前暂无任何回答</p>
              </div>
            </div>
            <div class="ques-list"
                 v-show="lists.length">
              <h2 class="answer-number">{{lists.length}} 回答</h2>
              <div class="list-box">
                <div class="answer-list"
                     v-for="(list,index) in lists"
                     :key="list.id">
                  <el-avatar> user </el-avatar>
                  <div class="answer-box">
                    <div class="answer-content">
                      <span class="answer-title"
                            v-html="list.nickName?list.nickName:'神秘用户'"></span>
                      <div class="answer-desc"
                           v-html="list.content"></div>
                    </div>
                    <div class="answer-bar">
                      <el-button icon="el-icon-thumb"
                                 round
                                 size="small"
                                 @click="likeIt(list,index)"
                                 :class="{myLike:currentIndex === index}">
                        <span>{{list.like_num}}</span>
                      </el-button>
                      <span class="reply-del">回复</span>
                      <span class="reply-del">举报</span>
                      <span class="time-r">{{format(list.created_at)}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-main>
          <el-aside width="280px"
                    class="detail-aside">
            <div class="number">
              <div class="col">
                <span class="top">{{questionDetail.answer_num}}</span>
                <span class="bot">回答</span>
              </div>
              <div class="col">
                <span class="top">{{questionDetail.follow_num}}</span>
                <span class="bot">关注</span>
              </div>
              <div class="col">
                <span class="top">{{questionDetail.look_num}}</span>
                <span class="bot">浏览</span>
              </div>
            </div>
            <el-button type="success"
                       round
                       class="btn-top"
                       @click="myAnswer">我要回答</el-button>
            <el-button class="btn-bot"
                       round>关注</el-button>
          </el-aside>
        </el-container>
      </div>
    </div>
    <el-dialog title="添加回答"
               width="640px"
               :modal-append-to-body='false'
               :visible.sync="showDialog">
      <el-input type="textarea"
                :rows="7"
                placeholder="请输入内容"
                v-model="textarea"
                maxlength="200"
                show-word-limit>
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   round
                   @click="commitAnswer">回 答</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import { mapGetters, mapActions } from 'vuex'
import service from 'common/js/service'

BScroll.use(MouseWheel)
export default {
  data () {
    return {
      showFlag: false,
      bscroll: null,
      nickName: '神秘用户',
      showDialog: false,
      textarea: '',
      currentIndex: -1,
      lists: []
    }
  },
  mounted () {
    this._isShowAll()
    this._initSrcoll()
    this._handleData()
  },
  computed: {
    ...mapGetters(['questionDetail', 'token'])
  },
  methods: {
    // 初始化请求数据
    async _handleData () {
      const res = await service.post('/question/nickName', {
        uid: this.questionDetail.uid
      })
      await service.put('/question/look', {
        id: this.questionDetail.id
      })
      const sult = await service.get('/answer', {
        question_id: this.questionDetail.id
      })
      if (sult.code === 0) {
        this.lists = sult.data
        setTimeout(() => {
          this.bscroll.refresh()
        }, 20)
      }
      if (res.nickName) {
        this.nickName = res.nickName
      }
      else {
        this.$router.push({
          path: '/hot'
        })
      }
    },
    // 标准时间转换
    format (time) {
      let utf = new Date(time)
      const year = utf.getFullYear()
      const month = utf.getMonth() + 1
      const date = utf.getDate()
      const hour = utf.getHours()
      const minute = utf.getMinutes()
      const second = utf.getSeconds()
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`
    },
    // 是否查看完整信息
    _isShowAll () {
      if (this.$refs.contentDetail.clientHeight > 40) {
        this.showFlag = false
      } else {
        this.showFlag = true
      }
    },
    // 展示全部，刷新滚轮
    showAll () {
      const height = this.$refs.contentDetail.clientHeight + 40
      this.$refs.content.style.height = height + 'px'
      this.showFlag = true
      this.bscroll.refresh()
    },
    // 初始化滚轮
    _initSrcoll () {
      this.bscroll = new BScroll(this.$refs.detailContent, {
        scrollX: false,
        scrollY: true,
        probeType: 2,
        startY: 0,
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        }
      })
    },
    // 返回
    goBack () {
      this.$router.back()
    },
    // 我要回答
    myAnswer () {
      this.showDialog = true
    },
    // 提交回答
    async commitAnswer () {
      if (this.textarea.length < 6) {
        this.$notify({
          title: '回复内容太短',
          message: '请认真回复对方',
          duration: 1500,
          type: 'error'
        })
        return
      }
      const res = await service.post('/answer/create', {
        question_id: this.questionDetail.id,
        content: this.textarea,
        nickName: global.nickName
      }, this.token)
      if (res.code === 0) {
        this.$notify({
          title: '回复成功',
          message: '对方已收到你的回复',
          duration: 1500,
          type: 'success'
        })
        this.showDialog = false
        this.lists.push({
          question_id: this.questionDetail.id,
          content: this.textarea,
          nickName: global.nickName,
          like_num: 0,
          created_at: new Date()
        })
        setTimeout(() => {
          this.bscroll.refresh()
        }, 20);
      }
      if (res.status === 403) {
        this.$notify({
          title: '未登录',
          message: '游客身份无法回复',
          duration: 1500,
          type: 'error'
        })
        this.clearToken()
        return
      }
    },
    // 点赞，还待处理
    async likeIt (item, index) {
      this.currentIndex = index
      const res = await service.put('/answer/like', {
        answer_id: item.id
      }, this.token)
      if (res.status === 400) {
        this.$notify({
          title: '点赞失败',
          message: '你已经点赞过了',
          duration: 1500,
          type: 'error'
        })
        return
      }
      this.$notify({
        title: '点赞成功',
        message: '对方已收到你的赞赏',
        duration: 1500,
        type: 'success'
      })
      item.like_num++
    },
    ...mapActions(['clearToken'])
  },
  watch: {
    async questionDetail () {
      const sult = await service.get('/answer', {
        question_id: this.questionDetail.id
      })
      if (sult.code === 0) {
        this.lists = sult.data
        setTimeout(() => {
          this.showFlag = false
          this.bscroll.refresh()
        }, 20)
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.detail
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 99
  background-color $backgroundColor
  .detailContent
    height 100%
    overflow hidden
    .back
      position relative
      top 20px
      left 40px
    .detail-container
      width 1088px
      margin 20px auto
      .detail-main
        width 776px
        .ques-header
          box-shadow 0 4px 8px 0 rgba(7, 17, 27, 0.5)
          border-radius 12px
          padding 28px 32px
          h1
            font-size $font-size-medium-x
            color $text-title
            font-weight 700
            margin-top 6px
            line-height 32px
            word-break break-all
            word-wrap break-word
          .user-tip
            margin-top 12px
            overflow hidden
            display flex
            flex-direction row
            justify-content space-between
            .left
              overflow hidden
              .el-tag
                margin-right 10px
              .el-tag:hover
                cursor pointer
                background-color $input-backgroundColor
            .right
              font-size 12px
              color $text-grey
              line-height 32px
              text-align center
              .name
                margin-right 10px
          .article
            position relative
            margin-top 16px
            .content
              font-size 16px
              color #545c63
              line-height 36Px
              height 150px
              overflow hidden
              word-break break-all
              word-wrap break-word
            .hide-article-box
              text-align center
              font-size 16px
              color $success
              line-height 24px
              position absolute
              bottom 0
              width 100%
              padding-top 72px
              z-index 99
              background-image linear-gradient(-180deg, rgba(255, 255, 255, 0) 0, #fff 70%)
            .hide-article-box:hover
              cursor pointer
        .ques-list
          margin-top 24px
          .unData
            width 100%
            margin 0 auto
            text-align center
            padding 72px 0 0 0
            .el-icon-warning
              font-size 48px
              color #b2b8bd
            .text
              font-size $font-size-small
              color $text-grey
              line-height 24px
              margin-top 4px
          .answer-number
            display block
            font-size $font-size-small
            color #07111b
            line-height 24px
            font-weight 700
          .list-box
            position relative
            padding 28px 32px
            margin-top 16px
            background #fff
            box-shadow 0 4px 8px 0 rgba(28, 31, 33, 0.1)
            border-radius 12px
            .answer-list
              margin-top 32px
              padding-bottom 32px
              border-bottom 1px solid rgba(56, 61, 66, 0.1)
              overflow hidden
              .el-avatar
                display inline-block
              .answer-box
                width 654px
                word-wrap break-word
                word-break break-all
                float right
                .answer-content
                  width 100%
                  position relative
                  overflow hidden
                  .answer-title
                    font-size $font-size-small-s
                    color #07111b
                    line-height 24px
                    margin-bottom 8px
                    font-weight 700
                  .answer-desc
                    font-size $font-size-small
                    color $text-title
                    line-height 28px
                    overflow hidden
                .answer-bar
                  margin-top 16px
                  font-size $font-size-tip
                  color #9199a1
                  line-height 36px
                  .myLike
                    background-color $btn-backgroundColor
                    color #fff
                  .reply-del
                    color #9199a1
                    margin-left 24px
                  .reply-del:hover
                    cursor pointer
                    color $text-title
                  .time-r
                    float right
      .detail-aside
        padding 24px
        background $input-backgroundColor
        border-radius 8px
        height 280px
        margin-top 20px
        .number
          display flex
          flex-direction row
          justify-content space-around
          width 100%
          .col
            display flex
            flex-direction column
            justify-content center
            align-items center
            .top
              font-size $font-size-small
              font-weight 700
              line-height 16px
              margin-bottom 4px
            .bot
              font-size 12px
              font-weight 200
              color $text-grey
        .btn-top
          width 100%
          margin-top 20px
        .btn-bot
          width 100%
          margin 20px 0
          color $text-grey
          background-color rgba(84, 92, 99, 0.1)
        .btn-bot:hover
          background-color rgba(84, 92, 99, 0.15)
</style>