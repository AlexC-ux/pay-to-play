-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('low', 'user', 'medium', 'moderator', 'admin', 'owner');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "role" "UserRoles" NOT NULL DEFAULT 'user',
    "rating" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "statusText" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "new" BOOLEAN,
    "usersId" TEXT,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_token_key" ON "Users"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_id_key" ON "Notifications"("id");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
