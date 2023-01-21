-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('low', 'user', 'medium', 'moderator', 'admin', 'owner');

-- CreateEnum
CREATE TYPE "MarketplaceAccountState" AS ENUM ('validating', 'notValid', 'selling', 'sold');

-- CreateTable
CREATE TABLE "Captcha" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "rightColor" INTEGER[],

    CONSTRAINT "Captcha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatchaGeometries" (
    "id" BIGSERIAL NOT NULL,
    "pointX" INTEGER NOT NULL,
    "pointY" INTEGER NOT NULL,
    "radius" INTEGER NOT NULL,
    "color" INTEGER[],
    "captchaId" TEXT,

    CONSTRAINT "CatchaGeometries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "role" "UserRoles"[] DEFAULT ARRAY['user']::"UserRoles"[],
    "rating" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "statusText" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "accountsStoreId" TEXT NOT NULL,
    "bookmarkStoreId" TEXT NOT NULL,
    "likesSummary" INTEGER NOT NULL DEFAULT 0,
    "memberSince" BIGINT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreadsCollection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "canWrite" "UserRoles" NOT NULL DEFAULT 'user',
    "canRead" "UserRoles" NOT NULL DEFAULT 'user',
    "likes" INTEGER NOT NULL,

    CONSTRAINT "ThreadsCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkStore" (
    "id" TEXT NOT NULL,

    CONSTRAINT "BookmarkStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "threadsCollectionId" TEXT,
    "usersId" TEXT,
    "bookmarkStoreId" TEXT,
    "createdAt" BIGINT NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreadComment" (
    "id" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "threadId" TEXT,
    "text" TEXT NOT NULL,
    "bookmarkStoreId" TEXT,

    CONSTRAINT "ThreadComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "new" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountsStore" (
    "id" TEXT NOT NULL,

    CONSTRAINT "AccountsStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamAccount" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailLogin" TEXT NOT NULL,
    "emailPassword" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "lastActivity" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "_ThreadsCollectionToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Captcha_id_key" ON "Captcha"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CatchaGeometries_id_key" ON "CatchaGeometries"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_token_key" ON "Users"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_accountsStoreId_key" ON "Users"("accountsStoreId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_bookmarkStoreId_key" ON "Users"("bookmarkStoreId");

-- CreateIndex
CREATE UNIQUE INDEX "ThreadsCollection_id_key" ON "ThreadsCollection"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkStore_id_key" ON "BookmarkStore"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Thread_id_key" ON "Thread"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ThreadComment_id_key" ON "ThreadComment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_id_key" ON "Notifications"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AccountsStore_id_key" ON "AccountsStore"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SteamAccount_id_key" ON "SteamAccount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SteamGame_id_key" ON "SteamGame"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_ThreadsCollectionToUsers_AB_unique" ON "_ThreadsCollectionToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ThreadsCollectionToUsers_B_index" ON "_ThreadsCollectionToUsers"("B");

-- AddForeignKey
ALTER TABLE "CatchaGeometries" ADD CONSTRAINT "CatchaGeometries_captchaId_fkey" FOREIGN KEY ("captchaId") REFERENCES "Captcha"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_accountsStoreId_fkey" FOREIGN KEY ("accountsStoreId") REFERENCES "AccountsStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_bookmarkStoreId_fkey" FOREIGN KEY ("bookmarkStoreId") REFERENCES "BookmarkStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_threadsCollectionId_fkey" FOREIGN KEY ("threadsCollectionId") REFERENCES "ThreadsCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_bookmarkStoreId_fkey" FOREIGN KEY ("bookmarkStoreId") REFERENCES "BookmarkStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadComment" ADD CONSTRAINT "ThreadComment_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadComment" ADD CONSTRAINT "ThreadComment_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadComment" ADD CONSTRAINT "ThreadComment_bookmarkStoreId_fkey" FOREIGN KEY ("bookmarkStoreId") REFERENCES "BookmarkStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamAccount" ADD CONSTRAINT "SteamAccount_accountsStorageId_fkey" FOREIGN KEY ("accountsStorageId") REFERENCES "AccountsStore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamGame" ADD CONSTRAINT "SteamGame_steamAccountId_fkey" FOREIGN KEY ("steamAccountId") REFERENCES "SteamAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThreadsCollectionToUsers" ADD CONSTRAINT "_ThreadsCollectionToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ThreadsCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThreadsCollectionToUsers" ADD CONSTRAINT "_ThreadsCollectionToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
