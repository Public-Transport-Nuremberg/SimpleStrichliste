const { readWebtoken } = require("@lib/cache");
const WebTokenDurationH = parseInt(process.env.WebTokenDurationH, 10) || 24

/**
 * Will check if a Token is valid
 * @param {String} Token Token 
 * @param {String} browser Browser
 * @returns {Promise}
 */
const checkWebToken = function (Token, browser) {
    return new Promise(async (resolve, reject) => {
        try {
            const webtokenRespone = await readWebtoken(Token)
            if (!webtokenRespone) resolve({ State: false, DidExist: false })
            const DBTime = new Date(webtokenRespone.time).getTime() + (WebTokenDurationH * 60 * 60 * 1000)
            //Check if Token isn´t too old (Or if -1 it can´t run out)
            if (DBTime < new Date().getTime() && WebTokenDurationH != -1) resolve({ State: false, DidExist: true })
            //Check if Browser is the same (When debugging with a API Client this will likly fuck you and kill 3h of your time)
            if (browser !== webtokenRespone.browser) resolve({ State: false, DidExist: true })
            resolve({ State: true, Data: webtokenRespone })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    checkWebToken
};