import request from '@/utils/request'
export function getAllMachinerooms() {
  const params = {
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/ntsMachineroom',
    method: 'get',
    params
  })
}

export function getBuildingMachinerooms() {
  return request({
    url: 'api/ntsMachineroom/ntsBuildingAndMachinerooms',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/ntsMachineroom',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ntsMachineroom/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ntsMachineroom',
    method: 'put',
    data
  })
}

export default { add, edit, del }
