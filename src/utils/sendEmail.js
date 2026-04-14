import nodemailer from "nodemailer"
import   jwt  from "jsonwebtoken";

// transporter
export const  SendEmail=async({to,subject,html,attachments=[]})=>{ 
const transporter =  nodemailer.createTransport({
  host: "localhost",
  port: 465,
  service:"gmail",
  secure: true, 
  auth: {
    user: process.env.sendEmailUser,
    pass: process.env.sendEmailPassword,
  },
});

// reciever
 // generate  token

 const info = await transporter.sendMail({
    from: ` "E-commerce Application " <${process.env.sendEmailUser}>`, // sender address
    to: to,
    subject: subject,
   // text: text, // Plain-text version of the message
      html:html, // HTML version of the message
      attachments: attachments
  });
console.log(info);  // accepted
if(info.accepted.length > 0) return true
return false

}
