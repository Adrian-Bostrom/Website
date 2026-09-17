import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const rootDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDirectory = join(rootDirectory, 'data');
const databasePath = process.env.DATABASE_PATH || join(dataDirectory, 'website.sqlite');

mkdirSync(dirname(databasePath), { recursive: true });

export const database = new DatabaseSync(databasePath);

database.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    number INTEGER NOT NULL,
    status TEXT NOT NULL,
    summary TEXT NOT NULL,
    readme TEXT NOT NULL,
    details TEXT NOT NULL,
    project_page TEXT NOT NULL,
    source_url TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS logs_project_date_idx ON logs(project_id, date DESC);
`);

const projectCount = database.prepare('SELECT COUNT(*) AS count FROM projects').get().count;

if (projectCount === 0) {
  const insertProject = database.prepare(`
    INSERT INTO projects (slug, title, number, status, summary, readme, details, project_page, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertLog = database.prepare('INSERT INTO logs (project_id, date, text) VALUES (?, ?, ?)');

  const projects = [
    {
      slug: 'dev-website',
      title: 'Dev website',
      number: 1,
      status: 'in progress',
      summary: 'An interactive development log built around a playful terminal interface.',
      readme: 'DEV WEBSITE\nAn easily configurable website that hosts my projects and tells you how i developed it. You are most likely reading this on that website, Hello World!\nstatus: in progress',
      details: 'The site uses a command tree, typewriter output, separate project pages, responsive layouts, and dev logs.\nUses HTML, CSS, and JavaScript.\nIdeally I will self host this website, but for now it is hosted on GitHub Pages. If I ever self host it, I will make it far more dynamic as this is statically loaded.',
      projectPage: 'project-one.html',
      sourceUrl: 'https://github.com/Adrian-Bostrom/adrian-bostrom.github.io',
      logs: [{ date: '2026-09-15', text: 'Created this website, a lot of vibe coding. Main struggling was the terminal functionality on the start page and sort of modularity. The struggle with the modularity stems from the fact that it uses GitHub pages which is static.' }]
    },
    {
      slug: 'studyzone',
      title: 'StudyZone',
      number: 2,
      status: 'live',
      summary: 'An AI-powered study planner built from course information in Canvas.',
      readme: 'STUDYZONE\nAn AI-powered study planner built from course information gathered from Canvas through a browser extension.\nstatus: deprecated',
      details: 'StudyZone combines Canvas course data with AI models to create a study planner tailored to specific courses.\nI developed it together with seven other people.\nUses HTML, React, Vue, Vite for the frontend\nUses Node.js, Express, and OpenAI API for the backend',
      projectPage: 'project-two.html',
      sourceUrl: null,
      logs: []
    },
    {
      slug: 'project-three',
      title: 'Project Three',
      number: 3,
      status: 'notes',
      summary: 'A short description that makes people want to look closer.',
      readme: 'PROJECT THREE\nA collection of notes, research, and unfinished directions.\nstatus: notes',
      details: 'A place for questions before they become finished projects.\nSome experiments stay here; others grow into something else.\nstatus: exploring',
      projectPage: 'project-three.html',
      sourceUrl: null,
      logs: []
    }
  ];

  for (const project of projects) {
    const result = insertProject.run(project.slug, project.title, project.number, project.status, project.summary, project.readme, project.details, project.projectPage, project.sourceUrl);
    for (const log of project.logs) insertLog.run(result.lastInsertRowid, log.date, log.text);
  }
}

export const listProjects = () => database.prepare(`
  SELECT slug, title, number, status, summary, readme, details, source_url AS sourceUrl
  FROM projects
  ORDER BY number
`).all();

export const getProject = (slug) => {
  const project = database.prepare(`
    SELECT id, slug, title, number, status, summary, readme, details, source_url AS sourceUrl
    FROM projects
    WHERE slug = ?
  `).get(slug);
  if (!project) return null;
  project.logs = database.prepare('SELECT date, text FROM logs WHERE project_id = ? ORDER BY date DESC, id DESC').all(project.id);
  delete project.id;
  return project;
};