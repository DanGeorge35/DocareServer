import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import Message  from '../../models/messages.model';
import AuthUser  from '../../models/auths.model';

const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log("Authentication error")
      return next(new Error('Authentication error'));
    }

    try {
      const decoded :any= jwt.verify(token, process.env.jwtkey!);
      socket.data.user = decoded.data;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.data.user.FirstName}  ${socket.data.user.LastName}`);

    // Join a room based on user ID
    socket.join(`user-${socket.data.user.UserID}`);

    socket.emit('userConnected', {
          name: `${socket.data.user.FirstName}  ${socket.data.user.LastName}`,
          UserID: socket.data.user.UserID
    });


    socket.on('directMessage', async ({ content, toUserID }) => {
      const message = await Message.create({
        content,
        fromUserID: socket.data.user.UserID,
        toUserID,
      });

      const fromUser:any = await AuthUser.findOne({where : {"UserID": socket.data.user.Account.id}});
      const toUser:any  = await AuthUser.findOne({where : {"UserID": toUserID}});



      if (toUser) {
        io.to(`user-${toUserID}`).emit('directMessage', {
          fromUser: `${fromUser!.FirstName} ${fromUser!.LastName}`,
          content: message.content,
          createdAt: message.createdAt,
        });
      }
    });

    socket.on('signal', ({ toUserID, signalData }) => {
      console.log(`Sending signal to ${toUserID}`);

      io.to(`user-${toUserID}`).emit('signal', {
        fromUserID: socket.data.user.UserID,
        signalData,
      });
    });


    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.FirstName}  ${socket.data.user.LastName}`);
    });
  });

  return io;
};

export default setupSocket;
/*
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
*/