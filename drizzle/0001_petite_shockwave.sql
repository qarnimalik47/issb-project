CREATE TYPE "public"."account_status" AS ENUM('active', 'locked', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."attempt_mode" AS ENUM('typed', 'paper');--> statement-breakpoint
CREATE TYPE "public"."attempt_status" AS ENUM('in_progress', 'submitted', 'abandoned', 'evaluated');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."course_track" AS ENUM('pma', 'gdp', 'navy', 'lcc', 'technical', 'other');--> statement-breakpoint
CREATE TYPE "public"."evaluation_status" AS ENUM('pending', 'completed', 'needs_review', 'failed', 'blocked_distress');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('en', 'ur');--> statement-breakpoint
CREATE TYPE "public"."otp_channel" AS ENUM('email', 'phone');--> statement-breakpoint
CREATE TYPE "public"."otp_purpose" AS ENUM('verify_email', 'verify_phone', 'login', 'password_reset');--> statement-breakpoint
CREATE TYPE "public"."scoring_type" AS ENUM('objective', 'rubric', 'consistency');--> statement-breakpoint
CREATE TYPE "public"."staging_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."test_dimension" AS ENUM('psychologist', 'gto', 'interview', 'cross_cutting');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'content_editor', 'expert_reviewer', 'admin');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"metadata" jsonb,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"terms_version" text NOT NULL,
	"privacy_version" text NOT NULL,
	"flags" jsonb NOT NULL,
	"accepted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip" text
);
--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"channel" "otp_channel" NOT NULL,
	"purpose" "otp_purpose" NOT NULL,
	"code_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"password_hash" text,
	"name" text NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"locale" "locale" DEFAULT 'en' NOT NULL,
	"course_track" "course_track",
	"target_issb_date" date,
	"email_verified_at" timestamp with time zone,
	"phone_verified_at" timestamp with time zone,
	"status" "account_status" DEFAULT 'active' NOT NULL,
	"failed_login_count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "import_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"filename" text NOT NULL,
	"status" text DEFAULT 'parsing' NOT NULL,
	"total_pages" integer,
	"test_type_id" uuid,
	"meta" jsonb,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"storage_key" text NOT NULL,
	"mime" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"meta" jsonb,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_type_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"difficulty" text DEFAULT 'mixed' NOT NULL,
	"topic" text,
	"locale" "locale" DEFAULT 'en' NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bank_id" uuid,
	"test_type_id" uuid NOT NULL,
	"stem_en" text NOT NULL,
	"stem_ur" text,
	"options" jsonb,
	"correct_option" text,
	"explanation_en" text,
	"explanation_ur" text,
	"media_id" uuid,
	"difficulty" text DEFAULT 'medium' NOT NULL,
	"topic" text,
	"content_hash" text NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rubrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_type_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"name" text NOT NULL,
	"criteria" jsonb NOT NULL,
	"output_schema" jsonb NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staging_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_id" uuid NOT NULL,
	"page" integer,
	"extracted" jsonb NOT NULL,
	"content_hash" text NOT NULL,
	"confidence" numeric,
	"status" "staging_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name_en" text NOT NULL,
	"name_ur" text NOT NULL,
	"dimension" "test_dimension" NOT NULL,
	"scoring_type" "scoring_type" NOT NULL,
	"timing" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"test_type_id" uuid NOT NULL,
	"bank_id" uuid,
	"mode" "attempt_mode" DEFAULT 'typed' NOT NULL,
	"status" "attempt_status" DEFAULT 'in_progress' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deadline_at" timestamp with time zone,
	"submitted_at" timestamp with time zone,
	"duration_seconds" integer,
	"score" numeric,
	"max_score" numeric,
	"config" jsonb,
	"timing_meta" jsonb,
	"autosave" jsonb,
	"integrity_events" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"test_type_id" uuid,
	"model" text NOT NULL,
	"model_version" text NOT NULL,
	"prompt_version" text NOT NULL,
	"rubric_version" text,
	"input_hash" text NOT NULL,
	"raw_output" text,
	"parsed_output" jsonb,
	"tokens_input" integer,
	"tokens_output" integer,
	"cost_usd" numeric,
	"latency_ms" integer,
	"status" "evaluation_status" DEFAULT 'pending' NOT NULL,
	"crosscheck_group" uuid,
	"disagreement" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mcq_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"selected_option" text,
	"is_correct" boolean,
	"time_ms" integer,
	"order_index" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"qualities" jsonb NOT NULL,
	"contradictions" jsonb,
	"authenticity" jsonb,
	"confidence" numeric NOT NULL,
	"tests_completed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "written_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid NOT NULL,
	"item_ref" text NOT NULL,
	"prompt" text NOT NULL,
	"response_text" text,
	"image_media_id" uuid,
	"ocr_text" text,
	"ocr_confirmed" boolean DEFAULT false NOT NULL,
	"timing_meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_batches" ADD CONSTRAINT "import_batches_test_type_id_test_types_id_fk" FOREIGN KEY ("test_type_id") REFERENCES "public"."test_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_batches" ADD CONSTRAINT "import_batches_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_test_type_id_test_types_id_fk" FOREIGN KEY ("test_type_id") REFERENCES "public"."test_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_bank_id_question_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."question_banks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_test_type_id_test_types_id_fk" FOREIGN KEY ("test_type_id") REFERENCES "public"."test_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_media_id_media_assets_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rubrics" ADD CONSTRAINT "rubrics_test_type_id_test_types_id_fk" FOREIGN KEY ("test_type_id") REFERENCES "public"."test_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rubrics" ADD CONSTRAINT "rubrics_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staging_questions" ADD CONSTRAINT "staging_questions_batch_id_import_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."import_batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staging_questions" ADD CONSTRAINT "staging_questions_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_test_type_id_test_types_id_fk" FOREIGN KEY ("test_type_id") REFERENCES "public"."test_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_bank_id_question_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."question_banks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_test_type_id_test_types_id_fk" FOREIGN KEY ("test_type_id") REFERENCES "public"."test_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcq_responses" ADD CONSTRAINT "mcq_responses_attempt_id_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcq_responses" ADD CONSTRAINT "mcq_responses_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_snapshots" ADD CONSTRAINT "profile_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "written_responses" ADD CONSTRAINT "written_responses_attempt_id_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "written_responses" ADD CONSTRAINT "written_responses_image_media_id_media_assets_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "consents_user_id_idx" ON "consents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "otp_codes_user_purpose_idx" ON "otp_codes" USING btree ("user_id","purpose");--> statement-breakpoint
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_key" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "import_batches_status_idx" ON "import_batches" USING btree ("status");--> statement-breakpoint
CREATE INDEX "media_assets_kind_idx" ON "media_assets" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "question_banks_test_type_idx" ON "question_banks" USING btree ("test_type_id");--> statement-breakpoint
CREATE INDEX "question_banks_status_idx" ON "question_banks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "questions_bank_idx" ON "questions" USING btree ("bank_id");--> statement-breakpoint
CREATE INDEX "questions_test_type_idx" ON "questions" USING btree ("test_type_id");--> statement-breakpoint
CREATE INDEX "questions_status_idx" ON "questions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "questions_topic_idx" ON "questions" USING btree ("topic");--> statement-breakpoint
CREATE UNIQUE INDEX "questions_content_hash_key" ON "questions" USING btree ("content_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "rubrics_test_type_version_key" ON "rubrics" USING btree ("test_type_id","version");--> statement-breakpoint
CREATE INDEX "staging_questions_batch_idx" ON "staging_questions" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "staging_questions_status_idx" ON "staging_questions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "test_types_code_key" ON "test_types" USING btree ("code");--> statement-breakpoint
CREATE INDEX "attempts_user_idx" ON "attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "attempts_test_type_idx" ON "attempts" USING btree ("test_type_id");--> statement-breakpoint
CREATE INDEX "attempts_status_idx" ON "attempts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "attempts_user_status_idx" ON "attempts" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "evaluations_subject_idx" ON "evaluations" USING btree ("subject_type","subject_id");--> statement-breakpoint
CREATE INDEX "evaluations_user_idx" ON "evaluations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "evaluations_status_idx" ON "evaluations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "evaluations_crosscheck_idx" ON "evaluations" USING btree ("crosscheck_group");--> statement-breakpoint
CREATE INDEX "mcq_responses_attempt_idx" ON "mcq_responses" USING btree ("attempt_id");--> statement-breakpoint
CREATE INDEX "mcq_responses_question_idx" ON "mcq_responses" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "profile_snapshots_user_idx" ON "profile_snapshots" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "written_responses_attempt_idx" ON "written_responses" USING btree ("attempt_id");