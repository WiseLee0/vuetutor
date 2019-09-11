<template>
  <div class="login">
    <el-container>
      <el-header height="74px">
        <div class="title">
          <span class="item"
                :class="isLogin?'choose':''"
                @click="loginMode">登录</span>
          <span class="item"
                :class="!isLogin?'choose':''"
                @click="registerMode">注册</span>
        </div>
        <i class="el-icon-close"></i>
      </el-header>
      <!-- 登录界面 -->
      <el-main v-show="isLogin">
        <div class="content">
          <el-input :placeholder="accountMode ? '请输入手机号/账号' : '短信用户仅限大陆地区'"
                    v-model="account">
          </el-input>
          <p class="tip"
             v-show="this.account.length">{{verifyLoginAccount}}</p>
        </div>
        <div class="content">
          <el-input :placeholder="accountMode ? '请输入密码' : '请输入短信验证码'"
                    v-model="password1"
                    :show-password="accountMode"
                    @click.native="getCode">
            <template slot="append"
                      v-if="!accountMode  && timeCode == 60">获取验证码</template>
            <template slot="append"
                      v-if="!accountMode && timeCode != 60">{{timeCode}}s</template>
          </el-input>
          <p class="tip"
             v-show="this.password1.length">{{verifyLoginPassword1}}</p>
        </div>
        <div class="content-tip">
          <el-switch v-model="autoLogin">
          </el-switch>
          <span class="label"
                :style="{color:autoLogin?'#409eff':''}">
            七天自动登录
          </span>
        </div>
        <el-button round
                   @click="login">登录</el-button>
      </el-main>
      <!-- 注册界面 -->
      <el-main v-show="!isLogin">
        <div class="content">
          <el-input :placeholder="accountMode ? '请输入注册账号' : '请输入手机号码'"
                    v-model="account">
          </el-input>
          <p class="tip"
             v-show="this.account.length">{{verifyRegAccount}}</p>
        </div>
        <div class="content">
          <el-input :placeholder="accountMode ? '请输入密码' : '请输入短信验证码'"
                    v-model="password1"
                    :show-password="accountMode"
                    @click.native="getCode">
            <template slot="append"
                      v-if="!accountMode && timeCode == 60">获取验证码</template>
            <template slot="append"
                      v-if="!accountMode && timeCode != 60">{{timeCode}}s</template>
          </el-input>
          <p class="tip"
             v-show="this.password1.length">{{verifyRegPassword1}}</p>
        </div>
        <div class="content">
          <el-input :placeholder="accountMode ? '请再次确认密码' : '请输入密码'"
                    v-model="password2"
                    show-password>
          </el-input>
          <p class="tip"
             v-show="this.password2.length">{{verifyRegPassword2}}</p>
        </div>
        <div class="content-tip">
          <el-switch v-model="autoLogin">
          </el-switch>
          <span class="label"
                :style="{color:autoLogin?'#409eff':''}">
            保存密码
          </span>
        </div>
        <el-button round
                   @click="register">注册</el-button>
      </el-main>
      <el-footer>
        <span @click="changeLoginType"
              v-show="isLogin">{{accountMode?'手机短信登录':'账号密码登录'}}</span>
        <span @click="changeLoginType"
              v-show="!isLogin">{{accountMode?'手机短信注册':'账号密码注册'}}</span>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import service from 'common/js/service'
