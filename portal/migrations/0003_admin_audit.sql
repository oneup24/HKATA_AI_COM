-- Admin action audit (exports and other bulk operations). No PII in `detail`.
create table if not exists admin_audit (
  id             serial primary key,
  actor_user_id  text not null,
  action         text not null,
  detail         text not null default '',
  created_at     timestamptz not null default now()
);

create index if not exists admin_audit_actor_time_idx
  on admin_audit (actor_user_id, action, created_at desc);
