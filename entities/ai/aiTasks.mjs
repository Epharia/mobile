import { AIBase } from "./aiBase.mjs";

export class TaskHandler {
    #tasks = []

    /**
     * Adds an entry to the tasks
     * @param {AIBase} task 
     */
    addTask(task) {
        this.#tasks.push(new Entry(task));
    }

    tick() {
        for (let task of this.#tasks) {
            if (task.using && task.action.continueExecuting) {
                task.action.tick();
                return;
            } else if (task.action.shouldExecute) {
                task.action.onStart();
                task.using = true;
            } else if (task.using) {
                task.using = false;
                task.action.onEnd();
            }
        }
    }
}

class Entry {
    constructor(task) {
        this.action = task;
        this.using;
    }
}