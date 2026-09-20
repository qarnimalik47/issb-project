CREATE TYPE "public"."gk_topic_kind" AS ENUM('gk', 'current_affairs');--> statement-breakpoint
CREATE TABLE "gk_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "gk_topic_kind" NOT NULL,
	"slug" text NOT NULL,
	"title_en" text NOT NULL,
	"title_ur" text,
	"section" text NOT NULL,
	"summary_en" text NOT NULL,
	"summary_ur" text,
	"issb_angle" text,
	"facts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"points" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"timeline" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"coverage" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"origin" text DEFAULT 'curated' NOT NULL,
	"narrative_model" text,
	"status" "content_status" DEFAULT 'published' NOT NULL,
	"last_gathered_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flashcards" ADD COLUMN "topic_id" uuid;--> statement-breakpoint
CREATE UNIQUE INDEX "gk_topics_slug_key" ON "gk_topics" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "gk_topics_kind_section_idx" ON "gk_topics" USING btree ("kind","section");--> statement-breakpoint
CREATE INDEX "gk_topics_status_idx" ON "gk_topics" USING btree ("status");--> statement-breakpoint
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_topic_id_gk_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."gk_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "flashcards_topic_idx" ON "flashcards" USING btree ("topic_id");