CREATE TABLE `categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`slug` varchar(100),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pamphlet_contacts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`pamphlet_id` int,
	`phone` varchar(20),
	`email` varchar(255),
	CONSTRAINT `pamphlet_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pamphlet_images` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`pamphlet_id` int,
	`image_url` text,
	CONSTRAINT `pamphlet_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pamphlets` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`short_description` text,
	`content` text,
	`thumbnail_image` varchar(255),
	`category` varchar(100),
	`location_id` int,
	`user_id` int,
	`url_key` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `pamphlets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pamphlets_location` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`city` varchar(255),
	`latitude` double,
	`longitude` double,
	CONSTRAINT `pamphlets_location_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`email` varchar(100),
	`password` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `pamphlets` ADD CONSTRAINT `pamphlets_location_id_pamphlets_location_id_fk` FOREIGN KEY (`location_id`) REFERENCES `pamphlets_location`(`id`) ON DELETE set null ON UPDATE no action;