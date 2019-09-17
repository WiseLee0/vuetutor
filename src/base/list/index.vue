<template>
  <div class="list"
       v-loading="!questionList.length">
    <div class="boxContainer">
      <div v-for="(item,index) in questionList"
           :key="item.id">
        <el-divider></el-divider>
        <div class="boxGroup"
             @mouseover.stop="isShow(item.solve,index)">
          <div class="boxCol left"
               v-show="!item.solve"
               @click="detail(item,index)">
            <span class="num">{{item.answer_num}}</span>
            <span class="text">回答</span>
          </div>
          <div class="boxCol left"
               v-show="item.solve"
               :class="{bgc:item.solve}"
               @click="detail(item,index)">
            <i class="el-icon-check"></i>
            <span class="text">{{item.answer_num}}</span>
          </div>
          <div class="boxCol left"
               @click="detail(item,index)">
            <span class="num">{{item.look_num}}</span>
            <span class="text">浏览</span>
          </div>
          <div class="boxCol right">
            <span class="title"
                  @click="detail(item,index)">{{item.title}}</span>
            <div class="tags">
              <div>
                <span v-for="tag in item.tag"
                      :key="tag.id"
                      class="tag">
                  {{tag}}
                  <el-divider direction="vertical"
                              class="vertical"></el-divider>
                </span>
              </div>
              <div v-show="currentIndex === index">
                <span class="tag-right">我来回答</span>
                <span class="tag-right-text">可获得2积分</span>
              </div>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    questionList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      currentIndex: -1,
      look_num: 0
    }
  },
  methods: {
    isShow (solve, index) {
      if (!solve) this.currentIndex = index
      else this.currentIndex = -1
    },
    detail (item, index) {
      this.set_questionDetail(item)
      console.log(item)
      this.$emit('chooseItem', index)
    },
    ...mapMutations({
      "set_questionDetail": "SET_QUESTIONDETAIL"
    })
  },
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.list
  background #fff
  .boxContainer
    width 100%
    .el-divider
      margin 0
    .boxGroup
      display flex
      flex-direction row
      padding 25px 0
      .boxCol
        display flex
        flex-direction column
        align-items center
        justify-content center
      .bgc
        color $success
        background-color rgba(0, 255, 0, 0.1)
      .left
        color $text-grey
        font-size $font-size-small
        margin-right 20px
        min-width 50px
        .text
          font-size $font-size-small-s
          font-weight normal
        .num
          font-weight bold
        .el-icon-check
          font-size $font-size-small
          font-weight bold
          color $success
      .left:hover
        cursor pointer
        color $success
      .right
        align-items flex-start
        width 100%
        overflow hidden
        .title
          font-size $font-size-small
          width 100%
          color $text-title
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
          justify-content space-between
          width 100%
          color $text-grey
          line-height 16px
          font-size $font-size-tip
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          .vertical
            margin 0 15px
          .tag-right
            cursor pointer
            color $success
            padding-right 10px
          .tag-right-text
            color $text-grey
            font-size $font-size-tip
          .tag:hover, .tag-right:hover
            cursor pointer
            color $theme
</style>