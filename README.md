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

# Documentation

## Class: Cycle

It's just a [**Router**](https://expressjs.com/en/4x/api.html#router) with a GET route set up and a couple extra properties thrown in

### constructor(options)

Ok it's not technically a constructor but you know what I mean

Params:
- `options`: **Object**:
    - `origin`: **String**

        The origin of the deployed app's URL

    - `route`: **String** (optional)

        The route to be generated for the Router and made requests to
        
        If undefined, a route will be generated with the following format:

        ```
        /api/cycle/:sha256hash
        ```

        where `:sha256hash` is the hex hash of the current time

    - `ms`: **Number** (optional)

        The duration of the interval of requests to the specified route

        Defaults to `1200000`, which is 20 minutes

    - `verbose`: **Boolean** (optional)

        If set to true, descriptive messages will be printed to the console

        Errors aren't printed in favor of allowing [`Event: error`]() to be handled

        Defaults to `false`

    - `timestamps`: **Boolean** (optional)

        If set to true, messages from `verbose` will have timestamps

        Defaults to `true`

### Event: error

Emits `error` when pinging the route throws an error

This includes the response having a status code of 400 or above

```js
Cycle.on("error", console.error);
```

### Cycle.cycleRoute

**String**

The path of the route in this Router

Just in case

### Cycle.startLoop(milliseconds)

Begins to ping the specified route at regular intervals

(Call this after [app.listen](https://expressjs.com/en/4x/api.html#app.listen) succeeds)

Params:
- `milliseconds`: **Number** (optional)

    The duration of the interval of requests to the specified route

    Defaults to the value of `ms` in the [constructor]() options

### Cycle.stopLoop()

Clears the interval for pinging the specified route
