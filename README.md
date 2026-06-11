# Zero Trust Cybersecurity Architecture (ZTCA)

This project demonstrates a comprehensive **Zero Trust Architecture** using Keycloak for Identity and Access Management (IAM), Pomerium as an Identity-Aware Proxy (IAP), and a micro-frontend architecture of React portal applications.

## Architecture Overview

All applications are securely isolated inside a private Docker network (`ztca-net`). The **only** way to access the applications is by passing through the Pomerium proxy, which strictly enforces role-based access control (RBAC) policies on every single request.

*   **IAM (Keycloak):** Handles user authentication, issues JWTs, and manages user groups/roles.
*   **Proxy (Pomerium):** Intercepts all traffic on `localhost:443`, validates the user's session with Keycloak, checks their group claims against the YAML policy, and securely routes allowed traffic to the internal Nginx containers.
*   **Applications (React + Vite + Nginx):** Seven distinct micro-frontend dashboards serving various organizational functions.

---

## Getting Started

### 1. Prerequisites
Before running the project, you **must** ensure your Windows `hosts` file is configured correctly so the browser can seamlessly communicate with Keycloak during the login flow.

1. Open Notepad as **Administrator**.
2. Open `C:\Windows\System32\drivers\etc\hosts`.
3. Add the following line (or edit it if it already exists):
   `127.0.0.1 host.docker.internal`
4. Save the file.

### 2. Launch the Infrastructure
First, start the Keycloak IAM server and the Pomerium proxy.
```bash
cd docker
docker-compose up -d
```
*(Keycloak will automatically import the users and roles from `realm-export.json` on boot).*

### 3. Launch the Applications
Next, start the suite of React applications.
```bash
cd ztca-portal-clean
docker-compose up -d --build
```

---

## Accessing the Portals

All access goes through Pomerium via `https://localhost`. 
**Note:** Always include the trailing slash `/` at the end of the URL to prevent Nginx from attempting an insecure redirect.

*   **Main Directory:** [https://localhost/main-portal/](https://localhost/main-portal/)
*   **Admin Panel:** [https://localhost/admin-panel/](https://localhost/admin-panel/)
*   **Server Console:** [https://localhost/server-console/](https://localhost/server-console/)
*   **Audit Logs:** [https://localhost/audit-logs/](https://localhost/audit-logs/)
*   **Dev Dashboard:** [https://localhost/dev-dashboard/](https://localhost/dev-dashboard/)
*   **Internal Tools:** [https://localhost/internal-tools/](https://localhost/internal-tools/)
*   **Learning Portal:** [https://localhost/learning-portal/](https://localhost/learning-portal/)

### Pomerium Session Dashboard
You can view your current Zero Trust session, inspect your JWT claims, or **Sign Out** to test a different user by visiting:
*   [https://localhost/.pomerium/](https://localhost/.pomerium/)

---

## Test Accounts

The Keycloak database is pre-seeded with three test accounts to demonstrate RBAC and Zero Trust policies:

| Username | Password | Group |
| :--- | :--- | :--- |
| `admin` | `admin` | `admin` |
| `engineer` | `engineer` | `engineer` |
| `intern` | `intern` | `intern` |

---

## Zero Trust Policies (`pomerium.yaml`)

Pomerium strictly enforces the following access controls. If a user attempts to access a route they are not authorized for, Pomerium will block the connection at the network edge with a `403 Forbidden` error.

| Application | Authorized Groups |
| :--- | :--- |
| `/admin-panel/` | `admin` |
| `/server-console/` | `admin` |
| `/audit-logs/` | `admin` |
| `/dev-dashboard/` | `admin`, `engineer` |
| `/internal-tools/` | `admin`, `engineer` |
| `/main-portal/` | `admin`, `engineer`, `intern` |
| `/learning-portal/` | `admin`, `engineer`, `intern` |

---

## Troubleshooting

*   **"Hmmm... can't reach this page" (host.docker.internal timeout during login):** Your `hosts` file is missing or has a stale IP address. Ensure `127.0.0.1 host.docker.internal` is set in `C:\Windows\System32\drivers\etc\hosts`.
*   **"ERR_CONNECTION_REFUSED" on port 3000:** You forgot the trailing slash on the URL (e.g., `https://localhost/main-portal`). While we have configured `absolute_redirect off;` in Nginx to mitigate this, adding the slash explicitly is always safer.
*   **MIME type text/html error:** Your browser has aggressively cached an old version of the `index.html` file. Press `Ctrl + Shift + N` to open a new InPrivate Window to bypass the cache.
*   **500 Internal Server Error after login:** The Keycloak database was wiped and not imported. Ensure the Keycloak container in `docker-compose.yml` has the command `start-dev --import-realm`.
