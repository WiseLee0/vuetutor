import { getToken } from 'common/js/cache'
const state = {
  loginFull: false, // 显示登录注册界面
  isLogin: true, // 登录界面
  token: getToken(), // 获取token
  questionDetail: [] // 问题详情
}
export default state