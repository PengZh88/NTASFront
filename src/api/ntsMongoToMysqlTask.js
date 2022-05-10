import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ntsMongoToMysqlTask',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ntsMongoToMysqlTask/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ntsMongoToMysqlTask',
    method: 'put',
    data
  })
}

export function confirmTask(data) {
  return request({
    url: 'api/ntsMongoToMysqlTask/confirmTask',
    method: 'post',
    data
  })
}

export function findAllTasks() {
  return request({
    url: 'api/ntsMongoToMysqlTask/findAllTasks',
    method: 'get'
  })
}

export function getTaskNumbers() {
  return request({
    url: 'api/ntsMongoToMysqlTask/getTaskNumbers',
    method: 'get'
  })
}

export default { add, edit, del }
