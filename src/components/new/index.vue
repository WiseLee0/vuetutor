<template>
  <div class="new">
    <list :questionList="list"
          @chooseItem="chooseItem"
          @refresh="getNewData"></list>
    <router-view></router-view>
  </div>
</template>

<script>
import List from 'base/list/index'
import service from 'common/js/service'

export default {
  data () {
    return {
      page_num: 1,
      list: []
    }
  },
  created () {
    this._getList()
  },
  methods: {
    async _getList () {
      const res = await service.get(`/question/${this.page_num}`, {
        type: 'new'
      })
      if (res.code === 0) {
        if (!res.data.length) {
          return
        }
        this.list = res.data
      }
    },
    getNewData (index) {
      this.page_num = index
      this._getList()
    },
    chooseItem (index) {
      this.$router.push({
        path: `/detail/${index}`
      })
    }
  },
  components: {
    List
  },
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.new
  background #fff
  padding 28px 32px
  box-shadow 0 4px 8px 0 rgba(28, 31, 33, 0.1)
  border-radius 12px
  .boxContainer
    width 100%
    .boxGroup
      display flex
      flex-direction row
      .boxCol
        display flex
        flex-direction column
        align-items center
      .left
        color $text-grey
        font-size $font-size-small
        padding-right 20px
        font-weight bold
        min-width 50px
        .text
          font-size $font-size-small-s
          font-weight normal
          cursor pointer
        .num
          cursor pointer
      .right
        align-items flex-start
        width 100%
        overflow hidden
        .title
          font-size $font-size-small
          width 100%
          color #07111b
          line-height 24px
          display block
          margin-bottom 4px
          font-weight 700
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        .title:hover
          cursor pointer
          color $theme
        .tags
          display flex
          flex-direction row
          width 100%
          color $text-grey
          line-height 16px
          font-size $font-size-tip
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          .tag:hover
            cursor pointer
            color $theme
</style>