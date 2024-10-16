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
    path: `${ENDPOINT_URL}/upload`,
    method: 'post',
    handler: [Authorization, DoctorsController.Upload]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, DoctorsController.updateDoctors]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [DoctorsController.getallDoctors]
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
