revoke delete on table "public"."auth_tokens" from "anon";

revoke insert on table "public"."auth_tokens" from "anon";

revoke references on table "public"."auth_tokens" from "anon";

revoke select on table "public"."auth_tokens" from "anon";

revoke trigger on table "public"."auth_tokens" from "anon";

revoke truncate on table "public"."auth_tokens" from "anon";

revoke update on table "public"."auth_tokens" from "anon";

revoke delete on table "public"."auth_tokens" from "authenticated";

revoke insert on table "public"."auth_tokens" from "authenticated";

revoke references on table "public"."auth_tokens" from "authenticated";

revoke select on table "public"."auth_tokens" from "authenticated";

revoke trigger on table "public"."auth_tokens" from "authenticated";

revoke truncate on table "public"."auth_tokens" from "authenticated";

revoke update on table "public"."auth_tokens" from "authenticated";

revoke delete on table "public"."auth_tokens" from "service_role";

revoke insert on table "public"."auth_tokens" from "service_role";

revoke references on table "public"."auth_tokens" from "service_role";

revoke select on table "public"."auth_tokens" from "service_role";

revoke trigger on table "public"."auth_tokens" from "service_role";

revoke truncate on table "public"."auth_tokens" from "service_role";

revoke update on table "public"."auth_tokens" from "service_role";

alter table "public"."auth_tokens" drop constraint "auth_tokens_pkey";

drop index if exists "public"."auth_tokens_pkey";

drop table "public"."auth_tokens";


