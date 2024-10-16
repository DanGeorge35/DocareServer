/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import fs from 'fs'

import {
  getUIDfromDate,
  EncryptPassword,
  generateOTP,
  CheckPassword,
  SendMail,
  ProcessUploadImage,
  adjustFieldsToValue,
  SendVerifyToken
} from '../../libs/utils/app.utility'

import Doctors from '../../models/doctors.model'
import Auth from '../../models/auths.model'
import DoctorsValidation from './doctors.validation'
import { IncomingForm, type Fields } from 'formidable'
// import Investments from '../../models/history.model'
import Systems from '../../models/systems.model'
import sequelize from '../../config/db'
import { QueryTypes } from 'sequelize'
import { Certificate } from 'crypto'
import { createErrorResponse, createSuccessResponse, type IResponse, sendResponse } from '../../libs/helpers/response.helper'

class DoctorsController {
  static async createDoctors (req: any, res: any): Promise<any> {
    try {
      const data = req.body
      const validate = await DoctorsValidation.validateCreateDoctors(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).send(result)
      }

      const accountExist = await Auth.findOne({ where: { Email: data.Email } })
      if (accountExist !== null) {
        if (accountExist.dataValues.Verified === 0) {
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

      const DID = getUIDfromDate('DOC')
      data.UserID = DID
      data.UserType = 'doctor'
      const dpaswprd = data.Password ?? DID
      const token = generateOTP()
      const account: any = {}
      account.UserID = data.UserID
      account.FirstName = data.FirstName
      account.LastName = data.LastName
      account.Email = data.Email
      account.Role = data.UserType
      account.UserType = 'doctor'
      account.PasswordHash = await EncryptPassword(dpaswprd)
      account.RefreshToken = account.PasswordHash
      account.Token = token
      account.Verified = '0'
      account.Status = 'Pending'

      const daccount = await Auth.create({ ...account })

      const dDoctors = await Doctors.create({ ...data })

      dDoctors.dataValues.account = daccount
      const successResponse: IResponse = createSuccessResponse(dDoctors, 201, 'Account Successfully Created')
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

  static async Upload (req: any, res: any, next: any): Promise<any> {
    const form = new IncomingForm({ multiples: false })
    form.parse(req, async (err, fields: Fields<string>, files) => {
      try {
        if (err) {
          return res
            .status(400)
            .json({ code: 400, message: 'Error parsing the request' })
        }

        const User = req.user.data
        const DID = User.UserID
        const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB in bytes
        const dir = '/public/doctor'
        if (!fs.existsSync('./public')) {
          fs.mkdirSync('./public')
        }
        if (!fs.existsSync(`.${dir}`)) {
          await fs.promises.mkdir(`.${dir}`)
            .then(() => {
              console.log('Directory created')
            })
            .catch((error) => {
              console.error('Error creating directory:', error)
            })
        }

        const data: any = adjustFieldsToValue(fields)

        if (data) {
          const validate = await DoctorsValidation.validateDoctorData(data)
          if (validate.result === 'error') {
            const result: { code: number, message: string } = {
              code: 400,
              message: validate.message
            }
            return res.status(result.code).send(result)
          }
        }

        if (files.ProfilePicture) {
          if (files.ProfilePicture[0].size > MAX_FILE_SIZE) {
            return res
              .status(413)
              .send({ code: 413, message: 'ProfilePicture File size exceeds the 2 MB limit' })
          }

          const ProfilePicture = files.ProfilePicture[0]
          data.ProfilePicture = await ProcessUploadImage(
            ProfilePicture,
            `${dir}/${DID}-PHOTO`
          )
        }

        if (files.Certification) {
          if (files.Certification[0].size > MAX_FILE_SIZE) {
            return res
              .status(413)
              .send({ code: 413, message: ' Certification File size exceeds the 2 MB limit' })
          }

          const Certification = files.Certification[0]
          data.Certification = await ProcessUploadImage(
            Certification,
            `${dir}/${DID}-Certification`
          )
        }

        if (files.KycNicFront) {
          if (files.KycNicFront[0].size > MAX_FILE_SIZE) {
            return res
              .status(413)
              .send({ code: 413, message: ' NIN Frontside File size exceeds the 2 MB limit' })
          }

          const KycNicFront = files.KycNicFront[0]
          data.KycNicFront = await ProcessUploadImage(
            KycNicFront,
            `${dir}/${DID}-KycNicFront`
          )
        }

        if (files.KycNicBack) {
          if (files.KycNicBack[0].size > MAX_FILE_SIZE) {
            return res
              .status(413)
              .send({ code: 413, message: 'NIN Backside File size exceeds the 2 MB limit' })
          }

          const KycNicBack = files.KycNicBack[0]
          data.KycNicBack = await ProcessUploadImage(
            KycNicBack,
            `${dir}/${DID}-KycNicBack`
          )
        }

        let doctor = await Doctors.findByPk(User.id)

        if (!doctor) {
          return res.status(404).json({ success: false, message: 'Doctor not found' })
        }

        doctor = await doctor.update(data)

        return res
          .status(201)
          .json({ success: true, data: doctor, message: 'Doctor Picture updated' })
      } catch (error: any) {
        const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` }
        console.error(error)
        return res.status(400).send(err)
      }
    })
  }

  static async getSingleDoctors (req: any, res: any): Promise<any> {
    try {
      const { id } = req.params

      const singleDoctors = await Doctors.findOne({ where: { id } })

      if (singleDoctors === null) {
        return res.status(400).json({ success: false, data: 'Invalid link' })
      }

      return res.status(200).json({ success: true, data: singleDoctors })
    } catch (error: any) {
      const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  static async getallDoctors (req: any, res: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allDoctorss = await Doctors.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allDoctorss.count / PAGE_SIZE)

      return res.status(200).json({
        success: true,
        data: allDoctorss.rows,
        pagination: {
          currentPage: page,
          totalPages,
          pageSize: PAGE_SIZE
        }
      })
    } catch (error: any) {
      const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  /**
   * Update doctor information.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<any>} A Promise that resolves to the response.
   */
  static async updateDoctors (req: any, res: any): Promise<any> {
    try {
      let agentId
      if (req.user.data.UserType === 'Doctor') {
        if (parseInt(req.params.id) === req.user.data.id) {
          agentId = parseInt(req.params.id)
        } else {
          return res
            .status(401)
            .json({ success: true, message: 'You are not allowed to perform this action!' })
        }
      } else if (req.user.data.UserType === 'Admin') {
        agentId = parseInt(req.params.id)
      } else {
        return res
          .status(401)
          .json({ success: true, message: 'You are not authorized for this action!' })
      }

      const updatedInfo = req.body

      const agent = await Doctors.findByPk(agentId)

      if (!agent) {
        return res.status(404).json({ success: false, message: 'Doctor not found' })
      }

      await agent.update(updatedInfo)

      return res
        .status(200)
        .json({ success: true, data: agent, message: 'Doctor information updated' })
    } catch (error: any) {
      const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }

  static async deleteDoctors (req: any, res: any): Promise<any> {
    try {
      const doctorsId = req.params.id

      const doctors = await Doctors.findByPk(doctorsId)

      if (!doctors) {
        return res.status(404).json({ success: false, message: 'Doctors not found' })
      }
      const dauth = await Auth.findOne({ where: { UserID: doctors.dataValues.UserID } })
      if (dauth) {
        await dauth.destroy()
      }

      await doctors.destroy()

      res.status(200).json({ success: true, message: 'Doctor deleted' })
    } catch (error: any) {
      const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).send(err)
    }
  }
}

export default DoctorsController
