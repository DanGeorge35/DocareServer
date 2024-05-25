import { type Response } from 'express'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'response.log' })
  ]
})

interface PaginationData {
  currentPage: number
  totalPages: number
  pageSize: number
}
export interface IResponse {
  success: boolean
  code: number
  message: string
  data: any
  token?: any
  pagination?: PaginationData
}

export const createSuccessResponse = (data?: any, code: number = 200, message: string = 'OK'): IResponse => ({
  success: true,
  code,
  message,
  data
})

export const createErrorResponse = (code: number, message: string) => (
  data?: any
): IResponse => ({
  success: false,
  code,
  message,
  data
})

export const serverError = createErrorResponse(500, 'Internal Server Error')
export const notFound = createErrorResponse(404, 'Not Found')
export const badRequest = createErrorResponse(400, 'Bad Request')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sendResponse = <T extends Response>(res: T, response: IResponse): void => {
  res.status(response.code).json(response)
  response.success ? logger.info(response) : logger.error(response)
}
