
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (to, subject, content) => {
    try {
        // console.log("MAILTRAP_HOST:", process.env.MAILTRAP_HOST);
        // console.log("MAILTRAP_PORT:", process.env.MAILTRAP_PORT);
        // console.log("MAILTRAP_USERNAME:", process.env.MAILTRAP_USERNAME);
        // console.log("MAILTRAP_PASSWORD:", process.env.MAILTRAP_PASSWORD);

        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAP_PORT), // convert to number
            secure: false,
            auth: {
                user: process.env.MAILTRAP_USERNAME, // fixed
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        await transporter.verify();

        console.log("Server is ready to take messages");

        const info = await transporter.sendMail({
            from: '"Example Team" <team@example.com>', // sender address
            to: to, // list of recipients
            subject: subject, // Subject line
            // text: "Hello world",
            html: content,// HTML body
        });
        console.log("message sent: %s", info.messageId);
    } catch (err) {
        console.log("err from sendmaile :", err)
    }
};
export default sendMail;