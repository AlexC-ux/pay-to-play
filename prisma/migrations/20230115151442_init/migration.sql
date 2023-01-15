-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('low', 'user', 'medium', 'moderator', 'admin', 'owner');

-- CreateEnum
CREATE TYPE "MarketplaceAccountState" AS ENUM ('validating', 'notValid', 'selling', 'sold');

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
    "accountsStorageId" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "new" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountsStorage" (
    "id" TEXT NOT NULL,

    CONSTRAINT "AccountsStorage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamAccount" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailLogin" TEXT NOT NULL,
    "emailPassword" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "lastActivity" TIMESTAMP(3) NOT NULL,
    "state" "MarketplaceAccountState" NOT NULL DEFAULT 'validating',
    "accountsStorageId" TEXT NOT NULL,

    CONSTRAINT "SteamAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamGame" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "previewAvatarLink" TEXT NOT NULL,
    "gameStoreLink" TEXT NOT NULL,
    "steamAccountId" TEXT,

    CONSTRAINT "SteamGame_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "AccountsStorage_id_key" ON "AccountsStorage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SteamAccount_id_key" ON "SteamAccount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SteamGame_id_key" ON "SteamGame"("id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_accountsStorageId_fkey" FOREIGN KEY ("accountsStorageId") REFERENCES "AccountsStorage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamAccount" ADD CONSTRAINT "SteamAccount_accountsStorageId_fkey" FOREIGN KEY ("accountsStorageId") REFERENCES "AccountsStorage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamGame" ADD CONSTRAINT "SteamGame_steamAccountId_fkey" FOREIGN KEY ("steamAccountId") REFERENCES "SteamAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
