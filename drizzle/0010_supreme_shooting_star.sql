DROP INDEX "gk_topics_slug_key";--> statement-breakpoint
CREATE UNIQUE INDEX "gk_topics_kind_slug_key" ON "gk_topics" USING btree ("kind","slug");