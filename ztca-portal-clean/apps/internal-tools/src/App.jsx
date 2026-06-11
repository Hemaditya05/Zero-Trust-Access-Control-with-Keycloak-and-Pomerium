import React, { useState } from 'react';
import { Wrench, Send, Trash2, RefreshCw, Radio, Globe, Database, Server, CheckCircle } from 'lucide-react';

const services = [
  { name: 'main-portal', host: 'main-portal:3000', status: 'healthy', version: 'v1.4.0' },
  { name: 'admin-panel', host: 'admin-panel:3000', status: 'healthy', version: 'v1.4.0' },
  { name: 'auth-service (Keycloak)', host: 'keycloak:8080', status: 'healthy', version: 'v24.0' },
  { name: 'pomerium-proxy', host: 'pomerium:443', status: 'healthy', version: 'v0.26' },
  { name: 'backend-api', host: 'backend:5000', status: 'healthy', version: 'v1.4.0' },
  { name: 'postgres', host: 'db:5432', status: 'degraded', version: 'v16.2' },
];

const fakeResponses = {
  'GET': {
    '/api/resources': { status: 200, body: [{ id: 1, title: 'HR Portal' }, { id: 2, title: 'Engineering Dashboard' }] },
    '/api/health': { status: 200, body: { status: 'ok', uptime: '47d 13h', version: 'v1.4.0' } },
    '/api/users': { status: 200, body: [{ username: 'admin-user', group: 'admin' }] },
  },
  'POST': {
    '/api/resources': { status: 201, body: { message: 'Resource created', id: 5 } },
    '/api/audit': { status: 201, body: { message: 'Audit event logged' } },
  },
  'DELETE': {
    '/api/resources/1': { status: 200, body: { message: 'Resource deleted' } },
  },
  'PUT': {
    '/api/users/1': { status: 200, body: { message: 'User updated', group: 'engineer' } },
  },
};

export default function App() {
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/api/health');
  const [apiResult, setApiResult] = useState(null);
  const [env, setEnv] = useState('dev');
  const [toolOutput, setToolOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendRequest = () => {
    setLoading(true);
    setTimeout(() => {
      const methodResponses = fakeResponses[method] || {};
      const resp = methodResponses[endpoint] || { status: 404, body: { error: 'Not Found', message: `No mock configured for ${method} ${endpoint}` } };
      setApiResult(resp);
      setLoading(false);
    }, 600);
  };

  const runTool = (action) => {
    setToolOutput(`Running: ${action}…`);
    setTimeout(() => {
      const outputs = {
        'Clear Cache': `[${env}] Cache cleared successfully.\n  Redis FLUSHDB: OK\n  CDN cache purge: 12 entries invalidated\n  Response time: 23ms`,
        'Rotate Test Token': `[${env}] Test token rotated.\n  New token: ztca_test_${Math.random().toString(36).slice(2,10)}\n  Expires: ${new Date(Date.now()+3600000).toISOString()}\n  Scope: read:resources`,
        'Ping Service': `[${env}] Pinging all services…\n  main-portal:3000    → 200 OK  (14ms)\n  admin-panel:3000    → 200 OK  (18ms)\n  backend:5000        → 200 OK  (22ms)\n  keycloak:8080       → 200 OK  (45ms)\n  pomerium:443        → 200 OK  (11ms)\n  db:5432             → WARN    (890ms) — high latency`,
      };
      setToolOutput(outputs[action] || 'Done.');
    }, 800);
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1><Wrench size={18} /> Internal Tools</h1>
        <span className="header-badge">Engineer</span>
      </header>

      <main className="app-main">
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '900px', lineHeight: 1.6 }}>
            <strong>Enterprise Context:</strong> Enterprises often host dozens of internal back-office utilities—API testers, staging databases, and environment toggles. Zero Trust ensures that only specific engineering or QA groups can access these sensitive developer resources.
          </p>
        </div>
        {/* Environment Selector */}
        <div className="filter-bar" style={{marginBottom:'1.5rem'}}>
          <Globe size={16} style={{color:'var(--text-muted)'}} />
          <span style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>Environment:</span>
          {['dev','staging','prod'].map(e => (
            <button key={e} className={`btn btn-sm ${env === e ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setEnv(e)}>
              {e}
            </button>
          ))}
        </div>

        {/* API Tester */}
        <section className="section">
          <h2 className="section-title"><Send size={18} /> API Tester</h2>
          <div className="card">
            <div style={{display:'flex',gap:'0.5rem',marginBottom:'1rem',flexWrap:'wrap'}}>
              <select className="select" style={{width:100}} value={method} onChange={e => setMethod(e.target.value)}>
                <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
              </select>
              <input className="input" style={{flex:1,minWidth:200}} placeholder="/api/endpoint"
                value={endpoint} onChange={e => setEndpoint(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendRequest()} />
              <button className="btn btn-primary" onClick={sendRequest} disabled={loading}>
                <Send size={13} /> {loading ? 'Sending…' : 'Send'}
              </button>
            </div>
            {apiResult && (
              <div className="output-box">
                <div style={{color: apiResult.status < 400 ? 'var(--success)' : 'var(--danger)', marginBottom:'0.5rem'}}>
                  HTTP {apiResult.status} {apiResult.status < 400 ? 'OK' : 'Error'}
                </div>
                {JSON.stringify(apiResult.body, null, 2)}
              </div>
            )}
          </div>
        </section>

        {/* Tool Buttons */}
        <section className="section">
          <h2 className="section-title"><Wrench size={18} /> Utilities</h2>
          <div className="card">
            <div style={{display:'flex',gap:'0.5rem',marginBottom:'1rem',flexWrap:'wrap'}}>
              <button className="btn btn-outline" onClick={() => runTool('Clear Cache')}>
                <Trash2 size={13} /> Clear Cache
              </button>
              <button className="btn btn-outline" onClick={() => runTool('Rotate Test Token')}>
                <RefreshCw size={13} /> Rotate Test Token
              </button>
              <button className="btn btn-outline" onClick={() => runTool('Ping Service')}>
                <Radio size={13} /> Ping Service
              </button>
            </div>
            {toolOutput && <div className="output-box">{toolOutput}</div>}
          </div>
        </section>

        {/* Service Registry */}
        <section className="section">
          <h2 className="section-title"><Database size={18} /> Service Registry <span className="badge badge-blue">{env}</span></h2>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Service</th><th>Host</th><th>Status</th><th>Version</th></tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.name}>
                    <td style={{fontWeight:500}}>{s.name}</td>
                    <td><code style={{fontSize:'0.8rem',color:'var(--blue-600)'}}>{s.host}</code></td>
                    <td>
                      <span className={`badge ${s.status==='healthy'?'badge-green':'badge-yellow'}`}>
                        <span className={`status-dot ${s.status==='healthy'?'status-online':'status-warning'}`} />
                        {s.status}
                      </span>
                    </td>
                    <td style={{color:'var(--text-muted)'}}>{s.version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        ZTCA Internal Tools · Utilities &amp; Diagnostics · Admin + Engineer Access
      </footer>
    </div>
  );
}