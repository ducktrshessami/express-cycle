declare module "express-cycle" {
    import { Router } from "express-serve-static-core";

    function Cycle(options: {
        origin: String,
        route?: String,
        ms?: Number,
        verbose?: Boolean,
        timestamps?: Boolean
    }): Cycler;

    interface Cycler extends Router {
        cycleRoute: String;

        on(event: "error", listener: (this: this, error: Error) => void): this;

        startLoop(milliseconds?: Number): void;
        stopLoop(): void;
    }

    export = Cycle;
}
