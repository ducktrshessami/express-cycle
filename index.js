const { Router } = require("express");
const { createHash } = require("crypto");
const { request } = require("undici");
const { STATUS_CODES } = require("http");
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

function cycle({
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
        request(targetURL)
            .then(res => {
                log(`Status code ${res.statusCode} from ${targetURL}`);
                if (res.statusCode >= 400) {
                    emitter.emit("error", new Error(`${res.statusCode} ${STATUS_CODES[res.statusCode]}`));
                }
            })
            .catch(err => emitter.emit("error", err));
    }

    function startLoop(milliseconds = ms) {
        log("Starting loop");
        ping();
        interval = setInterval(ping, milliseconds);
    }

    function stopLoop() {
        clearInterval(interval);
        log("Loop stopped");
    }

    function on(eventName, listener) {
        let callback = listener;
        if (typeof listener === "function") {
            callback = listener.bind(router);
        }
        return emitter.on(eventName, callback);
    }

    Object.defineProperties(router, {
        cycleRoute: {
            value: route,
            enumerable: true
        },
        startLoop: {
            value: startLoop,
            enumerable: true
        },
        stopLoop: {
            value: stopLoop,
            enumerable: true
        },
        on: {
            value: on,
            enumerable: true
        }
    });

    return router;
};

module.exports = cycle;
