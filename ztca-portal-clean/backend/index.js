const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ── Mock Data ──────────────────────────────── */

const resources = [
  { id: 1, title: 'Admin Panel',       description: 'Identity and access control dashboard.',         accessLevel: 'Admin',    icon: 'Shield',   url: 'https://admin.ztca.local:8443' },
  { id: 2, title: 'Server Console',    description: 'Server operations and diagnostics console.',     accessLevel: 'Admin',    icon: 'Server',   url: 'https://server.ztca.local:8443' },
  { id: 3, title: 'Audit Logs',        description: 'Security audit trail and access events.',        accessLevel: 'Admin',    icon: 'FileText', url: 'https://audit.ztca.local:8443' },
  { id: 4, title: 'Dev Dashboard',     description: 'CI/CD pipelines and engineering tickets.',       accessLevel: 'Engineer', icon: 'Code',     url: 'https://dev.ztca.local:8443' },
  { id: 5, title: 'Internal Tools',    description: 'API testing, service registry, and utilities.',  accessLevel: 'Engineer', icon: 'Wrench',   url: 'https://tools.ztca.local:8443' },
  { id: 6, title: 'Learning Portal',   description: 'Zero Trust training modules and quizzes.',       accessLevel: 'Intern',   icon: 'BookOpen', url: 'https://learn.ztca.local:8443' },
];

const users = [
  { id: 1, username: 'admin-user',  email: 'admin@ztca.local',    group: 'admin',    lastLogin: '2026-06-07 09:15' },
  { id: 2, username: 'eng-user',    email: 'engineer@ztca.local', group: 'engineer', lastLogin: '2026-06-07 08:42' },
  { id: 3, username: 'intern-user', email: 'intern@ztca.local',   group: 'intern',   lastLogin: '2026-06-06 17:30' },
];

const servers = [
  { id: 'web',  name: 'web-server',  ip: '10.0.1.10', status: 'online',  cpu: '42%', mem: '3.2 GB' },
  { id: 'api',  name: 'api-server',  ip: '10.0.1.11', status: 'online',  cpu: '67%', mem: '5.8 GB' },
  { id: 'db',   name: 'db-server',   ip: '10.0.1.12', status: 'warning', cpu: '89%', mem: '14.1 GB' },
  { id: 'auth', name: 'auth-server', ip: '10.0.1.13', status: 'online',  cpu: '31%', mem: '2.1 GB' },
];

/* ── Routes ─────────────────────────────────── */

app.get('/api/resources', (_req, res) => res.json(resources));
app.get('/api/users',     (_req, res) => res.json(users));
app.get('/api/servers',   (_req, res) => res.json(servers));
app.get('/api/health',    (_req, res) => res.json({ status: 'ok', uptime: process.uptime(), version: '1.4.0' }));

app.listen(PORT, () => {
  console.log(`ZTCA Backend API running on port ${PORT}`);
});
