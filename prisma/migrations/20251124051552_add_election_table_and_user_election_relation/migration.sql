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

-- AddForeignKey
ALTER TABLE "Election" ADD CONSTRAINT "Election_host_address_fkey" FOREIGN KEY ("host_address") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
