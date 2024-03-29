import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
// import { routerRedux } from 'dva/router';
import { userLogin } from '@/services/user';
import { getPageQuery, setAuthority } from '@/utils/utils';
import { message } from 'antd';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    // getCaptcha: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userLogin',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(userLogin, payload);
      // Login successfully
      if (response.message === '登陆成功') {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        localStorage.setItem('token', response.data.token);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        // yield put(routerRedux.replace(redirect || '/'));
        window.location.href = redirect || '/'
      } else {
        message.error(response.message)
      }
    },

    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data.role);
      // localStorage.setItem('token', payload.data.token);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
