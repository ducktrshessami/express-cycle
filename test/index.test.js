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
    it("returns an express router", function () {
        const foo = cycle({ origin: "" });
        const bar = express.Router();
        assert.strictEqual(foo.constructor, bar.constructor);
    });
    it("has 'on' method for error event", function () {
        const foo = cycle({ origin: "" });
        assert(foo.on);
    });
    it("Stores the used route name in 'cycleRoute' property", function () {
        const route = "/testing";
        const foo = cycle({
            route: route,
            origin: ""
        });
        assert.strictEqual(foo.cycleRoute, route);
    });
    it("generates a unique route of the specified format (in README)", function () {
        const route = cycle({ origin: "" }).cycleRoute;
        assert(/\/api\/cycle\/[a-f0-9]+/i.test(route))
    });
});

describe(`Testing application on PORT ${PORT}`, function () {
    describe("Error events", function () {
        it("emits errors as events", function (done) {
            const foo = cycle({ origin: "" });
            foo.on("error", () => {
                foo.stopLoop();
                done();
            });
            foo.startLoop();
        });
        it("status codes other than 200 emit errors", function (done) {
            const app = express();
            const route = "/testerror";
            const router = cycle({
                route: route,
                origin: ORIGIN
            })
            app.get(route, function (req, res) {
                res.status(400).end();
                server.close();
            });
            let server = app.listen(PORT);
            router.on("error", () => {
                router.stopLoop();
                done();
            });
            router.startLoop();
        });
    });
    describe("Looping", function () {
        it("makes a GET request on start", function (done) {
            const app = express();
            const route = "/test1";
            const router = cycle({
                route: route,
                origin: ORIGIN
            });
            app.get(route, function (req, res) {
                res.status(200).end();
                router.stopLoop();
                server.close();
                done();
            });
            let server = app.listen(PORT);
            router.startLoop();
        });
        it("repeatedly makes GET requests at specified interval", function (done) {
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
                if (++count >= 3) {
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
