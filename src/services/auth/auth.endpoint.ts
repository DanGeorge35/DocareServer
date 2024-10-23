import AuthController from './auth.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/auth'
const AuthEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [AuthController.createAccount]
  },
  {
    path: `${ENDPOINT_URL}/verify/:email/:token`,
    method: 'get',
    handler: [AuthController.verifyaccount]
  },
  {
    path: `${ENDPOINT_URL}/verify`,
    method: 'post',
    handler: [AuthController.verifyaccountotp]
  },
  {
    path: `${ENDPOINT_URL}/createpassword`,
    method: 'post',
    handler: [Authorization, AuthController.createpassword]
  },
  {
    path: `${ENDPOINT_URL}/changepassword`,
    method: 'post',
    handler: [Authorization, AuthController.changepassword]
  },

  {
    path: `${ENDPOINT_URL}/changepasswordreset`,
    method: 'post',
    handler: [AuthController.changepasswordreset]
  },
  {
    path: `${ENDPOINT_URL}/resetpassword`,
    method: 'post',
    handler: [AuthController.resetpassword]
  },
  {
    path: `${ENDPOINT_URL}/login`,
    method: 'post',
    handler: [AuthController.login]
  }
]

export default AuthEndpoint
