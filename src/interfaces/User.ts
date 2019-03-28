export interface UserInterface {
  email: string,
  password: string,
  facebookProvider?: {
    id: string,
    token: string
  },
  twitterProvider?: {
    id: string,
    token: string,
    tokenSecret: string
  }
}
