import * as Boom from '@hapi/boom';
import { Server } from '@hapi/hapi';
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';

async function init() {
    const server = new Server({
        host: '0.0.0.0',
        port: process.env.PORT || 5000,
        routes: { cors: true },
    });

    server.route({
        method: 'GET',
        path: '/{clientId}',
        handler: async (request, h) => {
            const { clientId } = request.params;
            const { code, state, redirect_uri: redirectUrl } = request.query;

            if (typeof clientId !== 'string') {
                throw Boom.badRequest();
            }

            const clientSecret = process.env[clientId];

            if (!clientSecret) {
                throw Boom.notFound(`No secret set for client ID "${clientId}"`);
            }

            if (typeof code !== 'string') {
                throw Boom.badRequest('"code" parameter is required.');
            }

            if (typeof state !== 'undefined' && typeof state !== 'string') {
                throw Boom.badRequest('"state" parameter must be a string.');
            }

            if (typeof redirectUrl !== 'undefined' && typeof redirectUrl !== 'string') {
                throw Boom.badRequest('"redirect_uri" parameter must be a string.');
            }

            const auth = createOAuthAppAuth({
                clientId,
                clientSecret,
            });

            return await auth({
                type: 'token',
                code,
                state,
                redirectUrl,
            });
        },
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();
