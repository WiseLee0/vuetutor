import *as types from './mutation-type'
import { deleteToken } from 'common/js/cache'

// 令牌过期
export const clearToken = function ({ commit }) {
  deleteToken()
  commit(types.SET_LOGINFULL, true)
  commit(types.SET_ISLOGIN, true)
  commit(types.SET_TOKEN, '')
}

