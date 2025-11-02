export class TaskHandler {

    #tasks = []
    #executing = []

    add(action, priority = 0) {
        const entry = new Entry(action, priority);
        this.#tasks.push(entry);
    }

    #start(task) {
        task.start();
        this.#executing.push(task);
    }
    #end(task) {
        const idx = this.#executing.indexOf(task);
        if (idx !== -1) this.#executing.splice(idx, 1);
        task.end();
    }
    #interrupt(task, byTask) {
        const idx = this.#executing.indexOf(task);
        if (idx !== -1) this.#executing.splice(idx, 1);
        task.interrupt(byTask);
    }

    tick() {
        const tasks = this.#tasks.filter(e => !e.running && e.action.shouldExecute);
        tasks.sort((a, b) => b.priority - a.priority);

        for (const t of tasks) {
            const conflicts = this.#executing.filter(e => !t.isCompatibleWith(e));
            if (conflicts.length === 0) {
                this.#start(t);
                continue;
            }

            const canPreempt = conflicts.every(e => e.action.isInterruptable && t.priority < e.priority);
            if (canPreempt) {
                for (const e of conflicts) this.#interrupt(e, t);
                this.#start(t);
            }
        }

        for (const t of this.#executing) {
            if (!t.action.shouldContinue) {
                this.#end(t);
            }
        }

        for (const t of this.#executing) {
            t.action.tick();
        }
    }
}

class Entry {
    constructor(action, priority) {
        this.priority = priority;
        this.action = action;
        this.running = false;
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.action.onStart();
    }

    end() {
        if (!this.running) return;
        this.running = false;
        this.action.onEnd();
    }

    interrupt(byTask) {
        if (!this.running) return;
        this.action.onInterrupt(byTask);
        this.end();
    }

    isCompatibleWith(other) {
        return (this.action.flags & other.action.flags) === 0;
    }
}