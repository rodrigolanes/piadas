import fetch from 'node-fetch'

export const getFacebookUser = (token): any => {
  let url = 'https://graph.facebook.com/me?fields=id,name,email,picture&access_token=' + token
  // login as a facebook app to get an "app token"
  return fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(response => {
      const { id, picture, email, name } = response

      const user = {
        name: name,
        pic: picture.data.url,
        id: id,
        emailVerified: true,
        email: email
      }
      return user
    })
  // throw an error if something goes wrong
    .catch(err => {
      throw new Error('error while authenticating facebook user: ' + JSON.stringify(err))
    })
}
