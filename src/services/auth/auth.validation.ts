/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi'

const schema = Joi.object({
  hospitalName: Joi.string().required().min(1),
  hospitalAddress: Joi.string().required().min(1),
  hospitalCountry: Joi.string().optional().min(1),
  hospitalState: Joi.string().optional().min(1),
  hospitalType: Joi.string().required().min(1),
  contactName: Joi.string().required().min(1),
  contactEmail: Joi.string().required().min(1),
  contactPhone: Joi.string().required().min(1),
  description: Joi.string().optional().min(1),
  subcriptionId: Joi.string().required().min(1),
  hospitalArea: Joi.any().optional(),
  hospitalLogo: Joi.any().optional(),
  password: Joi.any().optional()
})
// name : Joi.any().optional(); // for optional entry

class AuthenticationValidation {
  static async validateCreateHospitals (data: any): Promise<any> {
    const { error, value } = schema.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }
}

export default AuthenticationValidation

/* --------------------------------------------------------- POSTMAN TEST DATA STRUCTURE

{
    "hospitalName" : "",
    "hospitalAddress" : "",
    "hospitalCountry" : "",
    "hospitalState" : "",
    "hospitalType" : "",
    "contactName" : "",
    "contactEmail" : "",
    "contactPhone" : "",
    "status" : "",
    "description" : "",
    "subcriptionId" : "",
  }
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE */
