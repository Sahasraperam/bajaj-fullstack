# SRM Full Stack Challenge

REST API and React frontend for the SRM hierarchy-processing assignment.

## Backend

```bash
cd backend
npm install
BFHL_USER_ID=fullname_ddmmyyyy \
BFHL_EMAIL_ID=your.email@college.edu \
BFHL_ROLL_NUMBER=21CS1001 \
npm start
```

The evaluator calls:

```text
POST /bfhl
Content-Type: application/json
```

Body:

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

## Frontend

```bash
cd frontend
npm install
PORT=3001 REACT_APP_API_BASE_URL=http://localhost:4000 npm start
```

The backend runs locally at `http://localhost:4000`, and the frontend runs at `http://localhost:3001`.
For deployment, set `REACT_APP_API_BASE_URL` to your hosted backend base URL.

## Verification

```bash
cd backend && npm test
cd frontend && npm run build
```
