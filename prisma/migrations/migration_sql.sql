-- Таблицы для NextAuth
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` VARCHAR(191) NOT NULL,
  `userId` INTEGER NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `provider` VARCHAR(191) NOT NULL,
  `providerAccountId` VARCHAR(191) NOT NULL,
  `refresh_token` TEXT NULL,
  `access_token` TEXT NULL,
  `expires_at` INTEGER NULL,
  `token_type` VARCHAR(191) NULL,
  `scope` VARCHAR(191) NULL,
  `id_token` TEXT NULL,
  `session_state` VARCHAR(191) NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `accounts_provider_providerAccountId_key`(`provider`, `providerAccountId`),
  INDEX `accounts_userId_idx`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(191) NOT NULL,
  `sessionToken` VARCHAR(191) NOT NULL,
  `userId` INTEGER NOT NULL,
  `expires` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `sessions_sessionToken_key`(`sessionToken`),
  INDEX `sessions_userId_idx`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `verification_tokens` (
  `identifier` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL,
  `expires` DATETIME(3) NOT NULL,

  UNIQUE INDEX `verification_tokens_token_key`(`token`),
  UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Обновление таблицы пользователей
ALTER TABLE `users`
ADD COLUMN IF NOT EXISTS `emailVerified` DATETIME(3) NULL;

-- Создание базовых таблиц, если они не существуют
CREATE TABLE IF NOT EXISTS `users` (
  `idu` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `regdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `acctype` VARCHAR(191) NOT NULL DEFAULT 'user',
  `password` VARCHAR(191) NOT NULL,
  `foreignkey` VARCHAR(191) NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `image` VARCHAR(191) NULL,
  `emailVerified` DATETIME(3) NULL,

  PRIMARY KEY (`idu`),
  UNIQUE INDEX `users_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ads` (
  `idads` INTEGER NOT NULL AUTO_INCREMENT,
  `model` VARCHAR(191) NOT NULL,
  `prodyear` INTEGER NOT NULL,
  `engvol` DOUBLE NOT NULL,
  `price` INTEGER NOT NULL,
  `milage` INTEGER NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `new` BOOLEAN NOT NULL DEFAULT false,
  `owner` INTEGER NOT NULL,
  `engtype` INTEGER NOT NULL,
  `body` INTEGER NOT NULL,
  `gearbox` INTEGER NOT NULL,
  `transmission` INTEGER NOT NULL,
  `color` INTEGER NOT NULL,
  `made` INTEGER NOT NULL,
  `date_added` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `description` TEXT NULL,

  PRIMARY KEY (`idads`),
  INDEX `ads_owner_idx`(`owner`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `car_images` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `car_id` INTEGER NOT NULL,
  `url` VARCHAR(191) NOT NULL,
  `main` BOOLEAN NOT NULL DEFAULT false,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `car_images_car_id_idx`(`car_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `saved_searches` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_id` INTEGER NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `filters` TEXT NOT NULL,
  `query_string` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `saved_searches_user_id_idx`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `favorites` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_id` INTEGER NOT NULL,
  `car_id` INTEGER NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `favorites_user_id_car_id_key`(`user_id`, `car_id`),
  INDEX `favorites_car_id_idx`(`car_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Справочные таблицы
CREATE TABLE IF NOT EXISTS `carbrands` (
  `idcb` INTEGER NOT NULL AUTO_INCREMENT,
  `carbrand` VARCHAR(191) NOT NULL,

  PRIMARY KEY (`idcb`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `models` (
  `idmodels` INTEGER NOT NULL AUTO_INCREMENT,
  `modelbrand` INTEGER NOT NULL,
  `modelname` VARCHAR(191) NOT NULL,

  PRIMARY KEY (`idmodels`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bodytypes` (
  `idbt` INTEGER NOT NULL AUTO_INCREMENT,
  `bodytype` VARCHAR(191) NOT NULL,

  PRIMARY KEY (`idbt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `enginetypes` (
  `idet` INTEGER NOT NULL AUTO_INCREMENT,
  `enginetype` VARCHAR(191) NOT NULL,

  PRIMARY KEY (`idet`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gearboxes` (
  `idgb` INTEGER NOT NULL AUTO_INCREMENT,
  `gb` VARCHAR(191) NOT NULL,

  PRIMARY KEY (`idgb`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `transmissions` (
  `idtm` INTEGER NOT NULL AUTO_INCREMENT,
  `drivetype` VARCHAR(191) NOT NULL,

  PRIMARY KEY (`idtm`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `colors` (
  `idc` INTEGER NOT NULL AUTO_INCREMENT,
  `color` VARCHAR(191) NOT NULL,

  PRIMARY KEY (`idc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Внешние ключи
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`idu`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`idu`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ads` ADD CONSTRAINT `ads_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `users`(`idu`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `car_images` ADD CONSTRAINT `car_images_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `ads`(`idads`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `saved_searches` ADD CONSTRAINT `saved_searches_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`idu`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`idu`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `ads`(`idads`) ON DELETE CASCADE ON UPDATE CASCADE;
