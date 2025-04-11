'use strict';

import { google } from 'googleapis';
import { Context } from 'koa';

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const getEmailSubject = ({
    name,
    company,
}: EmailRequestBody) => {
    return `[${company}] ${name} 諮詢`;
};

interface EmailRequestBody {
    company: string,
    location: string,
    name: string,
    phone: string,
    email: string,
    message: string
}
const getEmailContent = ({ company, location, name, phone, email, message }: EmailRequestBody) => {
    return `
    公司名稱: ${company}
    地點: ${location}
    姓名: ${name}
    電話: ${phone}
    電子郵件: ${email}
    諮詢訊息: ${message}
    `;
};

module.exports = {
    async send(ctx: Context) {
        const emailRequestBody = ctx.request.body as { data: EmailRequestBody };
        const { data } = emailRequestBody;

        try {
            const emailRepository = new GmailRepository();

            const res = await emailRepository.sendEmail(
                {
                    fromEmail: process.env.GOOGLE_EMAIL,
                    toEmail: process.env.GOOGLE_EMAIL,
                    subject: getEmailSubject(data),
                    content: getEmailContent(data)
                }
            );

            ctx.send({
                message: 'Email sent successfully',
                data: res.data,
            });
        } catch (error) {
            console.error('Error sending email:', error);
            ctx.throw(500, 'Failed to send email');
        }
    },
};

interface SendEmailParams {
    fromEmail: string;
    toEmail: string;
    subject: string;
    content: string;
}
interface EmailRepository {
    sendEmail(params: SendEmailParams): Promise<{ data: any }>;
}

class GmailRepository implements EmailRepository {
    private readonly gmailClient = google.gmail({ version: 'v1', auth: oAuth2Client });

    private encodeSubject(subject: string): string {
        const base64Subject = Buffer.from(subject).toString('base64');
        return `=?utf-8?B?${base64Subject}?=`;
    }

    private buildEmailMessage(params: SendEmailParams): string {
        const emailHeaders = [
            `From: ${params.fromEmail}`,
            `To: ${params.toEmail}`,
            'Content-Type: text/plain; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${this.encodeSubject(params.subject)}`,
            '', // Empty line separates headers from body
            params.content,
        ];

        return emailHeaders.join('\n');
    }

    private encodeMessage(message: string): string {
        return Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    async sendEmail(params: SendEmailParams): Promise<{ data: any }> {
        const rawMessage = this.buildEmailMessage(params);
        const encodedMessage = this.encodeMessage(rawMessage);

        const response = await this.gmailClient.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        return response;
    }
}









