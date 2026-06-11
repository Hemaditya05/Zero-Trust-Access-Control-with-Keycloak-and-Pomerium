import React, { useState } from 'react';
import { Code, Rocket, Activity, CheckCircle, Clock, Loader, AlertCircle, Filter } from 'lucide-react';

const initialPipelines = [
  { id: 'fe', name: 'frontend', branch: 'main', lastBuild: '#247', status: 'success', duration: '2m 14s' },
  { id: 'be', name: 'backend', branch: 'main', lastBuild: '#189', status: 'success', duration: '3m 42s' },
  { id: 'auth', name: 'auth-service', branch: 'develop', lastBuild: '#92', status: 'failed', duration: '1m 08s' },
];

const healthChecks = [
  { name: 'Main Portal API', endpoint: '/api/health', status: 'healthy', latency: '42ms' },
  { name: 'Auth Service', endpoint: '/auth/realms', status: 'healthy', latency: '118ms' },
  { name: 'Pomerium Proxy', endpoint: '/.pomerium/', status: 'healthy', latency: '23ms' },
  { name: 'Database', endpoint: '/db/ping', status: 'degraded', latency: '890ms' },
];

const initialTickets = [
  { id: 'ZTCA-101', title: 'Set up Cloudflare Tunnel for prod', assignee: 'eng-user', status: 'in-progress', priority: 'high' },
  { id: 'ZTCA-102', title: 'Configure Pomerium routes for apps', assignee: 'dev-lead', status: 'done', priority: 'high' },
  { id: 'ZTCA-103', title: 'Add MFA enforcement in Keycloak', assignee: 'sec-admin', status: 'in-progress', priority: 'critical' },
  { id: 'ZTCA-104', title: 'Implement audit log rotation', assignee: 'eng-user', status: 'todo', priority: 'medium' },
  { id: 'ZTCA-105', title: 'Create Grafana monitoring dashboards', assignee: 'dev-lead', status: 'todo', priority: 'low' },
  { id: 'ZTCA-106', title: 'Tailscale ACL configuration', assignee: 'sec-admin', status: 'done', priority: 'medium' },
  { id: 'ZTCA-107', title: 'Write Boundary credential store', assignee: 'eng-user', status: 'in-progress', priority: 'high' },
];

const deployments = [
  { version: 'v1.4.0', env: 'production', time: '2026-06-07 08:00', status: 'success', by: 'dev-lead' },
  { version: 'v1.4.0-rc2', env: 'staging', time: '2026-06-06 16:30', status: 'success', by: 'eng-user' },
  { version: 'v1.4.0-rc1', env: 'staging', time: '2026-06-05 14:15', status: 'failed', by: 'eng-user' },
  { version: 'v1.3.2', env: 'production', time: '2026-06-01 10:00', status: 'success', by: 'dev-lead' },
];

const statusIcon = (s) => {
  if (s === 'success' || s === 'done' || s === 'healthy') return <CheckCircle size={13} />;
  if (s === 'failed' || s === 'degraded') return <AlertCircle size={13} />;
  if (s === 'running' || s === 'in-progress') return <Loader size={13} style={{animation:'spin 1s linear infinite'}} />;
  if (s === 'queued' || s === 'todo') return <Clock size={13} />;
  return <Clock size={13} />;
};

const statusBadge = (s) => {
  if (s === 'success' || s === 'done' || s === 'healthy') return 'badge-green';
  if (s === 'failed' || s === 'degraded' || s === 'critical') return 'badge-red';
  if (s === 'running' || s === 'in-progress' || s === 'queued') return 'badge-yellow';
  if (s === 'high') return 'badge-red';
  if (s === 'medium') return 'badge-yellow';
  if (s === 'low') return 'badge-blue';
  return 'badge-gray';
};

