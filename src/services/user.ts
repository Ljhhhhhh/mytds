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

interface IUserData {
  name?: string;
  username: string;
  password: string;
}

export async function createUser(data:IUserData) {
  if (!data.name) {
    data.name = data.username
  }
  return request.post('/admin/register', {
    data
  });
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

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/admin/info');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
