const { Router } = require("express");
const { createHash } = require("crypto");

function getTimeHash(date = new Date()) {
    let hash = createHash("sha256");
    return hash.update(date.toISOString())
        .digest("hex");
}

module.exports = function (options = {
    verbose: false,
    route: "/api/cycle/" + getTimeHash()
}) {
    const router = Router();

    router.get(options.route, function (req, res) {
        res.status(200).end();
    });

    return router;
};
