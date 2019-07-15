import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { fetchLogs, createLog } from '@/services/talent';

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
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'talent_log',

  state: {
    list: [],
    pagination: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchLogs, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *add({ payload, callback }, { call }) {
      yield call(createLog, payload);
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
