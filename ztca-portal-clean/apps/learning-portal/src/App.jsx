import React, { useState } from 'react';
import { BookOpen, CheckSquare, HelpCircle, BookMarked, ArrowRight, Award } from 'lucide-react';

const modules = [
  { id: 1, title: 'What is Zero Trust?', summary: 'Zero Trust is a security model that assumes no implicit trust. Every request must be authenticated, authorized, and encrypted — regardless of where it originates. "Never trust, always verify."' },
  { id: 2, title: 'What is Keycloak?', summary: 'Keycloak is an open-source Identity and Access Management (IAM) solution. It provides Single Sign-On (SSO), user federation, identity brokering, and social login. It issues OIDC tokens containing user claims and group memberships.' },
  { id: 3, title: 'What is Pomerium?', summary: 'Pomerium is an identity-aware reverse proxy that enforces access policies per-route. It checks the user\'s identity (from Keycloak) against configured policies before forwarding requests to upstream applications.' },
  { id: 4, title: 'Authentication vs Authorization', summary: 'Authentication (AuthN) verifies WHO you are — typically via username/password or SSO. Authorization (AuthZ) determines WHAT you can access — based on roles, groups, or policies. Keycloak handles AuthN; Pomerium handles AuthZ.' },
  { id: 5, title: 'Role-Based Access Control (RBAC)', summary: 'RBAC restricts access based on a user\'s assigned role. In ZTCA, Keycloak assigns users to groups (admin, engineer, intern), and Pomerium checks group membership to allow or deny access to each application.' },
  { id: 6, title: 'Why VPN Replacement Matters', summary: 'Traditional VPNs grant broad network access once connected. Zero Trust replaces this with fine-grained, per-application access control. Tools like Tailscale, Cloudflare Tunnel, and Boundary provide secure connectivity without exposing the entire network.' },
];

const quizQuestions = [
  {
    q: 'What is the core principle of Zero Trust?',
    options: ['Trust internal network traffic', 'Never trust, always verify', 'Use VPN for all connections', 'Disable firewalls'],
    answer: 1,
  },
  {
    q: 'Which component handles authentication (identity) in ZTCA?',
    options: ['Pomerium', 'Nginx', 'Keycloak', 'Cloudflare'],
    answer: 2,
  },
  {
    q: 'What does Pomerium do?',
    options: ['Stores passwords', 'Enforces per-route access policies', 'Manages DNS records', 'Runs containers'],
    answer: 1,
  },
  {
    q: 'What token format does Keycloak use for identity claims?',
    options: ['XML', 'SAML only', 'JWT (JSON Web Token)', 'Cookie session ID'],
    answer: 2,
  },
  {
    q: 'In RBAC, access is controlled based on:',
    options: ['IP address only', 'Time of day', 'User roles and group membership', 'File extensions'],
    answer: 2,
  },
];

const glossary = [
  { term: 'Identity Provider (IdP)', def: 'A service that authenticates users and issues identity tokens. In ZTCA, Keycloak acts as the IdP.' },
  { term: 'OIDC (OpenID Connect)', def: 'An authentication protocol built on OAuth 2.0. It allows clients to verify user identity and obtain basic profile information.' },
  { term: 'JWT (JSON Web Token)', def: 'A compact, URL-safe token format containing encoded claims (user info, groups, expiry). Digitally signed by the IdP.' },
  { term: 'Claims', def: 'Pieces of information about a user embedded in a token — such as email, name, group memberships, and roles.' },
  { term: 'Policy', def: 'A rule that determines whether a request is allowed or denied. Pomerium policies check claims against allowed groups per route.' },
  { term: 'Reverse Proxy', def: 'A server that sits in front of applications and forwards client requests. Pomerium is an identity-aware reverse proxy.' },
  { term: '403 Forbidden', def: 'An HTTP status code meaning the server understood the request but refuses to authorize it. Returned when a user lacks the required group membership.' },
];

