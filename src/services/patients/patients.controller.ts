/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
import {
  getUIDfromDate,
  EncryptPassword,
  GenerateToken,
  CheckPassword,
  SendMail
} from '../../libs/utils/app.utility';
import Patients from '../../models/patients.model';
import Auth from '../../models/auths.model';
import PatientsValidation from './patients.validation';
// import Investments from '../../models/history.model'
import Systems from '../../models/systems.model';
import sequelize from '../../config/db';
import { QueryTypes } from 'sequelize';

class PatientsController {
  static async createPatients(req: any, res: any): Promise<any> {
    try {
      const data = req.body;
      const validate = await PatientsValidation.validateCreatPatients(data);
      if (validate.result === 'error') {
        const result: { code: number; message: string } = {
          code: 400,
          message: validate.message
        };
        return res.status(result.code).send(result);
      }

      const checkExist = await Patients.findOne({ where: { Email: data.Email } });
      if (checkExist !== null) {
        return res.status(400).send({
          message: 'Account Already Exist',
          code: 400
        });
      }

      const DID = getUIDfromDate('PAT');
      data.UserID = DID;
      data.UserType = 'patient';
      const dpaswprd = data.Password ?? DID;

      const account: any = {};
      account.UserID = data.UserID;
      account.FirstName = data.FirstName;
      account.LastName = data.LastName;
      account.Email = data.Email;
      account.Role = data.UserType;
      account.UserType = 'patient';
      account.PasswordHash = await EncryptPassword(dpaswprd);
      account.RefreshToken = account.PasswordHash;
      account.Token = DID;
      account.Verified = '0';
      account.Status = 'Pending';

      const daccount = await Auth.create({ ...account });

      const dPatients = await Patients.create({ ...data });

      dPatients.dataValues.account = daccount;
      // send mail
      const templateParams = {
        to_name: data.FirstName,
        reply_to: 'contact@cadencepub.com',
        subject: 'Welcome to Cadence Investment Platform!',
        message: `
Thank you for expressing interest in investing with Cadence. We are thrilled to have you on board as a potential doctor in our exciting venture.<br>

Your investment journey with Cadence starts now! To complete your investment and unlock exclusive benefits as a Cadence doctor,
<br> please proceed to your account verification  with the link below : <br>
 Link : <a href="https://cadencepub.com/${process.env.NODE_ENV}/api/v1/doctors/verify/${data.Email}/${DID}?">https://cadencepub.com/${process.env.NODE_ENV}/api/v1/doctors/verify/${data.Email}/${DID}?</a><br><br>


<b>Here's what you can expect from your Cadence investment:</b><br>
  <span style="margin-left:20px"><span>  🔹Access to detailed investment information and updates.<br>

  <span style="margin-left:20px"><span>   🔹Regular updates on Cadence's progress and performance.<br>

  <span style="margin-left:20px"><span>   🔹Opportunities to participate in exclusive doctor events and activities.<br>

  <span style="margin-left:20px"><span>   🔹Potential for attractive returns on your investment.<br><br>

Thank you for choosing to invest with Cadence. <br>We look forward to a successful partnership and sharing our journey to success with you.<br>
<br>
Best regards,<br><br>

Ola Daniels<br>
Chief Investment Officer<br>
`,
        to_email: data.Email
      };
      res.status(201).json({ success: true, data: dPatients });
      //  await SendMail(templateParams)
    } catch (error: any) {
      return res.status(400).send({
        message: error.message,
        code: 400
      });
    }
  }

  static async createPatients2(req: any, res: any): Promise<any> {
    try {
      const data = req.body;
      const validate = await PatientsValidation.validateCreatPatients2(data);
      if (validate.result === 'error') {
        const result: { code: number; message: string } = {
          code: 400,
          message: validate.message
        };
        return res.status(result.code).send(result);
      }

      const checkExist = await Patients.findOne({ where: { Email: data.Email } });
      if (checkExist !== null) {
        return res.status(400).send({
          message: 'This Patient  Already Exist',
          code: 400
        });
      }

      const DID = getUIDfromDate('PAT');
      data.UserID = DID;
      data.UserType = 'patient';
      const dpaswprd = data.Password ?? DID;

      const account: any = {};
      account.UserID = data.UserID;
      account.FullName = data.FullName;
      account.Email = data.Email;
      account.Role = data.UserType;
      account.UserType = 'patient';
      account.PasswordHash = await EncryptPassword(dpaswprd);
      account.RefreshToken = account.PasswordHash;
      account.Token = DID;
      account.Verified = '0';

      const daccount = await Auth.create({ ...account });

      const dPatients = await Patients.create({ ...data });

      data.doctorId = data.UserID;

      dPatients.dataValues.account = daccount;
      // send mail
      const templateParams = {
        to_name: data.FullName,
        reply_to: 'info@docare.com',
        subject: 'Welcome to Docare Medical Platform!',
        message: `
Thank you for expressing interest in investing with Cadence. We are thrilled to have you on board as a potential doctor in our exciting venture.<br>

Your investment journey with Cadence starts now! To complete your investment and unlock exclusive benefits as a Cadence doctor,
<br> please proceed to your account verification  with the link below : <br>
 Link : <a href="https://cadencepub.com/${process.env.NODE_ENV}/api/v1/doctors/verify/${data.Email}/${DID}?">https://cadencepub.com/${process.env.NODE_ENV}/api/v1/doctors/verify/${data.Email}/${DID}?</a><br><br>

<b>Here's what you can expect from your Cadence investment:</b><br>
  <span style="margin-left:20px"><span>  🔹Access to detailed investment information and updates.<br>

  <span style="margin-left:20px"><span>   🔹Regular updates on Cadence's progress and performance.<br>

  <span style="margin-left:20px"><span>   🔹Opportunities to participate in exclusive doctor events and activities.<br>

  <span style="margin-left:20px"><span>   🔹Potential for attractive returns on your investment.<br><br>

Thank you for choosing to invest with Cadence. <br>We look forward to a successful partnership and sharing our journey to success with you.<br>
<br>
Best regards,<br><br>

DOCARE SUPPORT TEAM<br>
`,
        to_email: data.Email
      };
      res.status(201).json({ success: true, data: dPatients });
      await SendMail(templateParams);
    } catch (error: any) {
      return res.status(400).send({
        message: error.message,
        code: 400
      });
    }
  }

