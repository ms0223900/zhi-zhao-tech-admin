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

module.exports = {
    async send(ctx: Context) {
        const { name, phone, email } = ctx.request.body;

        try {
            const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

            const utf8Subject = `=?utf-8?B?${Buffer.from('New Contact Form Submission').toString('base64')}?=`;
            const messageParts = [
                `From: ${process.env.GOOGLE_EMAIL}`,
                `To: ${process.env.GOOGLE_EMAIL}`,
                'Content-Type: text/plain; charset=utf-8',
                'MIME-Version: 1.0',
                `Subject: ${utf8Subject}`,
                '',
                `Name: ${name}\nPhone: ${phone}\nEmail: ${email}`,
            ];

            const message = messageParts.join('\n');
            const encodedMessage = Buffer.from(message)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            const res = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage,
                },
            });

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