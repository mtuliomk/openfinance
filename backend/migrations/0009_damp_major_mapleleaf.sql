CREATE TABLE `bill` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`due_date` text NOT NULL,
	`total_amount` real NOT NULL,
	`total_amount_currency_code` text NOT NULL,
	`minimum_payment_amount` real,
	`allows_installments` integer,
	`finance_charges` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON UPDATE no action ON DELETE no action
);
