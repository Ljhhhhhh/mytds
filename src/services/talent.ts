import request from '@/utils/request';
import moment from 'moment'

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  pageSize: number;
  currentPage?: number;
}
// 试用达人
export async function queryTrial(data: any = {}) {
  const {pageSize = 10, currentPage = 1, ...parameter } = data
  if (parameter.followUpDate) {
    parameter.followUpDate = moment(parameter.followUpDate).valueOf();
  }
  return request.post('/trial/find', {
    data: {
      pageSize,
      currentPage,
      parameter
    }
  });
}

export async function exportTrial(data: any = {}) {
  const {pageSize = 10, currentPage = 1, ...parameter } = data
  if (parameter.followUpDate) {
    parameter.followUpDate = moment(parameter.followUpDate).valueOf();
  }
  return request.post('/trial/export', {
    responseType: 'blob',
    data: {
      pageSize,
      currentPage,
      parameter
    }
  });
}

export async function createTrial(data: any) {
  return request.post('/trial/save', {
    data,
  });
}

export async function removeTrial(id: number) {
  return request.post(`/trial/del/${id}`);
}

// 工作日志
interface LogsParams {
  pageSize: number;
  current: number;
  parameter?: any
}

export async function fetchLogs(data: LogsParams = {pageSize: 10, current: 1}) {
  return request.post('/log/find', {
    data
  });
}

export async function createLog(data: any) {
  return request.post('/log/save', {
    data
  });
}

// 付费达人
export async function queryTrialFee(data: any = {}) {
  const {pageSize = 10, currentPage = 1, ...parameter } = data
  if (parameter.followUpDate) {
    parameter.followUpDate = moment(parameter.followUpDate).valueOf();
  }
  return request.post('/fee/find', {
    data: {
      pageSize,
      currentPage,
      parameter
    }
  });
}

export async function exportTrialFee(data: any = {}) {
  const {pageSize = 10, currentPage = 1, ...parameter } = data
  if (parameter.followUpDate) {
    parameter.followUpDate = moment(parameter.followUpDate).valueOf();
  }
  return request.post('/fee/export', {
    responseType: 'blob',
    data: {
      pageSize,
      currentPage,
      parameter
    }
  });
}

export async function createTrialFee(data: any) {
  return request.post('/fee/save', {
    data,
  });
}

export async function removeTrialFee(id: number) {
  return request.post(`/fee/del/${id}`);
}
