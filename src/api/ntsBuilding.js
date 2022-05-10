import request from '@/utils/request'

export function getAllBuildings() {
  const params = {
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/ntsBuilding',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/ntsBuilding',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ntsBuilding/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ntsBuilding',
    method: 'put',
    data
  })
}

export default { add, edit, del }
