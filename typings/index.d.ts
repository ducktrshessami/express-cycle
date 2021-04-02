declare module "express-cycle" {
    import { Router } from "express";

    function Cycle(options: {
        origin: String,
        route?: String,
        ms?: Number,
        verbose?: Boolean,
        timestamps?: Boolean
    }): Cycler;

    class Cycler extends Router {
        public cycleRoute: String;

        public on(event: "error", error: Error): this;

        public startLoop(milliseconds?: Number): void;
        public stopLoop(): void;
    }

    export = Cycle;
}
