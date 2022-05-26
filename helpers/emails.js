
import nodemailer from 'nodemailer';


const emailRegistry = async userData =>{
  const{name, email, token} = userData;
  const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
       //email's info 
        const info = await transport.sendMail({
            from:"'UpTask - Project Admin' <cuentas@uptask.com>",
            to: email,
            subject:"UpTask - confirm your account",
            text:"Confirm your account on UpTask",
            html: `<p>Hi ${name} Confirm your account on UpTask</p> 
                   <p>Your account is almost ready, confirm it on the next link</p>
                   
                   <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Account</a>
                   <p>If you didn't create this account, ignore this email. Thanks!</p>
                `,
        })
}

const emailResetPassword = async userData =>{
    const{name, email, token} = userData;
    
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
       //email's info 
        const info = await transport.sendMail({
            from:"'UpTask - Project Admin' <accounts@uptask.com>",
            to: email,
            subject:"UpTask - Reset your password",
            text:"Reset your password on UpTask",
            html: `<p>Hi ${name} this is confirmation email to reset your password on UpTask</p> 
                   <p>If you want to reset your password confirm your account here</p>
                   <a href="${process.env.FRONTEND_URL}/reset_password/${token}">Go Reset Password</a>
                   <p>If you want to keep your password, ignore this email. Thanks!</p>
                `,
        });
}

export {
    emailRegistry,
    emailResetPassword
}
