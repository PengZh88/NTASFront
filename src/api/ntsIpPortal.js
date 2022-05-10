import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ntsIpPortal',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ntsIpPortal/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ntsIpPortal',
    method: 'put',
    data
  })
}

export function getAllProtocols() {
  return request({
    url: 'api/ntsIpPortal/ntsAllProtocols',
    method: 'get'
  })
}

export default { add, edit, del }
