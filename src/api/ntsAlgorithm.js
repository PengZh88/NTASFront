import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ntsAlgorithm',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ntsAlgorithm/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ntsAlgorithm',
    method: 'put',
    data
  })
}

export function viewAlg(data) {
  return request({
    url: 'api/ntsAlgorithm/viewAlgorithm',
    method: 'get',
    params: {
      id: data
    }
  })
}

export function getAllAlgorithms() {
  const params = {
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/ntsAlgorithm',
    method: 'get',
    params
  })
}

export default { add, edit, del }
