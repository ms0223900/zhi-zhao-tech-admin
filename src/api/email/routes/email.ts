'use strict';

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/email/send',
            handler: 'email.send',
            config: {
                // auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};