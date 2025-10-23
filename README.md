# blog-app

blog-app is a modern blogging application inspired by platforms like Medium, designed to empower users to share their ideas and stories with the world.

---

## Author

**Abhinav Sahotra**  
GitHub: [@abhinavsahotra](https://github.com/abhinavsahotra)  

---

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces, providing a flexible and efficient way to create dynamic web applications.
- **Zod**: A TypeScript-first schema declaration and validation library, enabling robust type checking and validation of frontend data.
- **TypeScript**: A statically typed superset of JavaScript that enhances code quality, maintainability, and developer productivity.
- **JWT (JSON Web Tokens)**: A standard for securely transmitting information between parties as a JSON object, commonly used for authentication in web applications.

### Backend

- **Cloudflare Workers**: A serverless execution environment that allows you to run JavaScript code at the edge of the Cloudflare network, providing scalable and efficient backend logic. [Hono](https://hono.dev/top)
- **TypeScript**: Leveraged for backend development as well, ensuring consistent type safety and code integrity across the entire application.
- **Prisma**: A modern ORM (Object-Relational Mapping) tool that simplifies database access and manipulation, offering type-safe database queries and schema migrations. [Prisma](https://www.prisma.io/)
- **PostgreSQL**: A powerful open-source relational database management system, chosen for its reliability, scalability, and extensive feature set. [Aiven](https://aiven.io/)

---

## Getting Started

### Prerequisites

- Node.js & npm installed
- A PostgreSQL database (recommended via [Aiven](https://aiven.io/))
- Cloudflare account for Workers

## Installation

1. Clone the repository and navigate to the project folder:

   ```bash
   git clone https://github.com/abhinavsahotra/blog-app.git
   cd blog-app

   Install dependencies for     FRONTEND and BACKEND:
2. ```bash 
   cd FRONTEND
   npm install

   cd ../BACKEND
   npm install

3. Configuration
   ```bash
   Create .env and wrangler.toml files inside the BACKEND folder.

   .env file
    DATABASE_URL="PASTE_DATABASE_URL_HERE"

## Setting up Connection Pool with Prisma

1. Go to the Prisma Data Platform

2. Create a new project and enable Accelerate.

3. Paste your Aiven PostgreSQL database URL under Database Connection String.

4. Generate an API key and get the connection pool URL.

5. Use this pool URL in your wrangler.toml file.

``` wrangler.toml ``` file example
```
name = "backend"
compatibility_date = "20XX-XX-XX"

[vars]
DATABASE_URL = "PASTE_PRISMA_CONNECTION_POOL_URL_HERE"
JWT_SECRET = "mytoken"
```
### Database Migrations


```npx prisma migrate dev --name init_schema```
- Then generate the Prisma client:
```npx prisma generate --no-engine```
---
**NOTE: If you make changes in the database**
>i.e schema.prisma file you need to migrate using the follwing command to tell the database the the table you had added is been altered.

```npx prisma migrate dev --name change```

- ***It will generate new migration folder inside prisma.
And then Generate the prisma client***  
```npx prisma generate --no-engine```

## Running Locally
### BACKEND

Start the backend server :
```
npm run dev
```
### FRONTEND

### Start the frontend development server:
```
cd FRONTEND
npm run dev
```

Open your browser and visit http://localhost:3000.

# Deployment
## Backend (Cloudflare Workers)

### Authenticate and deploy:
```
npx wrangler whoami
npx wrangler login
npm run deploy
```

>Note: Cloudflare Workers do not read environment variables from ```.env ```they use variables defined in ```wrangler.toml```.


>- This code snippet demonstrates the usage of Cloudflare Workers and the need for a connection pool when connecting to a database.  
>- Cloudflare Workers create multiple instances distributed throughout the world. When deploying the code, each instance connects to the database, which can be inefficient and potentially overload the database.  
>- To address this issue, it is recommended to use a connection pool. In this code, the prisma library is used for managing the connection pool and connecting to the database.

### Frontend (React + TypeScript on Vercel)

***Login and deploy your frontend:***
```
npx vercel login
npx vercel --prod
```

### Ensure your frontend code is committed and pushed to GitHub before deploying.

