const express = require("express");
let nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const creds = require("./credential.json");
const cors = require("cors");

//Initiate Express and CORS and Body Parser

let app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Nodeamailer

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: creds.auth.user,
        pass: creds.auth.pass
    },
});

// api for sending emails

app.post("/mail", (req, res, next) => {
    console.log(req.body.email);
    var email = req.body.email
    var message = req.body.message
    var subject = req.body.subject
    var name = req.body.name
  
    const mailOptions = {
        from: name,
        to: email,
        subject: subject,
        html: `<br /> ${message}`
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            res.json({
                status: "err"
            })
            console.log(err);
        } else {
            res.json({
                status: "Success"
            })
            console.log("Email Sent" + data.response)
        }
    })
})

// Just verify the mails to send

transporter.verify(function (err, success) {
    if (err) {
        console.log(err);
    } else {
        console.log("Server is Ready to Take the Emails");
    }
})

// PORT Listening

const PORT = process.env.PORT || 3030
app.listen(PORT, () => console.info("Server has Started", PORT))