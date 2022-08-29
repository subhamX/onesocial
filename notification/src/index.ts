import { readFileSync } from "fs";
import path from "path";
import dotenv from 'dotenv'
import { createClient } from 'redis';

dotenv.config()

var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;


var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDIN_API_KEY;


type EmailPayloadProp = {
    to: string[];
    bcc?: string[];
    cc?: string[];
    replyTo?: string;
    subject: string;
    htmlTemplateName: 'welcome.html';
    additionalData?: Record<string, string>
}

const sendEmail = async ({ to, bcc, cc, replyTo, subject, htmlTemplateName, additionalData }: EmailPayloadProp) => {
    const fetchedHtmlContent = readFileSync(path.resolve(__dirname, "templates", htmlTemplateName), { encoding: "utf-8" })
    try {
        // TODO: Use additionalData to populate the html template using handlebars

        const sendSmtpEmailPayload: Record<string, any> = {
            to: to.map(e => ({ email: e })),
            ...(bcc ? { bcc: bcc.map(e => ({ email: e })) } : {}),
            ...(cc ? { cc: cc.map(e => ({ email: e })) } : {}),
            replyTo: { email: 'idevsubham@gmail.com' },
            htmlContent: fetchedHtmlContent,
            subject: subject,
            sender: {
                name: 'Subham from OneSocial',
                email: "idevsubham@gmail.com"
            }
        }

        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        Object.keys(sendSmtpEmailPayload).forEach(e => {
            sendSmtpEmail[e] = (sendSmtpEmailPayload[e] as any)
        })

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(data);
    } catch (err) {
        console.error("Something went wrong", err)
    }
}



const attachListener = async () => {
    const endpoint = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}`;

    const client = createClient({
        url: endpoint,
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    client.subscribe('notification_event', (jsonMessage: string, channel: string) => {
        const obj = JSON.parse(jsonMessage)
        console.log("Handling event from channel: ", channel, " with data: ", obj)

        if (obj.event_type === 'notification_event:new_user_signup_complete') {
            const { templateName, userEmail } = obj.payload
            const cc = ['idevsubham@gmail.com']
            const replyTo = 'idevsubham@gmail.com'

            sendEmail({
                to: [userEmail],
                htmlTemplateName: templateName,
                subject: 'Welcome to OneSocial! 🎉✨',
                cc,
                replyTo
            })
        } else {
            console.warn("Implementation missing...")
        }
    });

}

attachListener()