export default {
  data () {
    return {
      account: '',
      password1: '',
      password2: '',
      timeCode: 60,
      clearFlag: null,
      isLogin: true,
      autoLogin: false,
      accountMode: false
    }
  },
  computed: {
    verifyLoginAccount () {
      if (this.accountMode) {
        if (this.account.length < 4) return '账号长度不符合规范'
      } else {
        if (this.account.length !== 11) return '手机号不符合规范'
      }
      return ''
    },
    verifyLoginPassword1 () {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/
      if (this.accountMode) {
        if (!reg.test(this.password1)) return '密码错误'
        if (this.password1.length < 6) return '密码错误'
      } else {
        if (this.password1.length !== 6) return '验证码位数不对'
      }
      return ''
    },
    verifyRegAccount () {
      if (this.accountMode) {
        if (this.account.length < 4) return '账号长度不符合规范'
      } else {
        if (this.account.length !== 11) return '手机号不符合规范'
      }
      return ''
    },
    verifyRegPassword1 () {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/
      if (this.accountMode) {
        if (!reg.test(this.password1)) return '密码需要字符+数字'
        if (this.password1.length < 6) return '密码长度不够'
      } else {
        if (this.password1.length !== 6) return '验证码位数不对'
      }
      return ''
    },
    verifyRegPassword2 () {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/
      if (this.accountMode) {
        if (this.password1 !== this.password2) return '两次密码不相等'
      } else {
        if (!reg.test(this.password2)) return '密码需要字符+数字'
        if (this.password2.length < 6) return '密码长度不够'
      }
      return ''
    }
  },
  methods: {
    // 清除填入数据
    clearInput () {
      this.account = ''
      this.password1 = ''
      this.password2 = ''
    },
    // 账号模式 手机模式 切换
    changeLoginType () {
      this.accountMode = !this.accountMode
      this.clearInput()
    },
    // 注册 登录 tab栏切换
    loginMode () {
      this.isLogin = true
      this.clearInput()
    },
    registerMode () {
      this.isLogin = false
      this.clearInput()
    },
    // 注册
    async register () {
      // 账号 + 密码
      if (this.accountMode) {
        let res = await service.post('/user/registerB', {
          account: this.account,
          password1: this.password1,
          password2: this.password2
        })
        if (res.code === 0) {
          console.log('ok')
        }
      } else {
        // 手机 + 验证码
        let res = await service.post('/user/registerA', {
          phone: this.account,
          code: this.password1,
          password: this.password2
        })
        if (res.code === 0) {
          console.log('ok')
        }
      }
    },
    // 登录
    async login () {
      if (this.accountMode) {
        let res = await service.post('/token', {
          account: this.account,
          password: this.password1,
          type: 101
        })
        console.log(res)
      } else {
        let res = await service.post('/token', {
          account: this.account,
          code: this.password1,
          type: 102
        })
        console.log(res)
      }
    },
    // 动态倒计时
    countTimeCode () {
      this.clearFlag = setInterval(() => {
        // 倒计时结束后，重制标志位
        if (this.timeCode == 0) {
          this.timeCode = 60
          clearInterval(this.clearFlag)
          return
        }
        // 秒数每次减1
        this.timeCode--
      }, 1000)// 1s调用1次
    },
    // 获取验证码
    async getCode (e) {
      if (e.target.innerHTML == '获取验证码') {
        if (this.account.length !== 11) return
        let res = await service.post('/user/verifyPhone', {
          phone: this.account
        })
        if (res.code === 0) {
          // 动态倒计时
          this.countTimeCode()
        }
      }
    }
  },
  // 组件销毁时清除定时器
  beforeDestroy () {
    clearInterval(this.clearFlag)
  }
}
</script>
<style lang="stylus">
@import '~common/stylus/variable'
.el-container
  position fixed
  background $backgroundColor
  z-index 999
  width 384px
  padding-top 10px
  padding-bottom 30px
  left 50%
  top 50%
  margin -192px 0 0 -192px
  box-shadow 0 12px 24px 0 rgba(28, 31, 33, 0.1)
  border-radius 12px
  .el-header
    position relative
    padding 0 20px 25px
    height 74px
    .title
      font-size $font-size-small
      line-height 49px
      font-weight 700
      height 49px
      color $text-grey
      .item
        float left
        width 80px
        text-align center
        height 49px
        line-height 49px
        cursor pointer
      .choose
        color $theme
      .choose:after
        content ' '
        width 16px
        height 4px
        line-height 4px
        background $theme
        border-radius 2px
        display block
        margin 0 auto
      .item:hover
        color $theme
      .item:hover:after
        content ' '
        width 16px
        height 4px
        line-height 4px
        background $theme
        border-radius 2px
        display block
        margin 0 auto
    .el-icon-close
      position absolute
      top 17px
      right 20px
      font-size $font-size-small
      font-weight 700
      color $text-grey
      cursor pointer
  .el-main
    padding 0 32px
    .tip
      height 20px
      line-height 20px
      margin 0
      color $theme
      font-size $font-size-tip
    .content
      height 68px
      .el-input__inner
        width 100%
        height 48px
        line-height 20px
        box-sizing border-box
        padding 14px
        box-shadow 2px 0 5px 0 #fff
        background rgba(28, 31, 33, 0.06)
        border 0
      .el-input-group__append
        color #1481b8
        cursor pointer
        background-color rgba(28, 31, 33, 0.06)
        border 0
      .el-input__clear
        font-size $font-size-medium-x
    .content-tip
      width 100%
      display flex
      flex-direction row
      align-items center
    .label
      color $text-grey
      font-size $font-size-small-s
      margin-left 10px
    .el-button
      width 100%
      box-sizing border-box
      margin-top 20px
      background-color $theme
      color $backgroundColor
  .el-footer
    padding 20px 30px 4px
    font-size $font-size-small-s
    color $theme
    cursor pointer
</style>