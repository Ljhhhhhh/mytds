// import { extend } from 'umi-request';
import request from '@/utils/request';

interface userData {
  username: string,
  password: string
}
export async function userLogin(data: userData): Promise<any> {
  return request('/admin/login', {
    method: 'post',
    data
  });
}

export async function fetchUser() {
  return request('/admin/list');
}

interface IChnageData {
  password: string;
  resetPassword: string;
}

export async function changPassword(data:IChnageData) {
  return request.post('/admin/reset', {
    data
  });
}

export async function queryCurrent(): Promise<any> {
  return request('/admin/info');
}

interface queryUserParams {
  pageSize: number;
  currentPage?: number;
  current?: number;
  total?: number;
  parameter?: {
    phone?: string;
    username?: string;
    mail?: string;
  };
}
// 用户列表
export async function queryUser(data: queryUserParams) {
  const {pageSize = 10, currentPage = 1, current, parameter = {} } = data
  return request.post('/admin/find', {
    data: {
      pageSize,
      currentPage: current || currentPage,
      parameter
    }
  })
}

export async function removeUser(id: number) {
  return request.post(`/admin/del/${id}`)
}

interface IUserBaseData {
  username: string;
  roleId: number; // 1：普通用户 2：高级用户 3：管理员 4：超级管理员
  name?: string;
  phone?: string;
  mail?: string;
  id?: number;
}

interface IUserCreateData extends IUserBaseData{
  password: string;
}

export async function createUser(data:IUserCreateData) {
  if (!data.name) {
    data.name = data.username
  }
  return request.post('/admin/register', {
    data
  });
}
interface IUserUpdateData extends IUserBaseData{
  id: number;
}
export async function updateUser(data: IUserUpdateData) {
  return request.post('/admin/edit', {
    data
  })
}

// 角色
export async function queryRole() {
  return request.post('/role/findPage', {
    data: {
      pageSize: 1000,
      currentPage: 1,
    }
  })
}

export async function createRole(data: {
  name: string;
  remark: string;
  id?: number
}) {
  return request.post('/role/save', {
    data
  })
}

export async function removeRole(id: {
  id: number
}) {
  const data = [{id}]
  return request.post('/role/delete', {
    data
  })
}
