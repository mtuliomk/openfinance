CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`subtype` text,
	`number` text,
	`name` text,
	`marketing_name` text,
	`balance` integer,
	`item_id` text NOT NULL,
	`tax_number` text,
	`owner` text,
	`currency_code` text,
	`bank_data` text
);