export default function App() {
  const [pipelines, setPipelines] = useState(initialPipelines);
  const [ticketFilter, setTicketFilter] = useState('all');

  const triggerBuild = (id) => {
    setPipelines(prev => prev.map(p => p.id === id ? { ...p, status: 'queued', duration: '—' } : p));
    setTimeout(() => {
      setPipelines(prev => prev.map(p => p.id === id ? { ...p, status: 'running', duration: '0s' } : p));
    }, 800);
    setTimeout(() => {
      setPipelines(prev => prev.map(p => p.id === id ? { ...p, status: 'success', duration: '2m 03s', lastBuild: `#${parseInt(p.lastBuild.slice(1))+1}` } : p));
    }, 3500);
  };

  const filteredTickets = initialTickets.filter(t => ticketFilter === 'all' || t.status === ticketFilter);

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1><Code size={18} /> Dev Dashboard</h1>
        <span className="header-badge">Engineer</span>
      </header>

      <main className="app-main">
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '900px', lineHeight: 1.6 }}>
            <strong>Enterprise Context:</strong> Used by engineering teams to monitor CI/CD pipelines (e.g., GitHub Actions, Jenkins), track infrastructure deployments, and manage operational incidents. In a Zero Trust architecture, developers access this securely without needing a corporate VPN.
          </p>
        </div>
        {/* Build Pipelines */}
        <section className="section">
          <h2 className="section-title"><Rocket size={18} /> Build Pipelines</h2>
          <div className="grid-3">
            {pipelines.map(p => (
              <div key={p.id} className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
                  <h3 style={{fontSize:'0.95rem',fontWeight:600}}>{p.name}</h3>
                  <span className={`badge ${statusBadge(p.status)}`}>{statusIcon(p.status)} {p.status}</span>
                </div>
                <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:'0.75rem'}}>
                  <div>Branch: <code style={{color:'var(--blue-600)'}}>{p.branch}</code></div>
                  <div>Last: {p.lastBuild} · {p.duration}</div>
                </div>
                <button className="btn btn-outline btn-sm btn-block"
                  disabled={p.status === 'running' || p.status === 'queued'}
                  onClick={() => triggerBuild(p.id)}>
                  <Rocket size={13} /> {p.status === 'running' ? 'Building…' : p.status === 'queued' ? 'Queued…' : 'Trigger Build'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* API Health */}
        <section className="section">
          <h2 className="section-title"><Activity size={18} /> API Health Monitor</h2>
          <div className="grid-4">
            {healthChecks.map(h => (
              <div key={h.name} className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.5rem'}}>
                  <span style={{fontSize:'0.85rem',fontWeight:500}}>{h.name}</span>
                  <span className={`badge ${statusBadge(h.status)}`}>{h.status}</span>
                </div>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>
                  <div>{h.endpoint}</div>
                  <div>Latency: {h.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tickets */}
        <section className="section">
          <h2 className="section-title"><Filter size={18} /> Engineering Tickets</h2>
          <div className="filter-bar">
            <span style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>Status:</span>
            {['all','todo','in-progress','done'].map(s => (
              <button key={s} className={`btn btn-sm ${ticketFilter === s ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTicketFilter(s)}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>ID</th><th>Title</th><th>Assignee</th><th>Priority</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filteredTickets.map(t => (
                  <tr key={t.id}>
                    <td><code style={{color:'var(--blue-600)',fontSize:'0.8rem'}}>{t.id}</code></td>
                    <td style={{fontWeight:500}}>{t.title}</td>
                    <td style={{color:'var(--text-muted)'}}>{t.assignee}</td>
                    <td><span className={`badge ${statusBadge(t.priority)}`}>{t.priority}</span></td>
                    <td><span className={`badge ${statusBadge(t.status)}`}>{statusIcon(t.status)} {t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Deployment Timeline */}
        <section className="section">
          <h2 className="section-title"><Clock size={18} /> Deployment Timeline</h2>
          <div className="card">
            {deployments.map((d, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" style={{background: d.status === 'success' ? 'var(--success)' : 'var(--danger)'}} />
                <div className="timeline-content">
                  <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                    <strong style={{fontSize:'0.88rem'}}>{d.version}</strong>
                    <span className={`badge ${statusBadge(d.status)}`}>{d.status}</span>
                    <span className="badge badge-blue">{d.env}</span>
                  </div>
                  <small>{d.time} · by {d.by}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        ZTCA Dev Dashboard · CI/CD &amp; Engineering · Admin + Engineer Access
      </footer>
    </div>
  );
}