  static async verifyaccount(req: any, res: any): Promise<any> {
    try {
      const { email, token } = req.params;

      const singlePatients = await Auth.findOne({ where: { Email: email, Token: token } });

      if (singlePatients === null) {
        return res
          .status(400)
          .json({ success: false, data: `No Patient with the id ${req.params.id}` });
      }

      await singlePatients.update({ Verified: '1' });
      // return response as html text
      res.setHeader('Content-Type', 'text/html');
      res.write(`
          <h3>Your account has been verified successfully</h3><br/>
          Please click on this <a href="https://cadencepub.com/signin/">link to login.</a>
        `);
      return res.end();
    } catch (error: any) {
      const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` };
      console.error(error);
      return res.status(400).send(err);
    }
  }

  static async getSinglePatients(req: any, res: any): Promise<any> {
    try {
      const { id } = req.params;

      const singlePatients = await Patients.findOne({ where: { id } });

      if (singlePatients === null) {
        return res.status(400).json({ success: false, data: 'Invalid link' });
      }

      return res.status(200).json({ success: true, data: singlePatients });
    } catch (error: any) {
      const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` };
      console.error(error);
      return res.status(400).send(err);
    }
  }

  static async getallPatients(req: any, res: any): Promise<any> {
    const PAGE_SIZE = 10;

    try {
      let page: number = 1;

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10);
      }

      const allPatientss = await Patients.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      });

      const totalPages = Math.ceil(allPatientss.count / PAGE_SIZE);

      return res.status(200).json({
        success: true,
        data: allPatientss.rows,
        pagination: {
          currentPage: page,
          totalPages,
          pageSize: PAGE_SIZE
        }
      });
    } catch (error: any) {
      const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` };
      console.error(error);
      return res.status(400).send(err);
    }
  }

  /**
   * Update doctor information.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<any>} A Promise that resolves to the response.
   */
  static async updatePatients(req: any, res: any): Promise<any> {
    try {
      let patientId;
      if (req.user.data.Account.UserType === 'patient') {
        if (parseInt(req.params.id) === req.user.data.id) {
          patientId = parseInt(req.params.id);
        } else {
          return res
            .status(401)
            .json({ success: true, message: 'You are not allowed to perform this action!' });
        }
      } else if (req.user.data.Account.UserType === 'Admin') {
        patientId = parseInt(req.params.id);
      } else {
        return res
          .status(401)
          .json({ success: true, message: 'You are not authorized for this action!' });
      }

      const updatedInfo = req.body;

      const patient = await Patients.findByPk(patientId);

      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }

      const updatedPatient = await patient.update(updatedInfo);

      return res
        .status(200)
        .json({ success: true, data: updatedPatient, message: 'Patient information updated' });
    } catch (error: any) {
      const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` };
      console.error(error);
      return res.status(400).send(err);
    }
  }

  static async deletePatients(req: any, res: any): Promise<any> {
    try {
      const doctorsId = req.params.id;

      const doctors = await Patients.findByPk(doctorsId);

      if (!doctors) {
        return res.status(404).json({ success: false, message: 'Patients not found' });
      }
      const dauth = await Auth.findOne({ where: { UserID: doctors.dataValues.UserID } });
      if (dauth) {
        await dauth.destroy();
      }

      await doctors.destroy();

      res.status(200).json({ success: true, message: 'Patient deleted' });
    } catch (error: any) {
      const err = { code: 400, message: `SYSTEM ERROR : ${error.message}` };
      console.error(error);
      return res.status(400).send(err);
    }
  }
}

export default PatientsController;
