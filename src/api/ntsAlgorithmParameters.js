import request from '@/utils/request'

export function get(algId) {
  const params = {
    algId,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/ntsAlgorithmParameters',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/ntsAlgorithmParameters',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ntsAlgorithmParameters/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ntsAlgorithmParameters',
    method: 'put',
    data
  })
}

export default { add, edit, del }
