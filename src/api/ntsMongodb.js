import request from '@/utils/request'

export function getMongodbInfo() {
  return request({
    url: 'api/ntsMongo/mdbinfo',
    method: 'get'
  })
}

export function getMongodbPrepCollections() {
  return request({
    url: 'api/ntsMongo/prepCollections',
    method: 'get'
  })
}

