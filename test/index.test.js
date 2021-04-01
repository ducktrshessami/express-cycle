const express = require("express");
const assert = require("assert");
const cycle = require("..");

const PORT = process.env.PORT || 8080;
const ORIGIN = `http://localhost:${PORT}`;

describe("Router properties", function () {
    it("'origin' is a required property", function (done) {
        try {
            cycle();
        }
        catch {
            done();
        }
        assert(false);
    });
    it("Returns an express router", function () {
        const foo = cycle({ origin: "" });
        const bar = express.Router();
        assert.strictEqual(foo.constructor, bar.constructor);
    });
    it("Stores the used route name in 'cycleRoute' property", function () {
        const route = "/testing";
        const foo = cycle({
            route: route,
            origin: ""
        });
        assert.strictEqual(foo.cycleRoute, route);
    });
    it("Generates a unique route of the specified format (in README)", function () {
        const route = cycle({ origin: "" }).cycleRoute;
        assert(/\/api\/cycle\/[a-f0-9]+/i.test(route))
    });
});

describe(`Testing application on PORT ${PORT}`, function () {
    describe("Looping", function () {
        it("Makes a GET request on start", function (done) {
            const app = express();
            const route = "/test1";
            const router = cycle({
                route: route,
                origin: ORIGIN
            });
            app.get(route, function (req, res) {
                res.status(200).end();
                server.close();
                done();
            });
            let server = app.listen(PORT);
            router.startLoop();
            router.stopLoop();
        });
        it("Repeatedly makes GET requests at specified interval", function (done) {
            const app = express();
            const route = "/test2";
            const router = cycle({
                route: route,
                origin: ORIGIN,
                ms: 20
            });
            let count = 0;
            app.get(route, function (req, res) {
                res.status(200).end();
                if (++count >= 5) {
                    router.stopLoop();
                    server.close();
                    done();
                }
            });
            let server = app.listen(PORT);
            router.startLoop();
        });
    });
});
