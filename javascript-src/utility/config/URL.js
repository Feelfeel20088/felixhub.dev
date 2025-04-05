"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new class URLS {
    constructor() {
        this.ollama_internal = 'http://ollama-internal.utility.svc.cluster.local:11434/api/chat';
        this.ollama_external = 'http://192.168.70.20:30000/api/chat';
        this.ollama_local = 'http://localhost:11434/api/chat';
    }
};
