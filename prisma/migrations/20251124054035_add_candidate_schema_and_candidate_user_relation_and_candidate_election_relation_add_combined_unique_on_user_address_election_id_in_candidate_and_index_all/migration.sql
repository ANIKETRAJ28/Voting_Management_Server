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

-- CreateIndex
CREATE INDEX "Candidate_user_address_election_id_idx" ON "Candidate"("user_address", "election_id");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_user_address_election_id_key" ON "Candidate"("user_address", "election_id");

-- CreateIndex
CREATE INDEX "Election_host_address_idx" ON "Election"("host_address");

-- CreateIndex
CREATE INDEX "User_address_idx" ON "User"("address");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
