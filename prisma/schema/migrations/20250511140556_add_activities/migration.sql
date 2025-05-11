-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('FOOD', 'PEE', 'POOP');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "amount" INTEGER,
    "unit" TEXT,
    "notes" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
