export default new class URLS {

    // ollama
    ollama_internal = 'http://ollama-internal.utility.svc.cluster.local:11434/api/chat';
    ollama_external = 'http://192.168.70.20:30000/api/chat';
    ollama_local = 'http://localhost:11434/api/chat';

    // henrys mac mini 
    

    // kahootbot
    // swarm endpoint: creates a swarm
    kahootbot_internal = 'http://just-another-kahoot-bot-internal.utility.svc.cluster.local:8000/swarm';
    kahootbot_external = 'http://192.168.70.20:30005/swarm';
    kahootbot_local = 'http://127.0.0.1:8000/swarm'
};