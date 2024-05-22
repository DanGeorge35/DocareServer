/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import dotenv from 'dotenv';
import { type Router } from 'express';

import RateLimit from 'express-rate-limit';

let limiter: any;

dotenv.config();

function rateLimitHandler(req: any, res: any, windowMs: any): void {
  res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
  console.log(`Rate limit exceeded for ip: ${req.ip}`);
  return res.status(429).send({ message: `Rate limit exceeded for ip: ${req.ip}`, code: 429 });
}

class RouteHelper {
  static initRoutes(routes: any[], router: Router): any {
    for (const route of routes) {
      const { method, path, handler } = route;
      (router as any)[method](`${path}`, handler);
    }
    router.get(`/`, (req: any, res: any) => {
      res.setHeader('content-type', 'application/json');
      const report = {
        message: 'You are welcome to Docare',
        code: 201
      };
      res.status(201).send(report);
      res.end()
    });

    router.get('/index.php', (req: any, res: any) => {
      // show an html page from my directory with res.sendfile, set the header to html
      res.setHeader('content-type', 'text/html');
      res.sendfile('./index.html');
      });


    // router.get('/index.php', (req: any, res: any) => {
    //   res.setHeader('content-type', 'application/json');
    //   const report = {
    //     message: 'You are welcome to Docare',
    //     code: 201
    //   };
    //   res.status(201).send(report);
    //   res.end()
    // });


  }


  static getLimiter(): any {
    return limiter;
  }

  static handleRateLimiter(router: any): any {
    limiter = RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      handler(req, res) {
        console.log('here');
        rateLimitHandler(req, res, 15 * 60 * 1000);
      }
    });
    router.use(limiter);
  }
}

export default RouteHelper;
