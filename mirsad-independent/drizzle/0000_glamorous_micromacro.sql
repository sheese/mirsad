CREATE TABLE `admin_attempts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`failures` integer DEFAULT 0 NOT NULL,
	`window_start` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `admin_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `analyses` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`employee_id` text,
	`kind` text NOT NULL,
	`scenario` text NOT NULL,
	`title` text NOT NULL,
	`inputs_json` text NOT NULL,
	`result_json` text NOT NULL,
	`risk` text NOT NULL,
	`engine` text DEFAULT 'demo-v1' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_analyses_company` ON `analyses` (`company_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_analyses_employee` ON `analyses` (`employee_id`);--> statement-breakpoint
CREATE TABLE `analysis_documents` (
	`analysis_id` text NOT NULL,
	`document_id` text NOT NULL,
	PRIMARY KEY(`analysis_id`, `document_id`),
	FOREIGN KEY (`analysis_id`) REFERENCES `analyses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sector` text DEFAULT '' NOT NULL,
	`contact_name` text NOT NULL,
	`is_demo` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`employee_id` text,
	`storage_key` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`category` text DEFAULT 'مستند' NOT NULL,
	`uploaded_by` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_documents_company` ON `documents` (`company_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `employees` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`full_name` text NOT NULL,
	`employee_number` text NOT NULL,
	`job_title` text NOT NULL,
	`department` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`start_date` text NOT NULL,
	`contract_type` text NOT NULL,
	`contract_end` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`archived` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_employee_number_company` ON `employees` (`company_id`,`employee_number`);--> statement-breakpoint
CREATE TABLE `legal_requests` (
	`seq` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id` text NOT NULL,
	`company_id` text NOT NULL,
	`analysis_id` text,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`urgency` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`resolution` text DEFAULT '' NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`analysis_id`) REFERENCES `analyses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `legal_requests_id_unique` ON `legal_requests` (`id`);--> statement-breakpoint
CREATE INDEX `idx_requests_company` ON `legal_requests` (`company_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_requests_status` ON `legal_requests` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `memberships` (
	`user_id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`display_name` text NOT NULL,
	`email` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_members_company` ON `memberships` (`company_id`);--> statement-breakpoint
CREATE TABLE `request_documents` (
	`request_id` text NOT NULL,
	`document_id` text NOT NULL,
	PRIMARY KEY(`request_id`, `document_id`),
	FOREIGN KEY (`request_id`) REFERENCES `legal_requests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `request_events` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`actor_id` text NOT NULL,
	`actor_name` text NOT NULL,
	`from_status` text NOT NULL,
	`to_status` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `legal_requests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_events_request` ON `request_events` (`request_id`,`created_at`);