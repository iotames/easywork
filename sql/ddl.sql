
--------------PostgreSQL DDL----------------------------
CREATE TABLE public.res_users (
	id serial4 NOT NULL,
    real_name varchar NOT NULL,
    mobile varchar NULL,
    email varchar NULL,
	active bool DEFAULT true NULL,
	create_date timestamp NULL,
	update_date timestamp NULL,
	-- login varchar NOT NULL,
	"password" varchar NULL,
	create_uid int4 NULL,
	update_uid int4 NULL,
	-- CONSTRAINT res_users_login_key UNIQUE (login),
	CONSTRAINT res_users_pkey PRIMARY KEY (id),
	CONSTRAINT res_users_create_uid_fkey FOREIGN KEY (create_uid) REFERENCES public.res_users(id) ON DELETE SET NULL,
	CONSTRAINT res_users_update_uid_fkey FOREIGN KEY (update_uid) REFERENCES public.res_users(id) ON DELETE SET NULL
);
