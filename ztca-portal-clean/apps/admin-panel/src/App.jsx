import React, { useState } from 'react';
import { Shield, Search, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const initialUsers = [
  { id: 1, username: 'admin-user', email: 'admin@ztca.local', group: 'admin', lastLogin: '2026-06-07 09:15' },
  { id: 2, username: 'eng-user', email: 'engineer@ztca.local', group: 'engineer', lastLogin: '2026-06-07 08:42' },
  { id: 3, username: 'intern-user', email: 'intern@ztca.local', group: 'intern', lastLogin: '2026-06-06 17:30' },
  { id: 4, username: 'dev-lead', email: 'devlead@ztca.local', group: 'engineer', lastLogin: '2026-06-07 10:01' },
  { id: 5, username: 'sec-admin', email: 'security@ztca.local', group: 'admin', lastLogin: '2026-06-07 07:55' },
];

const policies = [
  { name: 'Admin Panel Access', target: '/admin', allowed: 'admin group only', status: 'active' },
  { name: 'Server Console Access', target: '/server', allowed: 'admin group only', status: 'active' },
  { name: 'Dev Dashboard Access', target: '/dev', allowed: 'admin, engineer', status: 'active' },
  { name: 'Learning Portal Access', target: '/learn', allowed: 'all authenticated', status: 'active' },
];

const groupColors = { admin: 'badge-red', engineer: 'badge-blue', intern: 'badge-green' };

export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [pendingChanges, setPendingChanges] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchGroup = filterGroup === 'all' || u.group === filterGroup;
    return matchSearch && matchGroup;
  });

  const handleGroupChange = (id, newGroup) => {
    setPendingChanges(prev => ({ ...prev, [id]: newGroup }));
  };

  const applyChange = (id) => {
    const newGroup = pendingChanges[id];
    if (!newGroup) return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, group: newGroup } : u));
    setPendingChanges(prev => { const n = { ...prev }; delete n[id]; return n; });
    showToast(`Role updated for user ${users.find(u => u.id === id)?.username}`);
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1><Shield size={18} /> Admin Panel</h1>
        <span className="header-badge">Admin Only</span>
      </header>

      <main className="app-main">
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '900px', lineHeight: 1.6 }}>
            <strong>Enterprise Context:</strong> In a real-world enterprise, this panel connects to Identity Providers (like Active Directory or Okta) to manage employee lifecycles. It controls role-based access control (RBAC), provisions accounts, and enforces security policies across the organization.
          </p>
        </div>
        {/* Warning */}
        <div className="alert alert-warning">
          {/* <AlertTriangle size={16} /> */}
          Simulated admin actions — no real backend mutations occur. Changes update UI state only.
        </div>

        {/* Toast */}
        {toast && (
          <div className="alert alert-success">
            <CheckCircle size={16} /> {toast}
          </div>
        )}

        {/* Stats */}
        <div className="grid-4" style={{marginBottom:'1.5rem'}}>
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{users.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Admins</div>
            <div className="stat-value" style={{color:'var(--danger)'}}>{users.filter(u=>u.group==='admin').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Engineers</div>
            <div className="stat-value" style={{color:'var(--blue-600)'}}>{users.filter(u=>u.group==='engineer').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Interns</div>
            <div className="stat-value" style={{color:'var(--success)'}}>{users.filter(u=>u.group==='intern').length}</div>
          </div>
        </div>

        {/* User Management */}
        <section className="section">
          <h2 className="section-title"><Users size={18} /> User Management</h2>

          <div className="filter-bar">
            <Search size={16} style={{color:'var(--text-muted)',flexShrink:0}} />
            <input className="input" placeholder="Search by username or email…" style={{flex:1}}
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="select" style={{width:'auto',minWidth:140}} value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
              <option value="all">All Groups</option>
              <option value="admin">Admin</option>
              <option value="engineer">Engineer</option>
              <option value="intern">Intern</option>
            </select>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Username</th><th>Email</th><th>Current Group</th><th>Change Group</th><th>Action</th><th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td style={{fontWeight:500}}>{u.username}</td>
                    <td style={{color:'var(--text-muted)'}}>{u.email}</td>
                    <td><span className={`badge ${groupColors[u.group]}`}>{u.group}</span></td>
                    <td>
                      <select className="select" style={{width:130,padding:'0.3rem 0.5rem',fontSize:'0.8rem'}}
                        value={pendingChanges[u.id] || u.group}
                        onChange={e => handleGroupChange(u.id, e.target.value)}>
                        <option value="admin">admin</option>
                        <option value="engineer">engineer</option>
                        <option value="intern">intern</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm"
                        disabled={!pendingChanges[u.id] || pendingChanges[u.id] === u.group}
                        onClick={() => applyChange(u.id)}>
                        Apply
                      </button>
                    </td>
                    <td style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{u.lastLogin}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem'}}>No users match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Policies */}
        <section className="section">
          <h2 className="section-title"><Shield size={18} /> Pomerium Policy Summary</h2>
          <div className="grid-2">
            {policies.map(p => (
              <div key={p.name} className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.5rem'}}>
                  <h3 style={{fontSize:'0.95rem',fontWeight:600}}>{p.name}</h3>
                  <span className="badge badge-green">{p.status}</span>
                </div>
                <p style={{fontSize:'0.82rem',color:'var(--text-muted)',marginBottom:'0.25rem'}}>
                  Route: <code style={{color:'var(--blue-600)'}}>{p.target}</code>
                </p>
                <p style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>
                  Allowed: {p.allowed}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        ZTCA Admin Panel · Identity &amp; Access Management · Keycloak + Pomerium
      </footer>
    </div>
  );
}