-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('Created', 'RegisterCandidates', 'RegisterVoters', 'Voting', 'Finalized');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Election" (
    "id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "host_address" TEXT NOT NULL,
    "stage" "Stage" NOT NULL DEFAULT 'Created',
    "deadline" BIGINT,
    "created_at" BIGINT NOT NULL,
    "deposit" BIGINT NOT NULL,
    "finalize_payout" BIGINT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_address" TEXT NOT NULL,
    "election_id" BIGINT NOT NULL,
    "votes" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voter" (
    "id" SERIAL NOT NULL,
    "user_address" TEXT NOT NULL,
    "election_id" BIGINT NOT NULL,
    "has_voted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Voter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "election_id" BIGINT NOT NULL,
    "voter_id" INTEGER NOT NULL,
    "candidate_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE INDEX "User_address_idx" ON "User"("address");

-- CreateIndex
CREATE INDEX "Election_host_address_idx" ON "Election"("host_address");

-- CreateIndex
CREATE INDEX "Election_stage_idx" ON "Election"("stage");

-- CreateIndex
CREATE INDEX "Candidate_user_address_election_id_idx" ON "Candidate"("user_address", "election_id");

-- CreateIndex
CREATE INDEX "Candidate_election_id_idx" ON "Candidate"("election_id");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_user_address_election_id_key" ON "Candidate"("user_address", "election_id");

-- CreateIndex
CREATE INDEX "Voter_user_address_election_id_idx" ON "Voter"("user_address", "election_id");

-- CreateIndex
CREATE INDEX "Voter_election_id_idx" ON "Voter"("election_id");

-- CreateIndex
CREATE UNIQUE INDEX "Voter_user_address_election_id_key" ON "Voter"("user_address", "election_id");

-- CreateIndex
CREATE INDEX "Vote_election_id_idx" ON "Vote"("election_id");

-- CreateIndex
CREATE INDEX "Vote_voter_id_idx" ON "Vote"("voter_id");

-- CreateIndex
CREATE INDEX "Vote_candidate_id_idx" ON "Vote"("candidate_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voter_id_election_id_key" ON "Vote"("voter_id", "election_id");

-- AddForeignKey
ALTER TABLE "Election" ADD CONSTRAINT "Election_host_address_fkey" FOREIGN KEY ("host_address") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voter_id_fkey" FOREIGN KEY ("voter_id") REFERENCES "Voter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
