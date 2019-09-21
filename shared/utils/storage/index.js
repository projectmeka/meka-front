import { Cookies } from 'react-cookie'

let cookies = new Cookies()

const plugToRequest = (req) => {
  cookies = new Cookies(req.headers.cookie)
}

const getItem = async (name, json, options) => {
  const value = await cookies.get(name, options)
  return (json && !!value) ? JSON.parse(value) : value
}

const getItemSync = (name, json, options) => {
  const value = cookies.get(name, options)
  return (json && !!value) ? JSON.parse(value) : value
}

const setItem = (name, value, json, options) => {
  const stringValue = (json && !!value) ? JSON.stringify(value) : value
  cookies.set(name, stringValue, options)
}

const removeItem = (name, options) => cookies.remove(name, options)

const storage = { plugToRequest, getItem, getItemSync, setItem, removeItem }

export default storage
