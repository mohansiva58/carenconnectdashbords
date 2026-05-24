# Care Connect Hub UI

This frontend is now wired for backend authentication and approval APIs.

## 1. Configure environment

Copy `.env.example` to `.env` and update values to match your backend.

```bash
cp .env.example .env
```

### Required values

- `VITE_API_BASE_URL`
  - Use `/api` for local dev with Vite proxy.
  - Use a full URL (for example `https://api.example.com/api`) for direct API calls.

### Optional endpoint overrides

- `VITE_API_LOGIN_PATH`
- `VITE_API_SIGNUP_PATH`
- `VITE_API_ME_PATH`
- `VITE_API_PENDING_USERS_PATH`
- `VITE_API_APPROVE_USER_PATH`
- `VITE_API_REJECT_USER_PATH`

Set optional values to empty if your backend does not expose those routes.

## 2. Local development (UI + backend)

If your backend runs at `http://localhost:5000`, keep:

- `VITE_API_BASE_URL=/api`
- `VITE_DEV_PROXY_TARGET=http://localhost:5000`

Vite will proxy API requests to backend and avoid browser CORS issues in dev.

## 3. Run the UI

```bash
npm install
npm run dev
```
