const { Router } = require("express");
const { createHash } = require("crypto");
const phin = require("phin");
const EventEmitter = require("events");
const assert = require("assert");

function getTimeHash(date = new Date()) {
    let hash = createHash("sha256");
    return hash.update(date.toISOString())
        .digest("hex");
}

function trimStartURL(str) {
    str = str.trim();
    return str.startsWith("/") ? trimStartURL(str.slice(1)) : str;
}

function trimEndURL(str) {
    str = str.trim();
    return str.endsWith("/") ? trimEndURL(str.slice(0, -1)) : str;
}

module.exports = function ({
    origin,
    route = "/api/cycle/" + getTimeHash(),
    ms = 1200000,
    verbose = false,
    timestamps = true,
} = {}) {
    assert.notStrictEqual(origin, undefined);

    const router = Router();
    const emitter = new EventEmitter();
    const targetURL = trimEndURL(origin) + "/" + trimEndURL(trimStartURL(route));

    let interval;

    router.get(route, function (req, res) {
        res.status(200).end();
    });

    function log(message) {
        if (verbose) {
            message = message.trim();
            if (timestamps) {
                console.log("[%s]: %s", (new Date).toISOString(), message);
            }
            else {
                console.log(message);
            }
        }
    }

    function ping() {
        log(`Pinging ${targetURL}`);
        phin({ url: targetURL })
            .then(res => {
                log(`Status code ${res.statusCode} from ${targetURL}`);
                if (res.statusCode !== 200) {
                    emitter.emit("error", new Error(res.statusMessage));
                }
            })
            .catch(err => emitter.emit("error", err));
    }

    router.cycleRoute = route;
    router.startLoop = function (milliseconds = ms) {
        log("Starting loop");
        ping();
        interval = setInterval(ping, milliseconds);
    };
    router.stopLoop = function () {
        clearInterval(interval);
        log("Loop stopped");
    };
    router.on = (...params) => emitter.on(...params);

    return router;
};
