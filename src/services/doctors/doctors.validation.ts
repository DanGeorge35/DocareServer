/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi'

const schema = Joi.object({
  FirstName: Joi.string().required().min(1),
  LastName: Joi.string().required().min(1),
  Email: Joi.string().required().min(1),
  Password: Joi.string().required().min(1)
})


const schema2 = Joi.object({
  FirstName: Joi.any().optional(),
  LastName: Joi.any().optional(),
  Phone: Joi.string().optional().min(1),
  Email: Joi.any().optional(),
  Gender: Joi.any().optional(),
  Nationality: Joi.any().optional(),
  State: Joi.any().optional(),
  City: Joi.any().optional(),
  Coordinate: Joi.any().optional(),
  ratings: Joi.any().optional(),
  BankName: Joi.any().optional(),
  AccountNumber: Joi.any().optional(),
  AccountName: Joi.any().optional(),
})

// name : Joi.any().optional(); // for optional entry

class doctorsValidation {
  static async validateCreateDoctors (data: any): Promise<any> {
    const { error, value } = schema.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }

  static async validateCreateDoctors2 (data: any): Promise<any> {
    const { error, value } = schema2.validate(data)
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
      return { result: 'error', message: error.details[0].message }
    }
    return { result: 'success', message: value }
  }
}

export default doctorsValidation

/*
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
 {
    "FirstName" : "",
    "LastName" : "",
    "Phone" : "",
    "Email" : "",
    "Gender" : "",
    "Nationality" : "",
    "State" : "",
    "City" : "",
    "Address" : ""
  }
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE
*/
