 
import { FastifyInstance } from 'fastify';
import { handleChatRequest } from '../controllers/AI-controller';
import Controllers from '../controllers/controllers';

const chatRoutes = (server: FastifyInstance) => {
    let controllers = Controllers.getInstance();
    
    server.post('/chat', controllers.wrapRoute(handleChatRequest));
    
    server.get('/signup', controllers.servePage('signup.html'));

    // Route for /about
    server.get('/about', controllers.servePage('home.html'));

    // Route for /
    server.get('/', controllers.servePage('index.html'));

    // Route for /AIpage
    server.get('/AIpage', controllers.servePage('AI.html'));

    server.get('/projects', controllers.servePage('projects.html'))

    server.get('/projects:projectName', controllers.serveQuary('documentation/KahootBot'))

    // this page is shitty may want to update it
    server.setNotFoundHandler(controllers.servePage('404notfound.html'))
    
};


export default chatRoutes;