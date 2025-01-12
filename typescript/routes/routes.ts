 
import { FastifyInstance } from 'fastify';
import { handleChatRequest } from '../controllers/AI-controller';
import { servePage } from '../controllers/pageController';
import { serve_Quary } from '../controllers/serveQuary-controller';

const chatRoutes = (server: FastifyInstance) => {
    server.post('/chat', handleChatRequest);
    
    server.get('/signup', servePage('signup.html'));

    // Route for /about
    server.get('/about', servePage('home.html'));

    // Route for /
    server.get('/', servePage('index.html'));

    // Route for /AIpage
    server.get('/AIpage', servePage('AI.html'));

    server.get('/projects', servePage('projects.html'))

    server.get('/projects:projectName', serve_Quary('documentation/KahootBot'))

    // this page is shitty may want to update it
    server.setNotFoundHandler(servePage('404notfound.html'))
    
};


export default chatRoutes;