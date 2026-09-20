CREATE TYPE "public"."acquisition_kind" AS ENUM('public_source', 'owned_pdf', 'scrape');--> statement-breakpoint
CREATE TYPE "public"."licence_basis" AS ENUM('public_domain', 'cc_by', 'official_sample', 'owned_licence', 'third_party_unlicensed');--> statement-breakpoint
CREATE TYPE "public"."staging_review_state" AS ENUM('clear', 'needs_rewrite', 'rewritten');--> statement-breakpoint
CREATE TABLE "scrape_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"licence" "licence_basis" DEFAULT 'third_party_unlicensed' NOT NULL,
	"attribution" text,
	"tos_reviewed_at" timestamp with time zone,
	"max_pages" integer DEFAULT 25 NOT NULL,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_id" uuid NOT NULL,
	"scrape_source_id" uuid,
	"url" text,
	"acquisition" "acquisition_kind" NOT NULL,
	"licence" "licence_basis" NOT NULL,
	"attribution" text,
	"status" text DEFAULT 'queued' NOT NULL,
	"http_status" integer,
	"robots_allowed" boolean,
	"robots_checked_at" timestamp with time zone,
	"content_type" text,
	"sha256" text,
	"storage_key" text,
	"reason" text,
	"extracted_count" integer,
	"fetched_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "source_document_id" uuid;--> statement-breakpoint
ALTER TABLE "staging_questions" ADD COLUMN "review_state" "staging_review_state" DEFAULT 'clear' NOT NULL;--> statement-breakpoint
ALTER TABLE "staging_questions" ADD COLUMN "edited_extracted" jsonb;--> statement-breakpoint
ALTER TABLE "staging_questions" ADD COLUMN "similarity" numeric;--> statement-breakpoint
ALTER TABLE "staging_questions" ADD COLUMN "source_document_id" uuid;--> statement-breakpoint
ALTER TABLE "scrape_sources" ADD CONSTRAINT "scrape_sources_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_documents" ADD CONSTRAINT "source_documents_batch_id_import_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."import_batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_documents" ADD CONSTRAINT "source_documents_scrape_source_id_scrape_sources_id_fk" FOREIGN KEY ("scrape_source_id") REFERENCES "public"."scrape_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "scrape_sources_domain_key" ON "scrape_sources" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "source_documents_batch_idx" ON "source_documents" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "source_documents_source_idx" ON "source_documents" USING btree ("scrape_source_id");--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_source_document_id_source_documents_id_fk" FOREIGN KEY ("source_document_id") REFERENCES "public"."source_documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staging_questions" ADD CONSTRAINT "staging_questions_source_document_id_source_documents_id_fk" FOREIGN KEY ("source_document_id") REFERENCES "public"."source_documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "questions_source_document_idx" ON "questions" USING btree ("source_document_id");--> statement-breakpoint
CREATE UNIQUE INDEX "staging_questions_content_hash_pending_key" ON "staging_questions" USING btree ("content_hash") WHERE "staging_questions"."status" = 'pending';