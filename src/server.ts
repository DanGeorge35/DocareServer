import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import errorHandler from './middleware/error';
import endpoints from './services/';
import RouteHelper from './libs/helpers/route.helper';
import setupSocket from './libs/helpers/socket.helper';

const app = express();
const Server =  http.createServer(app);
const io = setupSocket(Server);
dotenv.config();


const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Enable cookies or other credentials
};

app.use(helmet()); // Security first middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors(corsOptions));
// app.use(cookieParser())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.get('/main/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});


// Get the home directory of the current user


app.use(errorHandler);


// SOCKET.IO




try {
  RouteHelper.initRoutes(endpoints, app);
} catch (error) {
  console.error(error);
}

export default Server;
