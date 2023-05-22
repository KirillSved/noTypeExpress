const nodemailer = require('nodemailer');
const connection = require("../code/db_one").con;


const transporter = nodemailer.createTransport({
 service: 'gmail',
 host: 'smtp.gmail.com',
 port: 465,
 secure: true,
 auth: {
  user: 'oxblatvedmin@gmail.com',
  pass: 'eejqkwplsxpgnhho',
 },
});
const check4Email = (login) =>{
  return new Promise((resolve, reject) => {
    if (!isEmail(login)) reject(new Error('No valid email'))
    connection.query('SELECT * FROM users WHERE login = ?', login, function (error, results, fields) {
      if (error) {
        reject(new Error('sql error ocurred'))
      } else {
        if (results.length > 0) {
          resolve({login:results[0].login,id:results[0].id_user})
        } else { reject(new Error('login does not exits')) }
      }
    })
  })
}
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

const sendEmail = (email,html,res) => {
 const mailOptions = {
  from: 'oxblatvedmin@gmail.com',
  to: email,
  subject: 'Email verification',
  text:html
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    res.send(error)
    return true;
  } else {
   console.log('Email sent: ' + info.response);
   return false;
  }
 });
};

module.exports = {sendEmail,check4Email};
