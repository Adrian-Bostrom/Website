import express from 'express';
import { getProject, listProjects } from './db.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.use(express.json());

app.get('/', (request, response) => response.json({
  service: 'adrian-dev-log-api',
  status: 'ok',
  frontend: 'http://localhost:8080',
  health: '/api/health',
  projects: '/api/projects'
}));

const apiRouter = express.Router();

apiRouter.get('/health', (request, response) => response.json({ status: 'ok' }));
apiRouter.get('/projects', (request, response) => response.json({ projects: listProjects() }));
apiRouter.get('/projects/:slug', (request, response) => {
  const project = getProject(request.params.slug);
  if (!project) return response.status(404).json({ error: 'Project not found.' });
  return response.json(project);
});

app.use('/api', apiRouter);
app.use('/', apiRouter);
app.use((request, response) => response.status(404).json({ error: 'Not found.' }));

app.listen(port, '0.0.0.0', () => {
  console.log(`Development log listening on http://0.0.0.0:${port}`);
});