import React, { useState, useRef } from 'react';
import { Server, RotateCw, Terminal, Activity, Users, AlertTriangle } from 'lucide-react';

const initialServers = [
  { id: 'web', name: 'web-server', ip: '10.0.1.10', status: 'online', cpu: '42%', mem: '3.2 GB' },
  { id: 'api', name: 'api-server', ip: '10.0.1.11', status: 'online', cpu: '67%', mem: '5.8 GB' },
  { id: 'db', name: 'db-server', ip: '10.0.1.12', status: 'warning', cpu: '89%', mem: '14.1 GB' },
  { id: 'auth', name: 'auth-server', ip: '10.0.1.13', status: 'offline', cpu: '0%', mem: '0 GB' },
];

const sessions = [
  { user: 'admin-user', server: 'web-server', type: 'SSH', started: '10:15', duration: '2h 30m' },
  { user: 'eng-user', server: 'api-server', type: 'SSH', started: '11:42', duration: '45m' },
  { user: 'admin-user', server: 'db-server', type: 'RDP', started: '09:00', duration: '3h 15m' },
  { user: 'sec-admin', server: 'auth-server', type: 'SSH', started: '08:30', duration: '4h 00m' },
];

const commandResponses = {
  help: 'Available commands: status, uptime, whoami, df, ping, clear, help',
  status: 'All monitored services: nginx ✓ | node ✓ | postgres ✓ | keycloak ✓ | pomerium ✓',
  uptime: 'Server uptime: 47 days 13:22:05  |  Load average: 0.42 0.38 0.31',
  whoami: 'admin-user@ztca-server (uid=1000, gid=admin)',
  df: 'Filesystem      Size  Used  Avail  Use%\n/dev/sda1       100G   42G    58G   42%\n/dev/sdb1       500G  312G   188G   62%',
  ping: 'PING api-server (10.0.1.11): 64 bytes, icmp_seq=1 ttl=64 time=0.42ms\n--- 3 packets transmitted, 3 received, 0% packet loss ---',
};

export default function App() {
  const [servers, setServers] = useState(initialServers);
  const [consoleLines, setConsoleLines] = useState([{ type: 'system', text: 'ZTCA Server Console v1.0 — Type "help" for available commands.' }]);
  const [cmd, setCmd] = useState('');
  const consoleRef = useRef(null);

  const restartServer = (id) => {
    setServers(prev => prev.map(s => s.id === id ? { ...s, status: 'restarting' } : s));
    setTimeout(() => {
      setServers(prev => prev.map(s => s.id === id ? { ...s, status: 'online', cpu: '12%' } : s));
    }, 2500);
  };

  const runCommand = () => {
    if (!cmd.trim()) return;
    const input = cmd.trim().toLowerCase();
    const newLines = [...consoleLines, { type: 'input', text: `$ ${cmd}` }];

    if (input === 'clear') {
      setConsoleLines([{ type: 'system', text: 'Console cleared.' }]);
    } else {
      const response = commandResponses[input] || `bash: ${input}: command not found. Type "help" for available commands.`;
      newLines.push({ type: 'output', text: response });
      setConsoleLines(newLines);
    }
    setCmd('');
    setTimeout(() => { if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight; }, 50);
  };

  const statusClass = (s) => `status-${s}`;
  const statusColors = { online: 'badge-green', warning: 'badge-yellow', offline: 'badge-red', restarting: 'badge-yellow' };

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1><Server size={18} /> Server Console</h1>
        <span className="header-badge">Admin Only</span>
      </header>

      <main className="app-main">
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '900px', lineHeight: 1.6 }}>
            <strong>Enterprise Context:</strong> In an enterprise environment, this represents privileged access management (PAM) tools or bastion hosts (like HashiCorp Boundary or Teleport). It grants secure, audited SSH/RDP access to production servers without exposing them to the public internet.
          </p>
        </div>
        <div className="alert alert-warning">
          <AlertTriangle size={16} />
          Simulated server console — restart actions update UI state only, no real servers are affected.
        </div>

        {/* Server Cards */}
        <section className="section">
          <h2 className="section-title"><Activity size={18} /> Server Status</h2>
          <div className="grid-4">
            {servers.map(s => (
              <div key={s.id} className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
                  <h3 style={{fontSize:'0.95rem',fontWeight:600}}>{s.name}</h3>
                  <span className={`badge ${statusColors[s.status]}`}>
                    <span className={`status-dot ${statusClass(s.status)}`} />
                    {s.status}
                  </span>
                </div>
                <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:'0.75rem'}}>
                  <div>IP: {s.ip}</div>
                  <div>CPU: {s.cpu} · Mem: {s.mem}</div>
                </div>
                <button
                  className={`btn btn-sm btn-block ${s.status === 'restarting' ? 'btn-warning' : 'btn-outline'}`}
                  disabled={s.status === 'restarting'}
                  onClick={() => restartServer(s.id)}>
                  <RotateCw size={13} className={s.status === 'restarting' ? 'spin' : ''} />
                  {s.status === 'restarting' ? 'Restarting…' : 'Restart Service'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Active Sessions */}
        <section className="section">
          <h2 className="section-title"><Users size={18} /> Active Sessions</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>User</th><th>Server</th><th>Type</th><th>Started</th><th>Duration</th></tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr key={i}>
                    <td style={{fontWeight:500}}>{s.user}</td>
                    <td>{s.server}</td>
                    <td><span className="badge badge-blue">{s.type}</span></td>
                    <td style={{color:'var(--text-muted)'}}>{s.started}</td>
                    <td style={{color:'var(--text-muted)'}}>{s.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Command Console */}
        <section className="section">
          <h2 className="section-title"><Terminal size={18} /> Command Console</h2>
          <div className="console" ref={consoleRef}>
            {consoleLines.map((line, i) => (
              <div key={i} className="console-line" style={{
                color: line.type === 'input' ? 'var(--blue-600)' : line.type === 'system' ? 'var(--text-muted)' : 'var(--success)'
              }}>
                {line.text}
              </div>
            ))}
            <div className="console-input-row">
              <span className="console-prompt">$</span>
              <input className="console-input" placeholder="Type a command…"
                value={cmd} onChange={e => setCmd(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runCommand()} />
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        ZTCA Server Console · Infrastructure Operations · Admin Access Required
      </footer>
    </div>
  );
}