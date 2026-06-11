# Keycloak UI Configuration Guide

If you ever want to build the `ztca` realm from scratch using the **Keycloak Admin Console** (instead of relying on the auto-import `realm-export.json`), here is the comprehensive, step-by-step guide. 

This guide uses the **New Keycloak UI** (introduced in v19+ and used in v21+).

---

## 1. Access the Admin Console
1. Navigate to **`http://localhost:8080/admin`** in your browser.
2. Log in using the master credentials defined in your `docker-compose.yml`:
   * **Username:** `admin`
   * **Password:** `admin`

---

## 2. Create the `ztca` Realm
By default, you are in the `master` realm. You must create a new isolated realm for the project.
1. In the top-left corner, click the dropdown that says **Master**.
2. Click **Create Realm**.
3. In the **Realm name** field, type `ztca`.
4. Click **Create**.

*Make sure "ztca" is selected in the top-left dropdown before continuing!*

---

## 3. Create the Groups
We need three groups to map to our Pomerium Zero Trust policies.
1. On the left sidebar, click **Groups**.
2. Click **Create group**.
3. Enter `admin` and click **Create**.
4. Repeat this process to create the `engineer` and `intern` groups.

---

## 4. Create the Users
Now we will create the three test users.
1. On the left sidebar, click **Users**.
2. Click **Add user**.
3. **Username:** `admin`
4. Toggle **Email verified** to **ON**.
5. Click **Create**.

**Set the Password:**
1. After the user is created, click on the **Credentials** tab at the top.
2. Click **Set password**.
3. Type `admin` in both fields.
4. Toggle **Temporary** to **OFF** (so it doesn't force a password reset on first login).
5. Click **Save** -> **Save password**.

**Assign the User to a Group:**
1. Click the **Groups** tab at the top of the user's profile.
2. Click **Join Group**.
3. Check the box next to `admin` and click **Join**.

*(Repeat the User Creation process for `engineer` and `intern`)*

---

## 5. Create the Pomerium Client
Pomerium needs a secure Client ID and Secret to negotiate logins with Keycloak.
1. On the left sidebar, click **Clients**.
2. Click **Create client**.
3. **Client ID:** `ztca-client`
4. Click **Next**.
5. **Client authentication:** Toggle this to **ON**. *(This changes it from a Public to a Confidential client, generating a Client Secret).*
6. **Authentication flow:** Ensure `Standard flow` and `Direct access grants` are checked.
7. Click **Next**.
8. **Valid redirect URIs:** Type `*` and press Enter to add it. *(In production, this should be explicitly set to `https://localhost/.pomerium/callback`).*
9. Click **Save**.

---

## 6. Configure the Client Secret
We need to set the specific secret so it matches what is in `pomerium.yaml`.
1. While still inside the `ztca-client` settings, click the **Credentials** tab at the top.
2. You will see an auto-generated Client Secret. We need to replace it to match your YAML file.
3. Unfortunately, the Keycloak UI does not let you type a custom secret directly—it only lets you regenerate random ones.
4. **To fix this:** You must copy the generated secret from this page, open your `docker/pomerium/config/pomerium.yaml` file, and replace `DhuNn2TRSuouByO36AWg2LRP9GNgybkD` with the new secret Keycloak just generated for you!

---

## 7. Map Groups to the JWT (Crucial for Zero Trust!)
By default, Keycloak does *not* include a user's groups in the OIDC authentication token. Pomerium needs those groups to evaluate the access policies. We must add a Protocol Mapper.

1. While still inside the `ztca-client` settings, click the **Client scopes** tab.
2. Click on the scope named **`ztca-client-dedicated`**.
3. Click the **Add mapper** button -> select **By configuration**.
4. Choose **Group Membership** from the list.
5. Fill out the form exactly as follows:
   * **Name:** `groups`
   * **Token Claim Name:** `groups`
   * **Full group path:** Toggle to **OFF** *(This ensures the claim is "admin" instead of "/admin")*.
   * **Add to ID token:** Toggle to **ON**.
   * **Add to access token:** Toggle to **ON**.
6. Click **Save**.

---

### You are done!
If you followed these steps, you have successfully recreated the entire `realm-export.json` file natively through the modern Keycloak Admin UI!
