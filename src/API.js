import axios from 'axios'
import 'es6-promise/auto'

import { Title, Date } from './utils'

const conf = {
  repo: 'viko16/writings', // Which repository you stored the posts
  path: 'posts',
  branch: 'master'
}

/**
 * Format github api for post list url
 * @returns {string}
 */
export function getListUrl () {
  let url = `https://api.github.com/repos/${conf.repo}/contents/`
  if (conf.path) url += conf.path
  if (conf.branch) url += `?ref=${conf.branch}`
  return url
}

/**
 * format github api for post url
 * @param {string} sha
 * @returns {string}
 */
export function getPostUrl (sha) {
  return `https://api.github.com/repos/${conf.repo}/git/blobs/${sha}`
}

export { axios as axiosInstance }

let Cache = new Map()

export default {

  getList () {
    if (Cache.has('list')) {
      // Read from cache
      return Promise.resolve(Cache.get('list'))
    } else {
      return axios.get(getListUrl())
        .then(res => res.data)
        .then(arr => {
          const list = arr.map(({name, sha, size}) => ({
            title: Title(name),
            date: Date(name),
            sha,
            size
          }))
          Cache.set('list', list)
          return list
        })
    }
  },

  getDetail (sha) {
    const httpOpts = {
      headers: { Accept: 'application/vnd.github.v3.raw' }
    }
    if (Cache.has(sha)) {
      // Read from cache
      return Promise.resolve(Cache.get(sha))
    } else {
      return axios.get(getPostUrl(sha), httpOpts)
        .then(res => res.data)
        .then(content => {
          Cache.set(sha, content)
          return content
        })
    }
  }
}
