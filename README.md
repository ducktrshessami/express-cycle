# express-cycle

A boilerplate module to setup a unique route and make a GET request to it on a regular basis

Intended for use with deployments that uncontrollably go to sleep after a period of inactivity

# Installation

```
npm install github:ducktrshessami/express-cycle
```

# Usage

```js
const express = require("express");
const Cycle = require("express-cycle");

const PORT = process.env.PORT;

var app = express();
var cycle = Cycle({ origin: process.env.PUBLIC_URL });

app.use(cycle);
app.listen(PORT, function () {
    cycle.startLoop();
});
```
