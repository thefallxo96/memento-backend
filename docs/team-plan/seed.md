# Seed & Run Instructions

## 1. Install dependencies

```bash
npm install
```

## 2. Set up environment

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB URI and JWT secret.

## 3. Seed the dev user

```bash
npm run seed
```

Creates:

- **Username:** devuser
- **Email:** dev@memento.com
- **Password:** devpass123

## 4. Start the server

```bash
npm run dev
```

Server runs at http://localhost:3000

## 5. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@memento.com","password":"devpass123"}'
```

Copy the token from the response and use it in the `Authorization` header:

```
Authorization: Bearer <token>
```

## 6. Test stories endpoint

```bash
curl http://localhost:3000/api/stories \
  -H "Authorization: Bearer <token>"
```