export default function App() {
  const [completed, setCompleted] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const toggleModule = (id) => setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  const selectAnswer = (qIdx, optIdx) => { if (!submitted) setAnswers(prev => ({ ...prev, [qIdx]: optIdx })); };

  const score = submitted ? quizQuestions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0) : 0;
  const progress = Object.values(completed).filter(Boolean).length;

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1><BookOpen size={18} /> Learning Portal</h1>
        <span className="header-badge">All Users</span>
      </header>

      <main className="app-main">
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '900px', lineHeight: 1.6 }}>
            <strong>Enterprise Context:</strong> Corporate training platforms host onboarding materials, compliance videos, and security awareness tests. This is typically accessible to all employees (Interns to Admins) and serves as an entry-level test of the Zero Trust authentication flow.
          </p>
        </div>
        {/* Zero Trust Flow */}
        <section className="section">
          <h2 className="section-title"><ArrowRight size={18} /> How Zero Trust Access Works</h2>
          <div className="card">
            <p style={{fontSize:'0.82rem',color:'var(--text-muted)',marginBottom:'1rem',textAlign:'center'}}>
              Every request to a protected app follows this path:
            </p>
            <div className="flow-diagram">
              <div className="flow-step">👤 User</div>
              <span className="flow-arrow">→</span>
              <div className="flow-step" style={{borderColor:'var(--blue-600)',color:'var(--blue-600)'}}>Pomerium<br/><small style={{fontSize:'0.65rem',color:'var(--text-muted)'}}>Reverse Proxy</small></div>
              <span className="flow-arrow">→</span>
              <div className="flow-step" style={{borderColor:'var(--warning)',color:'var(--warning)'}}>Keycloak<br/><small style={{fontSize:'0.65rem',color:'var(--text-muted)'}}>Identity Provider</small></div>
              <span className="flow-arrow">→</span>
              <div className="flow-step" style={{borderColor:'var(--success)',color:'var(--success)'}}>Policy ✓<br/><small style={{fontSize:'0.65rem',color:'var(--text-muted)'}}>Group Check</small></div>
              <span className="flow-arrow">→</span>
              <div className="flow-step">🔒 App</div>
            </div>
          </div>
        </section>

        {/* Learning Modules */}
        <section className="section">
          <h2 className="section-title"><CheckSquare size={18} /> Learning Modules</h2>
          <p className="section-subtitle">Progress: {progress}/{modules.length} completed</p>
          <div className="progress-bar" style={{marginBottom:'1.25rem'}}>
            <div className="progress-fill" style={{width:`${(progress/modules.length)*100}%`}} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
            {modules.map(m => (
              <div key={m.id} className="card" style={{padding:'1rem 1.25rem'}}>
                <div className={`checkbox-row ${completed[m.id] ? 'checked' : ''}`}
                  onClick={() => toggleModule(m.id)} style={{padding:0,marginBottom:'0.5rem'}}>
                  <input type="checkbox" checked={!!completed[m.id]} onChange={() => toggleModule(m.id)} />
                  <label style={{fontWeight:600,fontSize:'0.92rem',cursor:'pointer'}}>{m.id}. {m.title}</label>
                </div>
                <p style={{fontSize:'0.82rem',color:'var(--text-muted)',lineHeight:1.6,paddingLeft:'1.75rem'}}>{m.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quiz */}
        <section className="section">
          <h2 className="section-title"><HelpCircle size={18} /> Knowledge Check</h2>
          {submitted && (
            <div className={`alert ${score >= 4 ? 'alert-success' : score >= 3 ? 'alert-warning' : 'alert-warning'}`} style={{marginBottom:'1rem'}}>
              <Award size={16} />
              You scored {score}/{quizQuestions.length} {score === 5 ? '— Perfect!' : score >= 4 ? '— Great job!' : score >= 3 ? '— Good effort!' : '— Keep studying!'}
            </div>
          )}
          {quizQuestions.map((q, qi) => (
            <div key={qi} className="card" style={{marginBottom:'0.75rem',padding:'1.15rem'}}>
              <p style={{fontWeight:500,marginBottom:'0.65rem',fontSize:'0.9rem'}}>{qi+1}. {q.q}</p>
              {q.options.map((opt, oi) => {
                let cls = 'quiz-option';
                if (submitted && oi === q.answer) cls += ' correct';
                else if (submitted && answers[qi] === oi && oi !== q.answer) cls += ' wrong';
                else if (!submitted && answers[qi] === oi) cls += ' selected';
                return (
                  <div key={oi} className={cls} onClick={() => selectAnswer(qi, oi)}>
                    <input type="radio" name={`q${qi}`} checked={answers[qi] === oi} readOnly />
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>
          ))}
          {!submitted ? (
            <button className="btn btn-primary" onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < quizQuestions.length}>
              Submit Quiz
            </button>
          ) : (
            <button className="btn btn-outline" onClick={() => { setAnswers({}); setSubmitted(false); }}>
              Retake Quiz
            </button>
          )}
        </section>

        {/* Glossary */}
        <section className="section">
          <h2 className="section-title"><BookMarked size={18} /> Glossary</h2>
          <div className="grid-2">
            {glossary.map(g => (
              <div key={g.term} className="glossary-card">
                <h4>{g.term}</h4>
                <p>{g.def}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        ZTCA Learning Portal · Zero Trust Training · All Authenticated Users
      </footer>
    </div>
  );
}