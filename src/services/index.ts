import AdminEndpoint from './admin/admin.endpoint'
import AuthEndpoint from './auth/auth.endpoint'
import DoctorsEndpoint from './doctors/doctor.endpoint'
import PatientsEndpoint from './patients/patients.endpoint'

export default [
  ...DoctorsEndpoint,
  ...PatientsEndpoint,
  ...AdminEndpoint,
  ...AuthEndpoint
]
