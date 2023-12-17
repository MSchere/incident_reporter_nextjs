# Incident Reporter Next.js

*Report incidents, update them, and close them.*

### Visit live site at [https://incident-reporter.vercel.app](https://incident-reporter.vercel.app)

## Stack

- **Frontend**: Next.js, NextAuth, Tailwind CSS
- **Backend**: FastAPI
- **Database**:  Upstash (Redis)
- **Deployment**: Vercel (frontend), Render (backend)

## Usage
Place a .env file in the root directory with the following variables:
```
NEXTAUTH_SECRET="YOUR_SECRET"
NEXTAUTH_URL="http://127.0.0.1:3000"
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
```
Install dependencies:
```bash
npm i
```
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Deploy to Vercel:
```bash
$ npm i -g vercel && vercel deploy
```

## API Reference
You can also find the api reference at [https://incident-reporter-fatapi.onrender.com/docs](https://incident-reporter-fatapi.onrender.com/docs)
### Create incident
```http
POST /fastapi/incident
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | **Required**. Incident title |
| `description` | `string` | **Required**. Incident description |
### Update incident
```http
PUT /fastapi/incident/${id}
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | **Required**. Incident title |
| `description` | `string` | **Required**. Incident description |
| `status` | `string` | **Required**. Incident status |
### Delete incident
```http
DELETE /fastapi/incident/${id}
```
### Get incident
```http
GET /fastapi/incident/${id}
```
### Get all incidents
```http
GET /fastapi/incidents
```

