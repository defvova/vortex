import UniversalApi from 'universal-api'
import { VK_BASE_URL } from '../config'

const vk = new UniversalApi({
  baseUrl: VK_BASE_URL,
  jsonp: true,
  query: function() { // eslint-disable-line babel/object-shorthand
    return {
      access_token: this.token
    }
  },
  transformResponse: (res) => {
    const body = res.body

    if (body.response) {
      return body.response
    } else if (body.error) {
      throw body.error
    } else if (Object.keys(body).length > 0) {
      return body
    } else {
      return res.text
    }
  }
})

export default vk
