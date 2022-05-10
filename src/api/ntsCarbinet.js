import request from '@/utils/request'
export function getAllCarbinet() {
  const params = {
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/ntsCarbinet',
    method: 'get',
    params
  })
}

export function getCarbinetsWithMachinerooms() {
  return request({
    url: 'api/ntsCarbinet/ntsMachineroomsandCarbinets',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/ntsCarbinet',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ntsCarbinet/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ntsCarbinet',
    method: 'put',
    data
  })
}

export default { add, edit, del }
