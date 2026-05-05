--
-- PostgreSQL database dump
--

\restrict EO5b1Ua7uvfugAg6DXk9TxBhwbP1Bs1FZOWMd7BbvZsbEDP1hx4o7to0H5vDLvn

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: varsha; Type: SCHEMA; Schema: -; Owner: varsha_user
--

CREATE SCHEMA varsha;


ALTER SCHEMA varsha OWNER TO varsha_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Users; Type: TABLE; Schema: varsha; Owner: varsha_user
--

CREATE TABLE varsha."Users" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    "phoneNo" bigint NOT NULL,
    role character varying(20) DEFAULT ''::character varying NOT NULL,
    avatar_url text,
    bio text,
    is_active boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE varsha."Users" OWNER TO varsha_user;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: varsha; Owner: varsha_user
--

CREATE SEQUENCE varsha."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE varsha."Users_id_seq" OWNER TO varsha_user;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: varsha; Owner: varsha_user
--

ALTER SEQUENCE varsha."Users_id_seq" OWNED BY varsha."Users".id;


--
-- Name: messages; Type: TABLE; Schema: varsha; Owner: varsha_user
--

CREATE TABLE varsha.messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    content text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now(),
    seen boolean DEFAULT false
);


ALTER TABLE varsha.messages OWNER TO varsha_user;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: varsha; Owner: varsha_user
--

CREATE SEQUENCE varsha.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE varsha.messages_id_seq OWNER TO varsha_user;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: varsha; Owner: varsha_user
--

ALTER SEQUENCE varsha.messages_id_seq OWNED BY varsha.messages.id;


--
-- Name: post; Type: TABLE; Schema: varsha; Owner: varsha_user
--

CREATE TABLE varsha.post (
    postid integer NOT NULL,
    name character varying(250) DEFAULT 'Anonymous'::character varying,
    description text,
    title character varying(255),
    filepath text,
    status character varying(20),
    "RejectedReason" text,
    userid integer,
    is_deleted boolean DEFAULT false,
    deleted_reason text,
    CONSTRAINT post_status_check CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Approved'::character varying, 'Rejected'::character varying])::text[])))
);


ALTER TABLE varsha.post OWNER TO varsha_user;

--
-- Name: post_postid_seq; Type: SEQUENCE; Schema: varsha; Owner: varsha_user
--

CREATE SEQUENCE varsha.post_postid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE varsha.post_postid_seq OWNER TO varsha_user;

--
-- Name: post_postid_seq; Type: SEQUENCE OWNED BY; Schema: varsha; Owner: varsha_user
--

ALTER SEQUENCE varsha.post_postid_seq OWNED BY varsha.post.postid;


--
-- Name: refresh_tokens; Type: TABLE; Schema: varsha; Owner: varsha_user
--

CREATE TABLE varsha.refresh_tokens (
    id integer NOT NULL,
    token text NOT NULL,
    user_id integer NOT NULL,
    expiry_date timestamp without time zone NOT NULL,
    is_revoked boolean DEFAULT false
);


ALTER TABLE varsha.refresh_tokens OWNER TO varsha_user;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: varsha; Owner: varsha_user
--

CREATE SEQUENCE varsha.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE varsha.refresh_tokens_id_seq OWNER TO varsha_user;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: varsha; Owner: varsha_user
--

ALTER SEQUENCE varsha.refresh_tokens_id_seq OWNED BY varsha.refresh_tokens.id;


--
-- Name: roles; Type: TABLE; Schema: varsha; Owner: varsha_user
--

CREATE TABLE varsha.roles (
    id integer NOT NULL,
    name character varying(250) NOT NULL
);


ALTER TABLE varsha.roles OWNER TO varsha_user;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: varsha; Owner: varsha_user
--

CREATE SEQUENCE varsha.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE varsha.roles_id_seq OWNER TO varsha_user;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: varsha; Owner: varsha_user
--

ALTER SEQUENCE varsha.roles_id_seq OWNED BY varsha.roles.id;


--
-- Name: Users id; Type: DEFAULT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha."Users" ALTER COLUMN id SET DEFAULT nextval('varsha."Users_id_seq"'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.messages ALTER COLUMN id SET DEFAULT nextval('varsha.messages_id_seq'::regclass);


--
-- Name: post postid; Type: DEFAULT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.post ALTER COLUMN postid SET DEFAULT nextval('varsha.post_postid_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('varsha.refresh_tokens_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.roles ALTER COLUMN id SET DEFAULT nextval('varsha.roles_id_seq'::regclass);


--
-- Name: Users Users_name_key; Type: CONSTRAINT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha."Users"
    ADD CONSTRAINT "Users_name_key" UNIQUE (name);


--
-- Name: Users Users_phoneNo_key; Type: CONSTRAINT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha."Users"
    ADD CONSTRAINT "Users_phoneNo_key" UNIQUE ("phoneNo");


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (postid);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES varsha."Users"(id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: varsha; Owner: varsha_user
--

ALTER TABLE ONLY varsha.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES varsha."Users"(id);


--
-- PostgreSQL database dump complete
--

\unrestrict EO5b1Ua7uvfugAg6DXk9TxBhwbP1Bs1FZOWMd7BbvZsbEDP1hx4o7to0H5vDLvn

