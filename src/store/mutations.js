import * as types from './mutation-type'
const mutations = {
  [types.SET_LOGINFULL] (state, flag) {
    state.loginFull = flag
  },
  [types.SET_ISLOGIN] (state, flag) {
    state.isLogin = flag
  },
  [types.SET_TOKEN] (state, token) {
    state.token = token
  },
  [types.SET_QUESTIONDETAIL] (state, detail) {
    detail.look_num++
    state.questionDetail = detail
  }
}
export default mutations