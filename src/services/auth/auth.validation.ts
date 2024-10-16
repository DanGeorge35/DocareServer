/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi'

const schema = Joi.object({
  FirstName: Joi.string().required().min(1),
  LastName: Joi.string().required().min(1),
  Email: Joi.string().required().min(1),
  Password: Joi.string().required().min(1)
})
// name : Joi.any().optional(); // for optional entry

class AuthenticationValidation {
  static async validateCreateAccount (data: any): Promise<any> {
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
    :FirstName" : "",
    :LastName" : "",
    :Email" : "",
    "Password" : "",
  }
--------------------------------------------------------- POSTMAN TEST DATA STRUCTURE */
