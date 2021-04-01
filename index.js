const { Router } = require("express");

function getTimeHash(date = new Date()) {

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
