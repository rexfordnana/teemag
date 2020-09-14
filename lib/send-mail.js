import nodemailer from 'nodemailer';
import { childLogger } from './logger.js';

export default class Mail {
  constructor(to) {
    this.PORT = 465;
    this.HOST = 'smtp.gmail.com';
    this.auth = {
      user: process.env.EMAIL || 'teemag2020@gmail.com',
      pass: process.env.EMAIL_PASS || 'Te@mPenny247',
    };
    this.to = to;
    this.log = childLogger({ op: 'sendMail' });
  }

  // async..await is not allowed in global scope, must use a wrapper
  async send() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: this.HOST,
      port: this.PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: this.auth.user, // generated ethereal user
        pass: this.auth.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Rexford Nana 👻" <teemag2020@gmail.com>', // sender address
      to: this.to, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>', // html body
    });

    this.log('Message sent: %s', info.messageId);
  }
  template(){
    return ```
      
    ```
  }
}
