CREATE TABLE "flashcard_state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"repetitions" integer DEFAULT 0 NOT NULL,
	"interval_days" integer DEFAULT 0 NOT NULL,
	"easiness" numeric DEFAULT '2.5' NOT NULL,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "flashcards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deck" text NOT NULL,
	"front_en" text NOT NULL,
	"front_ur" text,
	"back_en" text NOT NULL,
	"back_ur" text,
	"topic" text,
	"status" "content_status" DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gk_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"headline" text NOT NULL,
	"summary_en" text NOT NULL,
	"summary_ur" text,
	"category" text NOT NULL,
	"issb_angle" text,
	"one_liner" text,
	"source_name" text,
	"source_url" text,
	"published_date" date,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"approved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gk_bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"article_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flashcard_state" ADD CONSTRAINT "flashcard_state_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_state" ADD CONSTRAINT "flashcard_state_card_id_flashcards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."flashcards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gk_articles" ADD CONSTRAINT "gk_articles_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gk_bookmarks" ADD CONSTRAINT "gk_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gk_bookmarks" ADD CONSTRAINT "gk_bookmarks_article_id_gk_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."gk_articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "flashcard_state_user_card_key" ON "flashcard_state" USING btree ("user_id","card_id");--> statement-breakpoint
CREATE INDEX "flashcard_state_due_idx" ON "flashcard_state" USING btree ("user_id","due_at");--> statement-breakpoint
CREATE INDEX "flashcards_deck_idx" ON "flashcards" USING btree ("deck");--> statement-breakpoint
CREATE INDEX "flashcards_status_idx" ON "flashcards" USING btree ("status");--> statement-breakpoint
CREATE INDEX "gk_articles_status_idx" ON "gk_articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "gk_articles_category_idx" ON "gk_articles" USING btree ("category");--> statement-breakpoint
CREATE INDEX "gk_articles_date_idx" ON "gk_articles" USING btree ("published_date");--> statement-breakpoint
CREATE UNIQUE INDEX "gk_bookmarks_user_article_key" ON "gk_bookmarks" USING btree ("user_id","article_id");