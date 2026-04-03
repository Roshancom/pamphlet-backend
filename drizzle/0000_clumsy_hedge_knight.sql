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
	`whatsapp` varchar(20),
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
CREATE TABLE `pamphlet_locations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`pamphlet_id` int,
	`address` text,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	CONSTRAINT `pamphlet_locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pamphlets` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`short_description` text,
	`content` text,
	`thumbnail_image` varchar(255),
	`category` varchar(100),
	`location` varchar(255),
	`user_id` int,
	`url_key` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `pamphlets_id` PRIMARY KEY(`id`)
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
