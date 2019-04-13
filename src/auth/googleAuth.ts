import { OAuth2Client } from 'google-auth-library'
import config from '../config/config'

const googleClientId = config.googleAuth.clientId

const client = new OAuth2Client(googleClientId, '', '')

// return a promise with user informations
export const getGoogleUser = (token): any => {
  // verify the token using google client
  return client.verifyIdToken({ idToken: token, audience: googleClientId })
    .then(login => {
      // if verification is ok, google returns a jwt
      const payload = login.getPayload()

      if (payload) {
        // const userid = payload['sub']

        // check if the jwt is issued for our client
        var audience = payload.aud
        if (audience !== googleClientId) {
          throw new Error('error while authenticating google user: audience mismatch: wanted [' + googleClientId + '] but was [' + audience + ']')
        }
        // promise the creation of a user
        return {
          name: payload['name'], // profile name
          pic: payload['picture'], // profile pic
          id: payload['sub'], // google id
          emailVerified: payload['email_verified'],
          email: payload['email']
        }
      }
    })
    .then(user => { return user })
    .catch(err => {
      // throw an error if something gos wrong
      console.log(err)
      throw new Error('error while authenticating google user: ' + JSON.stringify(err))
    })
}
