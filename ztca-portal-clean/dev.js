const { spawn } = require('child_process');
const path = require('path');

const apps = [
  { name: 'main-portal',    port: 3000 },
  { name: 'admin-panel',    port: 3001 },
  { name: 'server-console', port: 3002 },
  { name: 'audit-logs',     port: 3003 },
  { name: 'dev-dashboard',  port: 3004 },
  { name: 'internal-tools', port: 3005 },
  { name: 'learning-portal',port: 3006 },
];

console.log('\n  ZTCA Portal — Starting all apps\n');

for (const app of apps) {
  const cwd = path.join(__dirname, 'apps', app.name);
  const child = spawn('npx', ['vite', '--port', String(app.port)], {
    cwd,
    shell: true,
    stdio: 'pipe',
  });

  child.stdout.on('data', (data) => {
    const line = data.toString().trim();
    if (line.includes('Local:') || line.includes('ready')) {
      console.log(`  ✓ ${app.name.padEnd(18)} → http://localhost:${app.port}`);
    }
  });

  child.stderr.on('data', (data) => {
    const line = data.toString().trim();
    if (line && !line.includes('warn')) {
      console.log(`  ✗ ${app.name}: ${line}`);
    }
  });
}

console.log('\n  Starting backend on port 5000...\n');

const backend = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true,
  stdio: 'inherit',
});

process.on('SIGINT', () => process.exit());
