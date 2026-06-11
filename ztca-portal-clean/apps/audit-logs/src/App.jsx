import React, { useState, useMemo } from 'react';
import { FileText, Search, Download, Filter, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const generateEvents = () => {
  const users = ['admin-user','eng-user','intern-user','dev-lead','sec-admin'];
  const groups = ['admin','engineer','intern','engineer','admin'];
  const resources = ['Admin Panel','Server Console','Dev Dashboard','Learning Portal','Internal Tools','Audit Logs','HR Portal'];
  const decisions = ['allowed','denied'];
  const reasons = {
    allowed: ['Policy matched: group in allowed_groups','Identity verified via Keycloak','Session valid, MFA completed'],
    denied: ['Group not in allowed_groups','Session expired','MFA not completed','Device trust check failed','IP not in allowlist'],
  };
  const events = [];
  const base = new Date('2026-06-07T06:00:00');
  for (let i = 0; i < 40; i++) {
    const uIdx = Math.floor(Math.random()*users.length);
    const decision = Math.random() > 0.35 ? 'allowed' : 'denied';
    const reasonList = reasons[decision];
    events.push({
      id: i+1,
      timestamp: new Date(base.getTime() + i*180000).toISOString().replace('T',' ').slice(0,19),
      user: users[uIdx],
      group: groups[uIdx],
      resource: resources[Math.floor(Math.random()*resources.length)],
      decision,
      reason: reasonList[Math.floor(Math.random()*reasonList.length)],
    });
  }
  return events.reverse();
};

const allEvents = generateEvents();

export default function App() {
  const [search, setSearch] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');

  const filtered = useMemo(() => allEvents.filter(e => {
    const matchSearch = e.user.includes(search.toLowerCase()) || e.resource.toLowerCase().includes(search.toLowerCase());
    const matchDecision = decisionFilter === 'all' || e.decision === decisionFilter;
    const matchGroup = groupFilter === 'all' || e.group === groupFilter;
    return matchSearch && matchDecision && matchGroup;
  }), [search, decisionFilter, groupFilter]);

  const stats = useMemo(() => ({
    total: allEvents.length,
    allowed: allEvents.filter(e=>e.decision==='allowed').length,
    denied: allEvents.filter(e=>e.decision==='denied').length,
    highRisk: allEvents.filter(e=>e.decision==='denied' && e.group==='intern').length,
  }), []);

  const exportCSV = () => {
    const header = 'Timestamp,User,Group,Resource,Decision,Reason';
    const rows = filtered.map(e => `${e.timestamp},${e.user},${e.group},${e.resource},${e.decision},"${e.reason}"`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ztca-audit-logs.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1><FileText size={18} /> Audit Logs</h1>
        <span className="header-badge">Admin Only</span>
      </header>

      <main className="app-main">
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '900px', lineHeight: 1.6 }}>
            <strong>Enterprise Context:</strong> Real-world Security Information and Event Management (SIEM) systems use this to ingest access logs from proxies (like Pomerium) and IdPs (like Keycloak). It is crucial for compliance reporting, threat hunting, and detecting anomalous behavior.
          </p>
        </div>
        {/* Stats */}
        <div className="grid-4" style={{marginBottom:'1.5rem'}}>
          <div className="stat-card">
            <div className="stat-label">Total Events</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Allowed</div>
            <div className="stat-value" style={{color:'var(--success)'}}>{stats.allowed}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Denied</div>
            <div className="stat-value" style={{color:'var(--danger)'}}>{stats.denied}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">High-Risk</div>
            <div className="stat-value" style={{color:'var(--warning)'}}>{stats.highRisk}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <Search size={16} style={{color:'var(--text-muted)',flexShrink:0}} />
          <input className="input" placeholder="Search by user or resource…" style={{flex:1}}
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="select" style={{width:'auto',minWidth:130}} value={decisionFilter} onChange={e => setDecisionFilter(e.target.value)}>
            <option value="all">All Decisions</option>
            <option value="allowed">Allowed</option>
            <option value="denied">Denied</option>
          </select>
          <select className="select" style={{width:'auto',minWidth:130}} value={groupFilter} onChange={e => setGroupFilter(e.target.value)}>
            <option value="all">All Groups</option>
            <option value="admin">Admin</option>
            <option value="engineer">Engineer</option>
            <option value="intern">Intern</option>
          </select>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={13} /> Export CSV
          </button>
        </div>

        {/* Events Table */}
        <section className="section">
          <h2 className="section-title"><Filter size={18} /> Access Events ({filtered.length})</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Timestamp</th><th>User</th><th>Group</th><th>Resource</th><th>Decision</th><th>Reason</th></tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.78rem',color:'var(--text-muted)',whiteSpace:'nowrap'}}>{e.timestamp}</td>
                    <td style={{fontWeight:500}}>{e.user}</td>
                    <td><span className={`badge ${e.group==='admin'?'badge-red':e.group==='engineer'?'badge-blue':'badge-green'}`}>{e.group}</span></td>
                    <td>{e.resource}</td>
                    <td>
                      {e.decision === 'allowed'
                        ? <span className="badge badge-green"><CheckCircle size={11}/> allowed</span>
                        : <span className="badge badge-red"><XCircle size={11}/> denied</span>
                      }
                    </td>
                    <td style={{fontSize:'0.8rem',color:'var(--text-muted)',maxWidth:260}}>{e.reason}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem'}}>No events match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        ZTCA Audit Logs · Security &amp; Compliance · Admin Access Required
      </footer>
    </div>
  );
}