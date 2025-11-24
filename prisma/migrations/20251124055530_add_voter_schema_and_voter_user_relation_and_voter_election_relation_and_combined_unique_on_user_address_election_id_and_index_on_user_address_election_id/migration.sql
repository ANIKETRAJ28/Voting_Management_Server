-- CreateTable
CREATE TABLE "Voter" (
    "id" SERIAL NOT NULL,
    "user_address" TEXT NOT NULL,
    "election_id" BIGINT NOT NULL,
    "has_voted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Voter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Voter_user_address_election_id_idx" ON "Voter"("user_address", "election_id");

-- CreateIndex
CREATE UNIQUE INDEX "Voter_user_address_election_id_key" ON "Voter"("user_address", "election_id");

-- CreateIndex
CREATE INDEX "Election_stage_idx" ON "Election"("stage");

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
