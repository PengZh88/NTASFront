import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ntsAnomalyDetectionTask',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ntsAnomalyDetectionTask/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ntsAnomalyDetectionTask',
    method: 'put',
    data
  })
}

export function confirmAnomalyTask(data) {
  return request({
    url: 'api/ntsAnomalyDetectionTask/confirmTask',
    method: 'post',
    data
  })
}

export function viewtask(id) {
  return request({
    url: 'api/ntsAnomalyDetectionTask/viewTask/' + id,
    method: 'post'
  })
}

export function viewTaskAlgParameters(taskId) {
  return request({
    url: 'api/ntsAnomalyDetectionTask/viewTaskAlgParameters/' + taskId,
    method: 'get'
  })
}

export function calWindowSize(ad, fg) {
  if (ad == null || fg == null) {
    return 1
  } else {
    if (ad === 'D') {
      if (fg === 'H') {
        return 1 * 24
      } else if (fg === 'M') {
        return 1 * 24 * 60
      } else if (fg === 'S') {
        return 1 * 24 * 60 * 60
      } else {
        return 1
      }
    } else if (ad === 'H') {
      if (fg === 'H') {
        return 1
      } else if (fg === 'M') {
        return 1 * 60
      } else if (fg === 'S') {
        return 1 * 60 * 60
      } else {
        return 1
      }
    } else {
      return 1
    }
  }
}

export function getFlowChartData(taskId) {
  return request({
    url: 'api/ntsAnomalyDetectionTask/getTaskFlowChartData/' + taskId,
    method: 'get'
  })
}

export default { add, edit, del }
