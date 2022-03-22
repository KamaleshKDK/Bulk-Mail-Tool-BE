const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connection = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
let nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;


//database
connection();

//MiddleWares

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Nodeamailer

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.user,
        pass: process.env.pass
    },
});

// API for sending emails

app.post("/mail", async (req, res) => {
    try {
        let connection = await MongoClient.connect(process.env.DB);
        let db = connection.db("Bulk_Mail_Tool");
        await db.collection("Mails").insertOne(req.body);
        connection.close();
        res.json({ message: "Mail Added" })
    } catch (error) {
        console.log(error)
    }
    console.log(req.body.email);
    var email = req.body.email
    var message = req.body.message
    var subject = req.body.subject
    var name = req.body.name

    const mailOptions = {
        from: name,
        to: email,
        subject: subject,
        html: `${message}`
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

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`Listening on port ${port}`));