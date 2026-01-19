# Project Setup

- Install dependencies:
  ```
  npm install
  ```
- Migrate the database:
  ```
  npx prisma migrate dev
  ```
- Generate Prisma client:
  ```
  npx prisma generate
  ```
- Create a `.env` file and copy the contents

  ```
  PGHOSTNAME="localhost"
  PGPORT="5432"
  PGDBNAME="voting_management"
  PGUSER="postgres"
  PGPWD="postgres"
  DATABASE_URL=`postgresql://${PGUSER}:${PGPWD}@${PGHOSTNAME}:${PGPORT}/${PGDBNAME}`

  JWT_SECRET_KEY=23456789
  FRONTEND_URL="http://localhost:5173"
  URL=http://127.0.0.1:8545
  VITE_CHAIN_ID=31337
  CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
  PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  WS_URL=ws://127.0.0.1:8545
  ```
