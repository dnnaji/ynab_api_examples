import axios from 'axios'

// Axios config
const options = {
  baseURL: 'https://api.youneedabudget.com/v1/',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer XXYYZZ'
  },
  timeout: 10000
}

const apiClient = axios.create(options)

export default {
  // Load all budget data for the given ID
  budgets(id) {
    let url = '/'
    url = `${url}/${id}`
    return apiClient.get(url).then(res => {
      return res.data.data.budget
    })
  }
}
