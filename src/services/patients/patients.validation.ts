/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi'

const schema = Joi.object({
  FirstName: Joi.string().required().min(1),
  LastName: Joi.string().required().min(1),
  Email: Joi.string().required().min(1),
  Password: Joi.string().required().min(1),
  Phone: Joi.string().optional(),
})

const schema2 = Joi.object({
  FirstName: Joi.string().required().min(1),
  LastName: Joi.string().required().min(1),
  Phone: Joi.string().optional().min(1),
  Email: Joi.string().required().min(1),
  Gender: Joi.string().required().min(1),
  Nationality: Joi.string().required().min(1),
  State: Joi.string().required().min(1),
  City: Joi.string().required().min(1),
  Address: Joi.string().required().min(1),
  Amount: Joi.string().required().min(1),
  Duration: Joi.string().required().min(1),
  NOKFullName: Joi.string().required().min(1),
  NOKRelationship: Joi.string().required().min(1),
  NOKPhone: Joi.string().required().min(1),
  NOKEmail: Joi.string().required().min(1),
  NOKAddress: Joi.string().required().min(1)
})

// name : Joi.any().optional(); // for optional entry

class patientsValidation {
  static async validateCreatPatients (data: any): Promise<any> {
    const { error, value } = schema.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }

  static async validateCreatPatients2 (data: any): Promise<any> {
    const { error, value } = schema2.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }
}

export default patientsValidation

/* --------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
 {
    "FullName" : "",
    "Phone" : "",
    "Email" : "",
    "Gender" : "",
    "Nationality" : "",
    "State" : "",
    "City" : "",
    "Address" : "",
    "Amount" : "",
    "Duration" : "",
    "NOKFullName" : "",
    "NOKRelationship" : "",
    "NOKPhone" : "",
    "NOKEmail" : "",
    "NOKAddress" : "",
  }
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE */
