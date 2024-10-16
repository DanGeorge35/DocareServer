/* eslint-disable @typescript-eslint/no-extraneous-class */
import Joi from 'joi';

const schema = Joi.object({
  FirstName: Joi.string().required().min(1),
  LastName: Joi.string().required().min(1),
  Email: Joi.string().required().min(1),
  Password: Joi.string().required().min(1),
  Phone: Joi.string().optional()
});

const schema2 = Joi.object({
  FirstName: Joi.any().optional(),
  LastName: Joi.any().optional(),
  Phone: Joi.string().optional().min(1),
  Email: Joi.any().optional(),
  Gender: Joi.any().optional(),
  Nationality: Joi.any().optional(),
  State: Joi.any().optional(),
  City: Joi.any().optional(),


  Address: Joi.any().optional()
});

// name : Joi.any().optional(); // for optional entry

class patientsValidation {
  static async validateCreatPatients(data: any): Promise<any> {
    const { error, value } = schema.validate(data);
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '');
      return { result: 'error', message: error.details[0].message };
    }
    return { result: 'success', message: value };
  }

  static async validateCreatPatients2(data: any): Promise<any> {
    const { error, value } = schema2.validate(data);
    if (error != null) {
      error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '');
      return { result: 'error', message: error.details[0].message };
    }
    return { result: 'success', message: value };
  }
}

export default patientsValidation;

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
