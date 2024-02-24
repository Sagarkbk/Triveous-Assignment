Triveous Assignment

Local Setup:

    -> clone this repo in your system

    -> Open the folder in your IDE

    -> create a .env file and declare two variables "DATABASE_URL" and "JWT_SECRET"

    -> DATABASE_URL should be a Postgres Connection String and JWT_SECRET could be anything

    -> Run the following commands:

        -> npm install
        -> npx prisma init
        -> npx prisma migrate dev --name initial_migration
