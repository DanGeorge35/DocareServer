/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import Auths from '../../models/auths.model'
import {
  getUIDfromDate,
  EncryptPassword,
  GenerateToken,
  CheckPassword,
  SendMail,
  SendVerifyToken,
  SendAccountVerified,
  generateOTP
} from '../../libs/utils/app.utility'
import AuthenticationValidation from './auth.validation'
import Admin from '../../models/admin.model'
import Doctor from '../../models/doctors.model'
import Patient from '../../models/patients.model'
import { createErrorResponse, createSuccessResponse, type IResponse, sendResponse } from '../../libs/helpers/response.helper'

class AuthenticationController {
  static async createAccount (req: any, res: any): Promise<any> {
    try {
      const data = req.body
      const validate = await AuthenticationValidation.validateCreateAccount(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }

        return res.status(result.code).send(result)
      }

      const accountExist = await Auths.findOne({ where: { Email: data.Email } })
      if (accountExist !== null) {
        if (accountExist.dataValues.Verified === '0') {
          const token = generateOTP()
          await SendVerifyToken(data, token)
          const successResponse: IResponse = createErrorResponse(205, 'Kindly check your mail for Verification Code')(token)
          sendResponse(res, successResponse)
          return res.end()
        } else {
          return res.status(400).send({
            message: 'Account Already Exist',
            code: 400
          })
        }
      }

      const DID = getUIDfromDate('U')
      data.UserID = DID
      data.UserType = 'pending'
      const dpaswprd = data.Password ?? DID
      const token = generateOTP()
      const account: any = {}
      account.UserID = data.UserID
      account.FirstName = data.FirstName
      account.LastName = data.LastName
      account.Email = data.Email
      account.Role = data.UserType
      account.UserType = 'pending'
      account.PasswordHash = await EncryptPassword(dpaswprd)
      account.RefreshToken = account.PasswordHash
      account.Token = token
      account.Verified = '0'
      account.Status = 'Pending'

      const daccount = await Auths.create({ ...account })
      delete daccount.dataValues.PasswordHash
      delete daccount.dataValues.RefreshToken
      const successResponse: IResponse = createSuccessResponse(daccount, 200, 'Account Successfully Created')
      await SendVerifyToken(data, token)
      sendResponse(res, successResponse)
      res.end()
    } catch (error: any) {
      return res.status(400).send({
        message: error.message,
        code: 400
      })
    }
  }

  static async userData (email: string): Promise<any> {
    let user: any
    let token
    const account: any = await Auths.findOne({ where: { email } })

    if (!account) {
      const result: any = {
        message: 'Account Not found!',
        code: 400
      }
      return result
    }

    if (account.userType === 'Admin') {
      user = await Admin.findOne({ where: { Email: email } })
    } else if (account.userType === 'doctor') {
      user = await Doctor.findOne({ where: { email } })
    } else if (account.userType === 'patient') {
      user = await Patient.findOne({ where: { email } })
    }

    if (parseInt(account.dataValues.verified) === 0) {
      const result: any = {
        message: 'Account Not Verified! Kindly check your email INBOX / SPAM for verification link',
        code: 400
      }
      return result
    }

    user.dataValues.Account = account
    if (user !== null) {
      token = GenerateToken(user)
    }

    return { success: true, code: 200, data: user, token }
  }

  static async login (req: any, res: any): Promise<any> {
    try {
      let token
      const { email, password } = req.body

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: 'Email and password is required', code: 400 })
      }

      const account: any = await Auths.findOne({ where: { Email: email } })

      if (!account) {
        const result: any = {
          success: false,
          message: 'Account Not found!',
          code: 400
        }
        return res.status(result.code).json(result)
      }

      const validPass = await CheckPassword(password, account.PasswordHash)
      if (!validPass) {
        const result: any = {
          success: false,
          message: 'Incorret Password!',
          code: 400
        }
        return res.status(result.code).json(result)
      }

      if (parseInt(account.dataValues.Verified) === 0) {
        // const result: any = {
        //   success: false,
        //   message: 'Account Not Verified! Kindly check your email INBOX / SPAM for verification link',
        //   code: 400
        // }
        // return res.status(result.code).json(result)
      }

      let user: any

      if (account.UserType === 'Admin') {
        user = await Admin.findOne({ where: { Email: email } })
      } else if (account.UserType === 'doctor') {
        user = await Doctor.findOne({ where: { Email: email } })
      } else if (account.UserType === 'patient') {
        user = await Patient.findOne({ where: { Email: email } })
      }

      if (user !== null) {
        user.dataValues.Account = account
        token = GenerateToken(user)
      } else {
        const result: any = {
          success: false,
          message: 'User Not found!',
          code: 400
        }
        return res.status(result.code).json(result)
      }

      delete user.dataValues.Account.dataValues.PasswordHash
      delete user.dataValues.Account.dataValues.RefreshToken
      delete user.dataValues.Account.dataValues.Token
      return res.status(200).json({ success: true, data: user, token, message: 'Successfully Login' })
    } catch (error: any) {
      const result: any = {
        message: 'Error login in: ' + error.message,
        code: 400
      }
      return res.status(result.code).json(result)
    }
  }

  static async verifyaccountotp (req: any, res: any): Promise<any> {
    try {
      const { email, token } = req.body

      let authdata: any = await Auths.findOne({ where: { Email: email } })

      if (authdata === null) {
        const errorResponse: IResponse = createErrorResponse(404, 'Account Not Found')()
        sendResponse(res, errorResponse)
        return res.end()
      }

      if (authdata.dataValues.Token !== token) {
        const errorResponse: IResponse = createErrorResponse(404, 'Invalid Token')()
        sendResponse(res, errorResponse)
        return res.end()
      }

      authdata = await authdata.update({ Verified: '1', Status: 'Active' })
      await SendAccountVerified({ FirstName: authdata.FirstName, Email: authdata.Email })
      const successResponse: IResponse = createSuccessResponse(authdata, 201, 'Account Successfully Verified')
      sendResponse(res, successResponse)
      return res.end()
    } catch (error: any) {
      const errorResponse: IResponse = createErrorResponse(400, `SYSTEM ERROR : ${error.message}`)()
      sendResponse(res, errorResponse)
      return res.end()
    }
  }

  static async verifyaccount (req: any, res: any): Promise<any> {
    try {
      const { email, token } = req.params

      const authdata: any = await Auths.findOne({ where: { Email: email, Token: token } })

      if (authdata === null) {
        return res.status(404).send('Page not found')
      }

      await authdata.update({ verified: '1' })
      // return response as html text
      res.setHeader('Content-Type', 'text/html')
      res.write(`
          <h3>Your account has been verified successfully</h3><br/>
          Please click on this <a href="${process.env.DOMAIN}/login">link to login.</a>
        `)
      await SendMail({
        subject: 'Email Successfully Verified',
        to_name: `${authdata.firstName}`,
        message: `Email is successfully verified. You can login now!
         \n\n Kind Regards,\nSupport Team`,
        to_email: authdata.email
      })
      return res.end()
    } catch (error: any) {
      const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  static async resetpassword (req: any, res: any): Promise<any> {
    try {
      const data: any = req.body
      if (!data.email) {
        const errorResponse: IResponse = createErrorResponse(400, 'Invalid Entry: Email can not be empty')()
        sendResponse(res, errorResponse)
        return res.end()
      }

      const account: any = await Auths.findOne({ where: { Email: data.email } })
      if (!account) {
        const errorResponse: IResponse = createErrorResponse(400, 'Account not found!')()
        sendResponse(res, errorResponse)
        return res.end()
      }

      const restToken = getUIDfromDate('RST')
      await account.update({ Token: restToken })
      res
        .status(200)
        .json({ success: true, code: 200, message: 'Your account reset code has been sent to your email!' })
      await SendMail({
        subject: 'Pasword Reset Code',
        to_name: `${account.dataValues.firstName}`,
        message: `Your account password reset code is:\n
        ${restToken}

         \n\nKind Regards,\nTurgl Team`,
        to_email: account.email
      })
      return res.end()
    } catch (error: any) {
      const errorResponse: IResponse = createErrorResponse(400, 'SYSTEM ERROR :' + error)()
      sendResponse(res, errorResponse)
      return res.end()
    }
  }

  static async changepasswordreset (req: any, res: any): Promise<any> {
    try {
      const data: any = req.body
      if (!data.email) {
        const errorResponse: IResponse = createErrorResponse(400, 'Invalid Entry: Email can not be empty')()
        sendResponse(res, errorResponse)
        return res.end()
      }
      if (!data.resetcode) {
        const errorResponse: IResponse = createErrorResponse(400, 'Invalid Entry: reset code can not be empty')()
        sendResponse(res, errorResponse)
        return res.end()
      }
      if (!data.newpass) {
        const errorResponse: IResponse = createErrorResponse(400, 'Invalid Entry: new password can not be empty')()
        sendResponse(res, errorResponse)
        return res.end()
      }
      const account: any = await Auths.findOne({ where: { Email: data.email } })
      if (!account) {
        const errorResponse: IResponse = createErrorResponse(400, 'Account not found!')()
        sendResponse(res, errorResponse)
        return res.end()
      }

      if (account.Token !== data.resetcode) {
        const errorResponse: IResponse = createErrorResponse(400, 'Invalid Reset Code, Kindly check your email INBOX / SPAM for your account reset code!')()
        sendResponse(res, errorResponse)
        return res.end()
      }
      const PasswordHash = await EncryptPassword(data.newpass)
      await account.update({ PasswordHash })
      res.status(200).json({ success: true, message: 'Password Changed Successfully!' })
      await SendMail({
        subject: 'Changed Password Successfully',
        to_name: `${account.dataValues.firstName}`,
        message: `Your account password has been successfully updated.
         \n\n Kind Regards,\nTurgl Team`,
        to_email: account.email
      })
      return res.end()
    } catch (error: any) {
      const errorResponse: IResponse = createErrorResponse(400, 'System Error:' + error)()
      sendResponse(res, errorResponse)
      return res.end()
    }
  }

  static async changepassword (req: any, res: any): Promise<any> {
    try {
      const authUser = req.user.data

      const data: any = req.body
      if (!data.email) {
        const errorResponse: IResponse = createErrorResponse(400, 'Invalid Entry: email can not be empty')()
        sendResponse(res, errorResponse)
        return res.end()
      }
      if (!data.oldpass) {
        const errorResponse: IResponse = createErrorResponse(400, 'Invalid Entry: old password can not be empty')()
        sendResponse(res, errorResponse)
        return res.end()
      }
      if (!data.newpass) {
        const errorResponse: IResponse = createErrorResponse(400, 'Invalid Entry: new password can not be empty')()
        sendResponse(res, errorResponse)
        return res.end()
      }
      const account: any = await Auths.findOne({
        where: { Email: data.email, UserType: authUser.Account.UserType }
      })
      if (!account) {
        const errorResponse: IResponse = createErrorResponse(400, 'Invalid Entry: email not found')()
        sendResponse(res, errorResponse)
        return res.end()
      }
      const validPass = await CheckPassword(data.oldpass, account.PasswordHash)
      if (!validPass) {
        const errorResponse: IResponse = createErrorResponse(400, 'Incorret Password!')()
        sendResponse(res, errorResponse)
        return res.end()
      }
      const PasswordHash = await EncryptPassword(data.newpass)
      await account.update({ PasswordHash })
      res.status(200).json({ success: true, code: 200, message: 'Password Changed Successfully!' })
      await SendMail({
        subject: 'Changed Password Successfully',
        to_name: `${account.dataValues.firstName}`,
        message: `Your account password has been successfully updated.
         \n\n Kind Regards,\nTurgl Team`,
        to_email: account.email
      })
      return res.end()
    } catch (error: any) {
      const result: any = {
        success: false,
        message: 'System Error:' + error,
        code: 400
      }
      return res.status(result.code).json(result)
    }
  }
}

export default AuthenticationController
