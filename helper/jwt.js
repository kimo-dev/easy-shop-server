var { expressjwt: jwt } = require("express-jwt");



function authJWT() {
    const api = process.env.API_URL
    return jwt({
        secret: process.env.secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`,

        ]
    })
}

async function isRevoked(req, token) {
    if(!token.payload.isAdmin){
        return true;
    }
    // done();
}

module.exports = authJWT;