export class AIBase {
    /**
     * start condition
     */
    get shouldExecute() {
        return true;
    }

    /**
     * continue condition 
     */
    get continueExecuting() {
        return this.shouldExecute;
    }

    get isInterruptible() { //TODO
        return true;
    }

    onStart() { }

    onEnd() { }

    tick() { }
}
