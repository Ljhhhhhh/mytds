import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryRole, createRole, removeRole } from '@/services/user';
import {message} from 'antd'

export interface StateType {
  list: any[];
  pagination: any;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'user_roles',

  state: {
    list: [],
    pagination: {},
  },

  effects: {
    *fetch({}, { call, put }) {
      const response = yield call(queryRole);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *add({ payload, callback }, { call }) {
      const reponse = yield call(createRole, payload);
      if (reponse.responseCode !== 200) {
        message.error(reponse.message || '修改用户出错，请检查')
      } else if (callback) callback();
    },

    *remove({ payload, callback }, { call }) {
      yield call(removeRole, payload);
      // yield fetch(payload)
      if (callback) callback();
    }
  },

  reducers: {
    save(state: any, action: any) {
      return {
        list: action.payload.list,
        pagination: action.payload.pagination
      };
    },
  },
};

export default Model;
