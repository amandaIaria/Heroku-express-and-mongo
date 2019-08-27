/**
 * 
 */

module.exports = {
  sendMessage: function (body, res, email) {
    const sendmail = require('sendmail')();
  
    sendmail({
      from: 'no-reply@yourdomain.com',
      to: email,
      subject: 'test sendmail',
      html: body.message,
    }, 
    function(err, reply) {
      console.log(err, reply);
      if(err == null) {
        res.status(200).send('OK');
      }
      else {
        res.status(404).send('Something broke!');
      }
    });
  }
};
