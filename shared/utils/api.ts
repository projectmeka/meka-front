import storage from 'utils/storage'

export const fetchBase = async (method: string = 'GET', endPoint: string = '/hello', params: object = {}, customeHeaders: object = {}) => {
  let url = `http://cb174c25.ngrok.io${endPoint}`

  const headers: { Accept: string, 'Content-Type': string, Authorization?: any } = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...customeHeaders
  }

  const token = await storage.getItem('meka_token')
  if (token) {
    const authorization = token && `Bearer ${token}`
    headers.Authorization = authorization || null
  }

  const options: any = { method, headers }

  if (method === 'GET') {
    const queryString: string = `${Object.keys(params).map(k => [k, params[k]].map(encodeURIComponent).join('=')).join('&')}`
    if (queryString) url += `?${queryString}`
  } else if (method === 'POST' || method === 'PUT') {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      options.body = `${Object.keys(params).map(k => [k, params[k]].join('=')).join('&')}`
    } else if (headers['Content-Type'] === 'multipart/form-data') {
      delete headers['Content-Type']
      const formData = new FormData()
      Object.keys(params).forEach(key => formData.append(key, params[key]))
      options.body = formData
    } else {
      options.body = JSON.stringify(params)
    }
  }

  return fetch(url, options).then((res: any) => {
    if (!res.ok) {
      return res.json().then((e: any) => Promise.reject({ message: e.error }))
    }

    const contentType = res.headers.get('content-type')

    if (/json/.test(contentType)) {
      return res.json()
    }
    if (/text/.test(contentType)) {
      return res.text()
    }
    if (/image\/png/.test(contentType)) {
      return res.blob().then((blob: string) => URL.createObjectURL(blob))
    }
    return null
  })
}

export const getUserInfo = (params: any) => fetchBase('GET', '/api/users/profile', params)
