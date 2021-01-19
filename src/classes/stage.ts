import { Message } from 'discord.js';


export class Stage {
    frameIndex = 0;
    closed = false;
    frames: Array<(msg: Message, stage?: Stage) => void>;
    timeout: number;
    timeoutTime: number;
    timeoutAnswer: (msg: Message, stage?: Stage) => void;

    constructor(frames: Array<(msg: Message, stage?: Stage) => void>, timeoutTime=0, timeoutAnswer=(msg: Message, stage?: Stage) => {}) {
        this.frames = frames;
        this.timeoutTime = timeoutTime;
        this.timeoutAnswer = timeoutAnswer;
    }

    read(msg: Message) {
        if (!this.closed) this.frames[this.frameIndex](msg, this);
        if (this.timeoutTime > 0 && !this.timeout) {
            this.timeout = <any>setTimeout(() => {
                this.timeoutAnswer(msg, this);
            }, this.timeoutTime);
        }
    }

    set index(newIndex: number) {
        this.frameIndex = newIndex;
    }

    get index() {
        return this.frameIndex;
    }

    next() {
        this.frameIndex++;
    }

    back() {
        this.frameIndex--;
    }

    close() {
        this.closed = true;
    }
}