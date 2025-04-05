"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new class URLS {
    constructor() {
        // ollama
        this.ollama_internal = 'http://ollama-internal.utility.svc.cluster.local:11434/api/chat';
        this.ollama_external = 'http://192.168.70.20:30000/api/chat';
        this.ollama_local = 'http://localhost:11434/api/chat';
        // henrys mac mini 
        // kahootbot
        // swarm endpoint: creates a swarm
        this.kahootbot_internal = 'http://just-another-kahoot-bot-internal.utility.svc.cluster.local:8000/swarm';
        this.kahootbot_external = 'http://192.168.70.20:30005/swarm';
        this.kahootbot_local = 'http://127.0.0.1:8000/swarm';
    }
};
