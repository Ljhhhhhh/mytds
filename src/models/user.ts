import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, fetchUser, query as queryUsers } from '@/services/user';

export interface CurrentUser {
  avatar?: string;
  username?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  userList?: any[];
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    fetchUser: Effect;
    logout: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    setUserList: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    userList: []
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data  // response,
      });
    },
    *logout(_, { put }) {
      yield put({
        type: 'saveCurrentUser',
        payload: {}  // response,
      });
    },
    *fetchUser({}, { call, put }) {
      const response = yield call(fetchUser);
      yield put({
        type: 'setUserList',
        payload: response.data
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      const user = action.payload.username ? action.payload : {}
      return {
        ...state,
        currentUser: user,
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    setUserList(state, action) {
      return {
        ...state,
        userList: action.payload
      }
    }
  },
};

export default UserModel;
