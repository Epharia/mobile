export class AIBase {
    /**
     * [0: none], 
     * [1: movement],
     * [2: attack]
     */
    flags = 0;

    /**
     * start condition
     */
    get shouldExecute() {
        return true;
    }

    /**
     * continue condition 
     */
    get shouldContinue() {
        return this.shouldExecute;
    }

    get isInterruptable() {
        return true;
    }

    onStart() { }

    onEnd() { }

    onInterrupt() { }

    tick() {/* override in subclass */ }
}
