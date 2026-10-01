# MetricMind — Google OAuth 2.0 Setup Guide

This guide explains step-by-step how to configure **Google OAuth 2.0 (Gmail / Google SSO)** authentication for **MetricMind – Agentic Semantic BI Engine**.

---

## 1. Quick Reference: Endpoints & URIs

| Setting | Value (Local Development) | Value (Production) |
| :--- | :--- | :--- |
| **Application Name** | `MetricMind` | `MetricMind Enterprise` |
| **Application Type** | Web application | Web application |
| **Authorized JavaScript Origins** | `http://localhost:3000` | `https://your-domain.com` |
| **Authorized Redirect URI** | `http://localhost:3000/api/auth/google/callback` | `https://your-domain.com/api/auth/google/callback` |
| **OAuth Initiation Endpoint** | `/api/auth/google` | `/api/auth/google` |
| **OAuth Callback Endpoint** | `/api/auth/google/callback` | `/api/auth/google/callback` |

> [!IMPORTANT]
> The Authorized Redirect URI must match **exactly** in Google Cloud Console. Any missing or trailing slash mismatch will result in Google's `redirect_uri_mismatch` error (Error 400).

---

## 2. Step-by-Step Google Cloud Console Setup

### Step 1: Open Google Cloud Console
1. Navigate to [Google Cloud Console](https://console.cloud.google.com/).
2. Log in with your Google account.

### Step 2: Create or Select a Project
1. In the top navigation bar, click the project dropdown.
2. Click **New Project**.
3. Enter Project Name: `MetricMind` (or select an existing project).
4. Click **Create** and ensure it is selected as your active project.

### Step 3: Configure the OAuth Consent Screen
1. In the left navigation menu, go to **APIs & Services** → **OAuth consent screen**.
2. Select User Type:
   - **External**: Allows any Google / Gmail user to log in (or test users while in "Testing" mode).
   - **Internal**: Restricted to users within your Google Workspace organization.
3. Click **Create**.
4. Fill out the App Information:
   - **App name**: `MetricMind`
   - **User support email**: Your email address
   - **App logo**: (Optional) Upload your MetricMind enterprise logo
   - **Application home page**: `http://localhost:3000` (or your production URL)
   - **Developer contact information**: Your email address
5. Click **Save and Continue**.

### Step 4: Configure Scopes
1. Click **Add or Remove Scopes**.
2. Check the standard OpenID scopes:
   - `.../auth/userinfo.email` (See your primary Google Account email address)
   - `.../auth/userinfo.profile` (See your personal info, including any personal info you've made publicly available)
   - `openid` (Associate you with your personal info on Google)
3. Click **Update** → **Save and Continue**.

### Step 5: Add Test Users (If in Testing status)
1. If your publishing status is "Testing", click **Add Users**.
2. Enter the Google/Gmail email addresses of developers or stakeholders who will test login.
3. Click **Save and Continue**.

---

## 3. Create OAuth 2.0 Client ID Credentials

1. Go to **APIs & Services** → **Credentials**.
2. Click **+ CREATE CREDENTIALS** at the top and select **OAuth client ID**.
3. Under **Application type**, select **Web application**.
4. Set **Name**: `MetricMind Web Client`.
5. Under **Authorized JavaScript origins**, click **+ ADD URI**:
   ```
   http://localhost:3000
   ```
   *(For production, also add your custom domain: `https://analytics.yourcompany.com`)*
6. Under **Authorized redirect URIs**, click **+ ADD URI**:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
   *(For production, also add: `https://analytics.yourcompany.com/api/auth/google/callback`)*
7. Click **Create**.
8. A modal will appear displaying:
   - **Your Client ID** (e.g., `your_client_id.apps.googleusercontent.com`)
   - **Your Client Secret** (e.g., `your_client_secret_key`)

---

## 4. Configure Environment Variables

Open `frontend/.env.local` (or `frontend/.env`) and add your credentials:

```env
# Google OAuth 2.0 Credentials (Server-side ONLY)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application URL (used to compute callback URL)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!CAUTION]
> Never commit `GOOGLE_CLIENT_SECRET` to GitHub or version control. Keep `GOOGLE_CLIENT_SECRET` strictly on the server; never prefix it with `NEXT_PUBLIC_`.

---

## 5. Restart Development Server

After updating `.env.local`, restart Next.js:

```powershell
# In the frontend directory
npm run dev
```

Visit [http://localhost:3000/login](http://localhost:3000/login).

---

## 6. Verification & Testing

### Scenario 1: Normal Google Sign-In
1. Navigate to `http://localhost:3000/login`.
2. Click **Continue with Google**.
3. You will see `Connecting to Google...` with a loading spinner.
4. The browser will redirect to Google's official account selector (`accounts.google.com`).
5. Choose your account and grant consent.
6. Google redirects back to `/api/auth/google/callback`.
7. You are logged into MetricMind with your Google name, email, and avatar photo displayed in the top bar and `/profile`.

### Scenario 2: Existing User Linking
- If an account already exists in MetricMind with the same verified email, MetricMind links the Google identity without creating duplicate user records.

### Scenario 3: Cancelled Login
- If the user clicks "Cancel" on the Google consent page, they are returned to `/login` with a clean notification: `"Google sign-in was cancelled."`

### Scenario 4: Missing Credentials / Demo Environment
- If `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` is omitted, clicking Google Login immediately presents: `"Google sign-in is not configured for this environment."`
- Demo Mode remains fully functional with zero configuration required.

---

## 7. Common OAuth Errors & Troubleshooting

| Error | Root Cause | Solution |
| :--- | :--- | :--- |
| `redirect_uri_mismatch` (Error 400) | The callback URI in Google Cloud Console doesn't match the request URL. | Ensure `http://localhost:3000/api/auth/google/callback` is added to **Authorized redirect URIs** in Google Cloud Console. |
| `access_denied` | The user clicked "Cancel" on Google's consent screen. | MetricMind gracefully handles this and shows `"Google sign-in was cancelled."` |
| `Google sign-in is not configured` | Missing `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` in `.env.local`. | Verify `.env.local` exists in the `frontend` folder with non-empty credentials, and restart the dev server. |
| `Access blocked: MetricMind has not completed Google verification` | App is in "Testing" mode and current Google account is not added as a Test User. | In Google Cloud Console, go to **OAuth consent screen** → **Test users** → Add your email address, or publish the app to "In Production". |
| `invalid_state` | State cookie expired or CSRF token mismatch. | Clear browser cookies for `localhost:3000` and retry. |
