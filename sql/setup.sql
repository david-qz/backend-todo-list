-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
drop table if exists todos;
drop table if exists users;

create table users (
    id bigint generated always as identity primary key,
    email varchar(320) not null unique,
    password_hash text not null
);

create table todos (
    id bigint generated always as identity primary key,
    user_id bigint references users (id),
    task text not null,
    completed boolean not null default false
);
