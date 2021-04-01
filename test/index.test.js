const express = require("express");
const phin = require("phin");
const assert = require("assert");
const cycle = require("..");

const app = express();
const PORT = process.env.PORT || 8080;

let server;

describe("Router properties", function () {
    it("Returns an express router", function () {
        const foo = cycle();
        const bar = express.Router();
        assert.strictEqual(foo.constructor, bar.constructor);
    });
    it("Stores the used route name in 'cycleRoute' property", function () {
        const route = "/testing";
        const foo = cycle({ route: route });
        assert.strictEqual(foo.cycleRoute, route);
    });
    it("Generates a unique route of the specified format (in README)", function () {
        const route = cycle().cycleRoute;
        assert(/\/api\/cycle\/[a-f0-9]+/i.test(route))
    });
});

describe(`Testing application on PORT ${PORT}`, function () {
    before(function (done) {
        server = app.listen(done);
    });
    after(function () {
        server.close();
    });
});
