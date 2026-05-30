CREATE TABLE `consent` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`products` text NOT NULL,
	`open_finance_permissions_granted` text NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text,
	`revoked_at` text,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
