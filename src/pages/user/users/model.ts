import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryUser, createUser, removeUser, updateUser } from '@/services/user';

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
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'users',

  state: {
    list: [],
    pagination: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *add({ payload, callback }, { call }) {
      yield call(createUser, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call }) {
      yield call(updateUser, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeUser, payload);
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
