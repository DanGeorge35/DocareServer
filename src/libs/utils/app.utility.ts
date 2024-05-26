import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import axios from 'axios';
import { Fields } from 'formidable';
import dotenv from 'dotenv';
import sharp from 'sharp';

dotenv.config();

const Authorization = (req: any, res: any, next: any): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).send('Not Authorized');

  const JWT_KEY: string = process.env.jwtkey as string;
  jwt.verify(token, JWT_KEY, (err: any, user: any) => {
    if (err) return res.status(401).send('Invalid Token');
    req.user = user;
    next();
  });
};

const GenerateToken = (data: any): string => {
  const JWT_SECRET: string = process.env.jwtkey as string;
  return jwt.sign({ data }, JWT_SECRET, { expiresIn: '30d' });
};

const CheckPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

const EncryptPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('Error encrypting password:', error);
    return password;
  }
};

const SendMailJS = async (templateID: string, templateParams: any): Promise<void> => {
  const options = {
    service_id: process.env.EmailJS_service_id,
    template_id: templateID,
    user_id: process.env.EmailJS_user_id,
    template_params: templateParams,
  };

  const config = {
    method: 'post',
    url: 'https://api.emailjs.com/api/v1.0/email/send',
    data: JSON.stringify(options),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.error(error);
  }
};

const SendMail = async (mail: { to_email: string; to_name: string; subject: string; message: string }): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.EmailHost,
    port: 465,
    secure: true, // Use secure connection (TLS/SSL)
    auth: {
      user: process.env.EmailUser,
      pass: process.env.EmailPassword,
    },
  });

  const htmlMessage = `
<div style="background-color: #479eff;">
    <div style="background-color:#479eff;;text-align:center;padding:20px">
      <img src="https://posaccountant.com/docare-logoblue.jpg" alt="Cadence"  height="70">
    </div>
    <div style="background-color:white;font-size:18px; padding: 50px 35px; color:#55585b; ">
       Dear ${mail.to_name},<br><br>
      ${mail.message}

      <br>
      <div>
  </div>`;

  const mailOptions = {
    from: '"DOCARE" <docare@posaccountant.com>',
    to: mail.to_email,
    subject: mail.subject,
    html: htmlMessage,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error.message);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const adjustFieldsToValue = (fieldsObject: Fields): Record<string, string> => {
  const adjustedFields: Record<string, string> = {};

  for (const fieldName in fieldsObject) {
    if (fieldsObject.hasOwnProperty(fieldName)) {
      const fieldValue = fieldsObject[fieldName]?.[0] ?? ''; // Using optional chaining and nullish coalescing
      adjustedFields[fieldName] = fieldValue;
    }
  }
  return adjustedFields;
};

const RenameUploadFile = (uploadedfile: any, filename: string): string => {
  const oldPath = uploadedfile.filepath;
  const extension = uploadedfile.originalFilename.substring(uploadedfile.originalFilename.lastIndexOf('.'));
  const newPath = `.${filename}${extension}`;
  const publicPath = `${process.env.DOMAIN}/${process.env.NODE_ENV}${filename}${extension}`;
  fs.copyFileSync(oldPath, newPath);
  fs.unlinkSync(oldPath);
  return publicPath;
};

const ProcessUploadImage = async (uploadedfile: any, filename: string): Promise<string> => {
  const oldPath = uploadedfile.filepath;
  const extension = uploadedfile.originalFilename.substring(uploadedfile.originalFilename.lastIndexOf('.'));
  const newPath = `.${filename}${extension}`;

  const image = sharp(oldPath);
  const metadata = await image.metadata();

  if (metadata.width && metadata.height) {
    const newWidth = Math.round(metadata.width * 0.5);
    const newHeight = Math.round(metadata.height * 0.5);

    await image.resize(newWidth, newHeight).toFile(newPath);
    const publicPath = `${process.env.DOMAIN}/${process.env.NODE_ENV}${filename}${extension}`;

    // fs.unlink(oldPath, (err) => {
    //   if (err){console.log(err)}else{
    //   console.log('deleted');}
    // });
    return publicPath;
  }

  throw new Error('Unable to retrieve image dimensions');
};

const getUIDfromDate = (prefix = ''): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  const random = (Math.floor(Math.random() * 9) + 1).toString();
  const uniqueNumber = `${year}${month}${day}${hour}${minute}${second}${random.substring(0, 2)}`;

  return prefix ? prefix + uniqueNumber : `IDN${uniqueNumber}`;
};


function generateOTP() {
  const min = 100000;
  const max = 999999;
  // Generate a random value between min and max (inclusive)
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp;
}

    const SendVerifyToken = async (data:any,token:number) => {
            // send mail
      const mail = {
        to_email: data.Email,
        to_name: data.FirstName,
        subject: 'Welcome to DOCARE Health Support!',
        message: `
Thank you for expressing interest In Docare. We are thrilled to have you on board as a potential doctor in our exciting platform.<br>
<br> please proceed to your account verification  with the OTP below :
 <br><br><b style='font-size: 30px;font-weight: 700;padding: 15px 35px;display: inline-block;background-color: #d6ecff;border-radius: 10px;'>${token}</b>
<br>
<br>
Thank you for choosing DOCARE. <br>We look forward to your successful onboarding<br>
<br>
Best regards,<br>
DOCARE SUPPORT
<br>
`
      };

       await SendMail(mail)

    }



  const SendAccountVerified = async (data:any) => {
            // send mail
      const mail = {
        to_email: data.Email,
        to_name: data.FirstName,
        subject: 'Email Successfully Verified!',
        message: `
Your email is successfully verified. You can login now!<br><br>
Best regards,<br>
DOCARE SUPPORT
<br>
`
      };

       await SendMail(mail)

    }


export {
  SendAccountVerified,
  SendVerifyToken,
  Authorization,
  GenerateToken,
  EncryptPassword,
  CheckPassword,
  RenameUploadFile,
  adjustFieldsToValue,
  getUIDfromDate,
  SendMail,
  SendMailJS,
  ProcessUploadImage,
  generateOTP
};
