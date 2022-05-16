const nodemailer = require("nodemailer");

function sendEmail(message) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    transporter.sendMail(message, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

exports.sendEmailApplySuccess = function ({ toUser }) {
  const message = {
    from: process.env.GOOGLE_USER,
    to: toUser.email,
    subject: "[ST Software HR] CV Receive Confirmation",
    html: `
            Dear ${toUser.fullname},<br><br>
            Thanks for applying to ST Software. Your application has been received and we will review it right away. <br><br>
            If your application seems like a good fit for the ... position we will contact you soon. <br><br>
            Best regards, <br><br>
            <hr style='border-top: 1px dashed '>
            <p><span style="color: #333333;"><em><span style="font-weight: 400;">** Please note: Do not reply to this email. This email is sent from an unattended mailbox. Replies will not be read.</span></em></span></p> <br><br>
            <hr>
            <p><span style="color: #0000ff;"><strong>(MS) Vien Ta</strong></span></p>
            <p><span style="color: #808080;"><strong>HR Assistant - ST United Ltd.</strong></span></p>
            <p>Mobile (+84)368 492 885<br /><strong>Website:&nbsp;<a href="http://www.stunited.vn/" target="_blank" rel="noopener" data-saferedirecturl="https://www.google.com/url?q=http://www.stunited.vn/&amp;source=gmail&amp;ust=1650606780334000&amp;usg=AOvVaw0q91QHoMBiZiz9Rgd_BnIU">www.stunited.vn</a></strong><strong>| Email:&nbsp;<a href="mailto:ngoc.nguyen@stunited.vn" target="_blank" rel="noopener">tuyendung.stunited@gmail.com</a></strong>&nbsp;<br /><span style="color: #808080; font-family: Verdana, sans-serif;">Head Office: No.14 An Thuong 18th Street, Ngu Hanh Son, Danang, Vietnam.</span></p>
            <p><span style="color: #808080; font-family: Verdana, sans-serif;">Branch: Floor 5th, NAPA Tower, 368 Tran Hung Dao Street, Son Tra, Danang, Vietnam.</span></p>
        `,
  };
  return sendEmail(message);
};

exports.sendEmailRejectCV = function ({ toUser, reason }) {
  const message = {
    from: process.env.GOOGLE_USER,
    to: toUser.email,
    subject: "[ST Software] Thank you letter",
    html: `
            Dear ${toUser.fullname},<br><br>
            <p>Thank you for the interest you&rsquo;ve shown in a career opportunity with our firm.&nbsp;</p>
            <p>We were fortunate to have interviewed a number of applicants with strong backgrounds such as yours, making our selection process difficult. Be assured that your r&eacute;sum&eacute; has received our full attention. While your background is interesting, unfortunately we have no openings that are a match for your skills and experience.&nbsp;</p>
            <p>We would like to again thank you for your interest in our firm and wish you continued success in pursuit of your career objectives.</p>
            <p>Yours truly,</p>
            <hr>
            <p><span style="color: #0000ff;"><strong>(MS) Vien Ta</strong></span></p>
            <p><span style="color: #808080;"><strong>HR Assistant - ST United Ltd.</strong></span></p>
            <p>Mobile (+84)368 492 885<br /><strong>Website:&nbsp;<a href="http://www.stunited.vn/" target="_blank" rel="noopener" data-saferedirecturl="https://www.google.com/url?q=http://www.stunited.vn/&amp;source=gmail&amp;ust=1650606780334000&amp;usg=AOvVaw0q91QHoMBiZiz9Rgd_BnIU">www.stunited.vn</a></strong><strong>| Email:&nbsp;<a href="mailto:ngoc.nguyen@stunited.vn" target="_blank" rel="noopener">tuyendung.stunited@gmail.com</a></strong>&nbsp;<br /><span style="color: #808080; font-family: Verdana, sans-serif;">Head Office: No.14 An Thuong 18th Street, Ngu Hanh Son, Danang, Vietnam.</span></p>
            <p><span style="color: #808080; font-family: Verdana, sans-serif;">Branch: Floor 5th, NAPA Tower, 368 Tran Hung Dao Street, Son Tra, Danang, Vietnam.</span></p>
            `,
  };
  return sendEmail(message);
};

exports.sendEmailRejectPhase = function ({ toUser, reason }) {
  const message = {
    from: process.env.GOOGLE_USER,
    to: toUser.email,
    subject: "[ST Software] Thank you letter",
    html: `
            Dear ${toUser.fullname},<br><br>
            <p><span >Thank you very much for your attendance at our interview for the post of ...</span></p>
              <p><span>We appreciate your interest in our company and the time you&rsquo;ve invested in applying for our opening.</span></p>
              <p><span >After careful consideration, we regret to inform you that you are not the right fit for this position at present.</span></p>
              <p><span >Honestly, our team was impressed by your skills and accomplishments. We think you could be a good fit for other future openings and will reach out again if we find a good match.</span></p>
              <p>&nbsp;</p>
              <p><span >We sincerely wish you success in your career path and your life.</span></p>
              <p><span >Again, thank you for your time.</span></p>
              <p><span >&nbsp;</span></p>
              <p><span >Best regards,&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
              <hr>
              <p><span style="color: #0000ff;"><strong>(MS) Vien Ta</strong></span></p>
              <p><span style="color: #808080;"><strong>HR Assistant - ST United Ltd.</strong></span></p>
              <p>Mobile (+84)368 492 885<br /><strong>Website:&nbsp;<a href="http://www.stunited.vn/" target="_blank" rel="noopener" data-saferedirecturl="https://www.google.com/url?q=http://www.stunited.vn/&amp;source=gmail&amp;ust=1650606780334000&amp;usg=AOvVaw0q91QHoMBiZiz9Rgd_BnIU">www.stunited.vn</a></strong><strong>| Email:&nbsp;<a href="mailto:ngoc.nguyen@stunited.vn" target="_blank" rel="noopener">tuyendung.stunited@gmail.com</a></strong>&nbsp;<br /><span style="color: #808080; font-family: Verdana, sans-serif;">Head Office: No.14 An Thuong 18th Street, Ngu Hanh Son, Danang, Vietnam.</span></p>
              <p><span style="color: #808080; font-family: Verdana, sans-serif;">Branch: Floor 5th, NAPA Tower, 368 Tran Hung Dao Street, Son Tra, Danang, Vietnam.</span></p>
    `,
  };
  return sendEmail(message);
};

exports.sendEmailStatusTest = function ({ toUser, linkDateTime }) {
  const message = {
    from: process.env.GOOGLE_USER,
    to: toUser.email,
    subject: "[ST Software] Invitation to the Recruitment Process",
    html: `
        Dear ${toUser.fullname},<br><br>
        Thank you for your interest in job opportunities at ST United <br><br>
        We would like to invite you to join our recruitment process  at office in Da Nang City, Vietnam. <br>
        <p><strong>DATE &amp; TIME: </strong><em>Please click the link below and select 1 available time</em></p>
        <p><span style="font-weight: 400;">(<a href="${linkDateTime}" target="_blank" rel="noopener">${linkDateTime}</a>)</span></p><br>
        <p><strong>Location: </strong>ST Riverside, 5th Floor, 368 Tran Hung Dao, Son Tra Dist, Danang.</p>
        <p><span>If you have any concerns, please feel free to contact me at the address below.</span></p>
        <p><span >Looking forward to hearing from you soon.</span></p><br>
        <p><span >Thanks and best regards,</span></p><br><br>
        <hr>
            <p><span style="color: #0000ff;"><strong>(MS) Vien Ta</strong></span></p>
            <p><span style="color: #808080;"><strong>HR Assistant - ST United Ltd.</strong></span></p>
            <p>Mobile (+84)368 492 885<br /><strong>Website:&nbsp;<a href="http://www.stunited.vn/" target="_blank" rel="noopener" data-saferedirecturl="https://www.google.com/url?q=http://www.stunited.vn/&amp;source=gmail&amp;ust=1650606780334000&amp;usg=AOvVaw0q91QHoMBiZiz9Rgd_BnIU">www.stunited.vn</a></strong><strong>| Email:&nbsp;<a href="mailto:ngoc.nguyen@stunited.vn" target="_blank" rel="noopener">tuyendung.stunited@gmail.com</a></strong>&nbsp;<br /><span style="color: #808080; font-family: Verdana, sans-serif;">Head Office: No.14 An Thuong 18th Street, Ngu Hanh Son, Danang, Vietnam.</span></p>
            <p><span style="color: #808080; font-family: Verdana, sans-serif;">Branch: Floor 5th, NAPA Tower, 368 Tran Hung Dao Street, Son Tra, Danang, Vietnam.</span></p>
        `,
  };
  return sendEmail(message);
};

exports.sendEmailStatusInterview = function ({ toUser, linkDateTime }) {
  const message = {
    from: process.env.GOOGLE_USER,
    to: toUser.email,
    subject: "[ST United] Invitation to the Recruitment Process",
    html: `
        Dear ${toUser.fullname},<br><br>
        <p>Thank you once again for applying to ST SOFTWARE for ... position.</p>
        <p>We would like to inform you that you have passed the first round of interview and we would like to invite you for a <em>Second Interview</em>. The details are as follows:</p>
        <p><span style="font-weight: 400;">DATE &amp; TIME:&nbsp;</span></p>
        <ul>
        <li aria-level="1"><em>Please click the link below and select 1 available time (Online)</em></li>
        </ul>
        <p>(<a href="${linkDateTime}" target="_blank">${linkDateTime}</a>)</p>
        <p>&nbsp;</p>
        <p>Location: ST Riverside, 5th Floor, 368 Tran Hung Dao, Son Tra Dist., Danang.</p>
        <p>&nbsp;</p>
        <p>If you have any concerns, please feel free to contact me at the address below.</p>
        <p>We are looking forward to meeting with you again.</p>
        <p>&nbsp;</p>
        <p>Thanks and Best Regards,</p><br>
        <hr>
            <p><span style="color: #0000ff;"><strong>(MS) Vien Ta</strong></span></p>
            <p><span style="color: #808080;"><strong>HR Assistant - ST United Ltd.</strong></span></p>
            <p>Mobile (+84)368 492 885<br /><strong>Website:&nbsp;<a href="http://www.stunited.vn/" target="_blank" rel="noopener" data-saferedirecturl="https://www.google.com/url?q=http://www.stunited.vn/&amp;source=gmail&amp;ust=1650606780334000&amp;usg=AOvVaw0q91QHoMBiZiz9Rgd_BnIU">www.stunited.vn</a></strong><strong>| Email:&nbsp;<a href="mailto:ngoc.nguyen@stunited.vn" target="_blank" rel="noopener">tuyendung.stunited@gmail.com</a></strong>&nbsp;<br /><span style="color: #808080; font-family: Verdana, sans-serif;">Head Office: No.14 An Thuong 18th Street, Ngu Hanh Son, Danang, Vietnam.</span></p>
            <p><span style="color: #808080; font-family: Verdana, sans-serif;">Branch: Floor 5th, NAPA Tower, 368 Tran Hung Dao Street, Son Tra, Danang, Vietnam.</span></p>
        `,
  };
  return sendEmail(message);
};

exports.sendEmailStatusPass = function ({ toUser, position }) {
  const message = {
    from: process.env.GOOGLE_USER,
    to: toUser.email,
    subject: "[ST United] Welcome to ST United",
    html: `
        Dear ${toUser.fullname},<br><br>
        <p>We would like to congratulate you on being selected for the ${position} position with ST Software 2022.&nbsp; All of us at ST SOFTWARE are excited that you will be joining our team!</p>
        <p><span >Working Time: 8h30-12h00 and 13h30-17h30 (Monday to Friday)</span></p>
        <p><span >Number of Work Hours Per Week: 40 hours per week</span></p>
        <p><span >Benefits: On a daily basis, we would love to provide training for you about:</span></p>
        <ul>
        <li><span > Frontend (HTML, CSS, JavaScript, ReactJS) Or Backend (PHP, Laravel, Data structure). More opportunities would be available to you for becoming a Full Stack Developer.</span></li>
        <li><span > Working with Scrum/Agile, teamwork</span></li>
        <li><span > Basic to advanced coding skills: Clean Code, Code Dojo, Unit test</span></li>
        <li><span > Stay up-to-date on emerging technologies</span></li>
        <li><span > Posses a logical mindset</span></li>
        <li><span > Be able to write clean code</span></li>
        <li><span > Deep knowledge about database (both relational &amp; NoSQL) &amp; data structure</span></li>
        <li><span > Attend weekly working group staff meetings.</span></li>
        <li><span > Free coffee at the coffee lounge and attend team building.</span></li>
        </ul>
        <p><span >Office Location: You will be working at </span><span >ST Riverside, 5</span><span >th</span><span > Floor, 368 Tran Hung Dao, Son Tra Dist., Danang.</span></p>
        <p><span >Again, congratulations and we look forward to working with you in the near future. If you have any questions regarding the specifics of your ..., feel free to ask us.</span></p>
        <p><span >Note</span><span >:&nbsp;</span></p>
        <ul>
        <li  aria-level="1"><span >To participate in working, you will need to bring your own laptop computer.</span></li>
        <li  aria-level="1"><span >Please confirm this email today </span></li>
        </ul>
        <p><span >Please let us know if you have any questions or concerns.</span></p>
        <p><span >Sincerely,</span></p>
        <hr>
            <p><span style="color: #0000ff;"><strong>(MS) Vien Ta</strong></span></p>
            <p><span style="color: #808080;"><strong>HR Assistant - ST United Ltd.</strong></span></p>
            <p>Mobile (+84)368 492 885<br /><strong>Website:&nbsp;<a href="http://www.stunited.vn/" target="_blank" rel="noopener" data-saferedirecturl="https://www.google.com/url?q=http://www.stunited.vn/&amp;source=gmail&amp;ust=1650606780334000&amp;usg=AOvVaw0q91QHoMBiZiz9Rgd_BnIU">www.stunited.vn</a></strong><strong>| Email:&nbsp;<a href="mailto:ngoc.nguyen@stunited.vn" target="_blank" rel="noopener">tuyendung.stunited@gmail.com</a></strong>&nbsp;<br /><span style="color: #808080; font-family: Verdana, sans-serif;">Head Office: No.14 An Thuong 18th Street, Ngu Hanh Son, Danang, Vietnam.</span></p>
            <p><span style="color: #808080; font-family: Verdana, sans-serif;">Branch: Floor 5th, NAPA Tower, 368 Tran Hung Dao Street, Son Tra, Danang, Vietnam.</span></p>
        `,
  };

  return sendEmail(message);
};

exports.sendResetPassword = function ({ toUser, hash }) {
  const message = {
    from: process.env.GOOGLE_USER,
    to: toUser.email,
    subject: "[ST United] Reset Password",
    html: `
      Dear ${toUser.fullname},<br><br>
      <p>To change password, please click on this link: <a target="_" href="${process.env.DOMAIN}/reset-password/${hash}">Change password here!</a></p>
      <p>Cheers,</p>
      <p>ST United</p>    
    `,
  };

  return sendEmail(message);
};
