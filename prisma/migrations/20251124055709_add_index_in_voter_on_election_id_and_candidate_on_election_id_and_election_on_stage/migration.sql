-- CreateIndex
CREATE INDEX "Candidate_election_id_idx" ON "Candidate"("election_id");

-- CreateIndex
CREATE INDEX "Voter_election_id_idx" ON "Voter"("election_id");
