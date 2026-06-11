import React, { useState } from 'react';
import { Shield, Server, FileText, Code, Wrench, BookOpen, ExternalLink, Search, ArrowRight, Lock } from 'lucide-react';

const apps = [
  { name: 'Admin Panel', url: 'https://localhost/admin-panel/', Icon: Shield, access: 'Admin', risk: 'High', riskBadge: 'badge-red', desc: 'Identity and access control. Manage users, groups, and security policies.' },
  { name: 'Server Console', url: 'https://localhost/server-console/', Icon: Server, access: 'Admin', risk: 'Critical', riskBadge: 'badge-red', desc: 'Server operations. Restart services, view sessions, run diagnostics.' },
  { name: 'Audit Logs', url: 'https://localhost/audit-logs/', Icon: FileText, access: 'Admin', risk: 'High', riskBadge: 'badge-yellow', desc: 'Security and compliance audit trail. Review access decisions and events.' },
  { name: 'Dev Dashboard', url: 'https://localhost/dev-dashboard/', Icon: Code, access: 'Admin / Engineer', risk: 'Medium', riskBadge: 'badge-yellow', desc: 'CI/CD pipelines, build status, API health monitoring, and engineering tickets.' },
  { name: 'Internal Tools', url: 'https://localhost/internal-tools/', Icon: Wrench, access: 'Admin / Engineer', risk: 'Medium', riskBadge: 'badge-blue', desc: 'API testing, service registry, environment management, and utilities.' },
  { name: 'Learning Portal', url: 'https://localhost/learning-portal/', Icon: BookOpen, access: 'All Users', risk: 'Low', riskBadge: 'badge-green', desc: 'Zero Trust training modules, quizzes, and security concept glossary.' },
];

const roleMatrix = [
  { role: 'Admin',    portal: true, admin: true,  server: true,  audit: true,  dev: true,  tools: true,  learn: true },
  { role: 'Engineer', portal: true, admin: false, server: false, audit: false, dev: true,  tools: true,  learn: true },
  { role: 'Intern',   portal: true, admin: false, server: false, audit: false, dev: false, tools: false, learn: true },
];

const Check = () => <span style={{color:'var(--success)'}}>✓</span>;
const Cross = () => <span style={{color:'var(--danger)'}}>✗</span>;

export default function App() {
  const [search, setSearch] = useState('');
  const filtered = apps.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.access.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      {/* Big Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">Secure Enterprise Access</span>
          <h1>Your <em>Zero Trust</em><br/>Internal Access Portal</h1>
          <p className="hero-subtitle">
            Identity-verified access to protected company resources,<br/>secured by Pomerium &amp; Keycloak.
          </p>
        </div>
      </section>

      <main className="main-content">
        {/* About Card */}
        <div className="about-card">
          <p>
            This portal simulates a private company application protected by identity-based Zero Trust access. No credentials are handled here — authentication is managed externally by Keycloak and Pomerium.
          </p>
        </div>

        

        {/* App Cards */}
        <section className="section">
          <h2 className="section-title" style={{ justifyContent: 'center' }}>Enterprise Resources</h2>
          <p className="section-subtitle">Select a resource to request access</p>
          <div className="grid-3">
            {filtered.map(app => (
              <div key={app.name} className="resource-card">
                <div className="card-top">
                  <div className="icon-circle">
                    <app.Icon size={20} />
                  </div>
                  <span className={`badge ${app.riskBadge}`}>{app.risk} Risk</span>
                </div>
                <h3>{app.name}</h3>
                <p>{app.desc}</p>
                <div style={{marginBottom:'0.85rem'}}>
                  <span className="badge badge-blue">{app.access}</span>
                </div>
                <a href={app.url} className="btn-open" target="_blank" rel="noopener noreferrer">
                  Open App
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Zero Trust Flow */}
        <section className="section" style={{ marginTop: '4rem' }}>
          <h2 className="section-title" style={{ justifyContent: 'center' }}>Zero Trust Access Flow</h2>
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <p style={{fontSize:'0.82rem',color:'var(--text-muted)',marginBottom:'1rem',textAlign:'center'}}>
              Every request is authenticated and authorized before reaching the application.
            </p>
            <div className="flow-diagram">
              <div className="flow-step">👤 User</div>
              <span className="flow-arrow">→</span>
              <div className="flow-step" style={{borderColor:'var(--blue-500)',color:'var(--blue-600)'}}>Pomerium</div>
              <span className="flow-arrow">→</span>
              <div className="flow-step" style={{borderColor:'var(--gold-400)',color:'var(--warning)'}}>Keycloak</div>
              <span className="flow-arrow">→</span>
              <div className="flow-step" style={{borderColor:'var(--success)',color:'var(--success)'}}>Policy Check</div>
              <span className="flow-arrow">→</span>
              <div className="flow-step">🔒 App</div>
            </div>
          </div>
        </section>

        {/* Role Access Matrix */}
        <section className="section">
          <h2 className="section-title" style={{ justifyContent: 'center' }}>Role Access Matrix</h2>
          <p className="section-subtitle">Access to each app is determined by your Keycloak group membership.</p>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Role</th><th>Portal</th><th>Admin</th><th>Server</th><th>Audit</th><th>Dev</th><th>Tools</th><th>Learning</th>
                </tr>
              </thead>
              <tbody>
                {roleMatrix.map(r => (
                  <tr key={r.role}>
                    <td><span className="badge badge-blue">{r.role}</span></td>
                    <td>{r.portal ? <Check /> : <Cross />}</td>
                    <td>{r.admin ? <Check /> : <Cross />}</td>
                    <td>{r.server ? <Check /> : <Cross />}</td>
                    <td>{r.audit ? <Check /> : <Cross />}</td>
                    <td>{r.dev ? <Check /> : <Cross />}</td>
                    <td>{r.tools ? <Check /> : <Cross />}</td>
                    <td>{r.learn ? <Check /> : <Cross />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Big Branded Footer */}
      <footer className="footer">
        <div className="footer-brand">ZTCA PORTAL</div>
        <p>A Zero Trust Cybersecurity Architecture project — protected by Keycloak, Pomerium, Cloudflare Tunnel &amp; Tailscale.</p>
        <ul className="footer-links">
          <li><a href="#about">About</a></li>
          <li><a href="#security">Security</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </footer>
    </div>
  );
}