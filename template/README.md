## 用法

1.创建MemFire Cloud 应用

2.创建数据表

```sql
-- 创建用户信息表
CREATE TABLE "public"."profile" ( 
  "id" uuid default uuid_generate_v4() primary key,
  "created_at" timestamp default now() ,
  "email" TEXT,
  "user_name" TEXT,
  "avatar" VARCHAR,
  "introduction" VARCHAR
);
-- 创建todo表
CREATE TABLE "public"."todo_list" ( 
  "id" SERIAL,
  "created_at" timestamp default now() ,
  "user_id" uuid references public.profile not null,
  "todo" VARCHAR NOT NULL,
  "completed" BOOLEAN NOT NULL
);
-- 创建聊天记录表
CREATE TABLE "public"."messages" ( 
  "id" SERIAL,
  "user_id" uuid references public.profile not null,
  "created_at" timestamp default now() ,
  "message" TEXT NOT NULL,
  "user_name" TEXT NOT NULL,
  "avatar" VARCHAR NOT NULL
);
-- Set up Row Level Security (RLS)
alter table todo_list enable row level security;

-- 用户自己可以只能删改查自己的todo
create policy "Users can select their own todo_list."
  on todo_list for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own todo_list."
  on todo_list for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own todo_list."
  on todo_list for update
  using ( auth.uid() = user_id );

  create policy "Users can delete own todo_list."
  on todo_list for delete
  using ( auth.uid() = user_id );

-- 人员信息列表每个人都可以访问
alter table account
  enable row level security;

create policy "Public account are viewable by everyone." on account
  for select using (true);

create policy "Users can insert their own account." on account
  for insert with check (true);

create policy "Users can select their own account." on account
  for update using (true);

create policy "Users can delete their own account." on account
  for delete using (true);


-- 聊天信息表每个人都可以查询数据；只有用户自己才能发送消息。

alter table messages
  enable row level security;

create policy "Public messages are viewable by everyone." on messages
  for select using (true);

create policy "Users can insert their own messages." on messages
  for insert with check (auth.uid() = user_id);

/**
 * REALTIME SUBSCRIPTIONS
 * 只允许在公共表进行实时监听。
 */

begin;
  -- remove the realtime publication
  drop publication if exists supabase_realtime;

  -- re-create the publication but don't enable it for any tables
  create publication supabase_realtime;
commit;

-- add tables to the publication
alter publication supabase_realtime add table public.messages;

-- 创建存储桶
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

insert into storage.buckets (id, name)
values ('files', 'files');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "files images are publicly accessible." on storage.objects
  for select using ( true );

create policy "Own can upload an files." on storage.objects
  for insert with check (true);

create policy "Own can update their own files." on storage.objects
  for update using ( true );

create policy "Own can delete their own files." on storage.objects
  for delete using ( true);
```
3.在supabaseClient.js文件里配置memfire cloud应用的API访问地址和anon_key