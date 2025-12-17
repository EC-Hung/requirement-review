-- CreateTable
CREATE TABLE "_ReviewedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ReviewedBy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ReviewedBy_B_index" ON "_ReviewedBy"("B");

-- AddForeignKey
ALTER TABLE "_ReviewedBy" ADD CONSTRAINT "_ReviewedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Requirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReviewedBy" ADD CONSTRAINT "_ReviewedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
