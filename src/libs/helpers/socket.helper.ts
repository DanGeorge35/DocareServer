import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { Message, User } from './models';

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
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.data.user.username}`);

    // Join a room based on user ID
    socket.join(`user-${socket.data.user.id}`);

    socket.on('directMessage', async ({ content, toUserId }) => {
      const message = await Message.create({
        content,
        fromUserId: socket.data.user.id,
        toUserId,
      });

      const fromUser = await User.findByPk(socket.data.user.id);
      const toUser = await User.findByPk(toUserId);

      if (toUser) {
        io.to(`user-${toUserId}`).emit('directMessage', {
          fromUser: fromUser!.username,
          content: message.content,
          createdAt: message.createdAt,
        });
      }
    });



    socket.on('signal', ({ toUserId, signalData }) => {
      io.to(`user-${toUserId}`).emit('signal', {
        fromUserId: socket.data.user.id,
        signalData,
      });
    });


    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.username}`);
    });
  });

  return io;
};

export default setupSocket;
