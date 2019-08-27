/**
 * 
 */

module.exports = {
  sendMessage: function (body, res, email, noreply) {
    const sendmail = require('sendmail')();
  
    sendmail({
      from: noreply,
      to: email,
      subject: 'Someone is trying to contact you - ' + body.subject,
      html: "You've recieced a message.<br>" + body.message + "<br>From: "+ body.from,
    }, 
    function(err, reply) {
      if(err == null) {
        sendmail({
          from: noreply,
          to: body.from,
          subject: 'Thanks for getting in touch with me',
          html: "Thanks for getting in touch with me. I'll respond when I can. <br> -Amanda <br>Your Message:<br> " + body.message,
        }, 
        function(err, reply) {
          if(err == null) {
            res.sendStatus(200);
          }
          else {
            res.sendStatus(404);
          }
        });
      }
      else {
        res.status(500).send('Something broke!');
      }
    });
  }
};
