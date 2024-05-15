import PatientsController from './patients.controller';
import { Authorization } from '../../libs/utils/app.utility';

const ENDPOINT_URL = '/api/v1/patients';
const PatientsEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [PatientsController.createPatients]
  },
  {
    path: `${ENDPOINT_URL}/create`,
    method: 'post',
    handler: [PatientsController.createPatients2]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, PatientsController.updatePatients]
  },
  {
    path: `${ENDPOINT_URL}/verify/:email/:token?`,
    method: 'get',
    handler: [PatientsController.verifyaccount]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [PatientsController.getallPatients]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [Authorization, PatientsController.getSinglePatients]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'delete',
    handler: [Authorization, PatientsController.deletePatients]
  }
];

export default PatientsEndpoint;
