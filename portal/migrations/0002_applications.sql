-- HKATA school applications + admin allowlist + audit + submit throttle
create table if not exists admins (
  user_id    text primary key,
  created_at timestamptz not null default now()
);

create table if not exists applications (
  id                   serial primary key,
  application_id       text not null unique,
  school_name_cn       text not null,
  school_name_en       text not null,
  school_name_en_norm  text not null,
  school_category      text not null,
  school_district      text not null,
  school_address       text not null,
  teacher_name         text not null,
  teacher_title        text not null,
  teacher_title_other  text not null default '',
  teacher_email        text not null,
  teacher_email_norm   text not null,
  teacher_phone        text not null,
  level                text not null,
  tracks               jsonb not null,
  kit_priority         jsonb,
  briefing_session     text not null default '',
  referrer_level       text not null default '',
  force_submit         boolean not null default false,
  status               text not null default 'submitted',
  admin_note           text not null default '',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint applications_level_chk check (level in ('kindergarten', 'primary', 'secondary')),
  constraint applications_category_chk check (school_category in ('kindergarten', 'primary', 'secondary', 'special')),
  constraint applications_status_chk check (status in ('submitted', 'reviewing', 'approved', 'waitlisted', 'rejected'))
);

create index if not exists applications_status_idx on applications (status);
create index if not exists applications_created_idx on applications (created_at desc);
create index if not exists applications_level_idx on applications (level);
create index if not exists applications_school_en_norm_idx on applications (school_name_en_norm);
create index if not exists applications_email_norm_idx on applications (teacher_email_norm);

create table if not exists application_events (
  id              serial primary key,
  application_id  integer not null references applications(id) on delete restrict,
  actor_user_id   text not null,
  action          text not null,
  from_status     text,
  to_status       text,
  note            text not null default '',
  created_at      timestamptz not null default now()
);

create index if not exists application_events_app_idx on application_events (application_id, created_at desc);

create table if not exists submit_attempts (
  id          serial primary key,
  email_norm  text not null,
  created_at  timestamptz not null default now()
);

create index if not exists submit_attempts_email_time_idx on submit_attempts (email_norm, created_at desc);
