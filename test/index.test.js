const express = require("express");
const cycle = require("..");

const app = express();
const PORT = process.env.PORT || 8080;

let server;

before(function (done) {
    server = app.listen(done);
});

after(function () {
    server.close();
})

describe(`Testing application on PORT ${PORT}`, function () {

});
