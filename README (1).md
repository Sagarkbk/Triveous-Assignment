
# Triveous Assignment

Build an API to support e-commerce operations, such as product and category
listing, product details, cart management, and order processing.




## Run Locally

Clone the project

```bash
  git clone https://github.com/Sagarkbk/Triveous-Assignment.git
```

Go to the project directory

```bash
  cd Triveous-Assignment
```
Environmental Variables

```bash
  DATABASE_URL //local postgresql or any other connection string
  JWT_SECRET  //Any random secret
```

Install dependencies

```bash
  npm install
```

Prisma

```bash
  npx prisma init
  npx prisma migrate dev --name initial_migration
  npx prisma studio //Opens Prisma GUI
```

Start the server

```bash
  nodemon index.js
```

