import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryTrialFee, createTrialFee, removeTrialFee } from '@/services/talent';

import { TableListDate } from './data';

export interface StateType {
  data: TableListDate;
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
    // update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'talent_fee',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTrialFee, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *add({ payload, callback }, { call }) {
      yield call(createTrialFee, payload);
      if (callback) callback();
    },

    *remove({ payload, callback }, { call }) {
      yield call(removeTrialFee, payload);
      if (callback) callback();
    },
  },

  reducers: {
    save(state: any, action) {
      return {
        ...state,
        data: {
          ...action.payload,
          userList: state.data.userList,
        }
      };
    }
  },
};

export default Model;
