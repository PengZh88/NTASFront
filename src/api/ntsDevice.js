import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ntsDevice',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ntsDevice/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ntsDevice',
    method: 'put',
    data
  })
}

export function getAllDevices() {
  return request({
    url: 'api/ntsDevice/ntsAllDevices',
    method: 'get'
  })
}

export default { add, edit, del }
