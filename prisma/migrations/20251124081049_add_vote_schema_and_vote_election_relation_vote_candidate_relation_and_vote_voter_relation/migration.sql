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
CREATE INDEX "Vote_election_id_idx" ON "Vote"("election_id");

-- CreateIndex
CREATE INDEX "Vote_voter_id_idx" ON "Vote"("voter_id");

-- CreateIndex
CREATE INDEX "Vote_candidate_id_idx" ON "Vote"("candidate_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voter_id_election_id_key" ON "Vote"("voter_id", "election_id");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voter_id_fkey" FOREIGN KEY ("voter_id") REFERENCES "Voter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
