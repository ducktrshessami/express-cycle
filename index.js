const { Router } = require("express");
const { createHash } = require("crypto");
const phin = require("phin");

function getTimeHash(date = new Date()) {
    let hash = createHash("sha256");
    return hash.update(date.toISOString())
        .digest("hex");
}

function trimURL(str) {
    str = str.trim();
    return str.endsWith("/") ? trimURL(str.slice(0, -1)) : str;
}

module.exports = function ({
    verbose = false,
    route = "/api/cycle/" + getTimeHash(),
    origin,
    ms = 1200000
} = {}) {
    const router = Router();
    const targetURL = trimURL(origin.trim() + route.trim());

    let interval;

    router.get(route, function (req, res) {
        res.status(200).end();
    });

    function ping() {
        phin({ url: targetURL });
    }

    router.cycleRoute = route;
    router.startLoop = function (milliseconds = ms) {
        ping();
        interval = setInterval(ping, milliseconds);
    };
    router.stopLoop = function () {
        clearInterval(interval);
    };

    return router;
};
