import DoctorsController from './doctor.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/api/v1/doctors'
const DoctorsEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [DoctorsController.createDoctors]
  },
  {
    path: `${ENDPOINT_URL}/create`,
    method: 'post',
    handler: [DoctorsController.createDoctors2]
  },
  {
    path: `${ENDPOINT_URL}/login`,
    method: 'post',
    handler: [DoctorsController.login]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, DoctorsController.updateDoctors]
  },
  {
    path: `${ENDPOINT_URL}/verify/:email/:token?`,
    method: 'get',
    handler: [DoctorsController.verifyaccount]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [Authorization, DoctorsController.getallDoctors]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [Authorization, DoctorsController.getSingleDoctors]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, DoctorsController.deleteDoctors]
  }
]

export default DoctorsEndpoint
