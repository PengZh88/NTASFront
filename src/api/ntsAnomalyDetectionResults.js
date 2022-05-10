import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ntsAnomalyDetectionResults',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ntsAnomalyDetectionResults/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ntsAnomalyDetectionResults',
    method: 'put',
    data
  })
}

export function getTaskResults(taskId) {
  return request({
    url: 'api/ntsAnomalyDetectionResults/getTaskResults/' + taskId,
    method: 'get'
  })
}

export default { add, edit, del }
