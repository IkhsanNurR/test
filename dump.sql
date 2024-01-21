--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    books_code character varying NOT NULL,
    title character varying NOT NULL,
    author character varying NOT NULL,
    stock integer NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.books OWNER TO postgres;

--
-- Name: members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.members (
    members_code character varying NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    penalized boolean DEFAULT false NOT NULL,
    penalized_until timestamp with time zone
);


ALTER TABLE public.members OWNER TO postgres;

--
-- Name: transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction (
    id integer NOT NULL,
    books_code character varying NOT NULL,
    members_code character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    returned_at timestamp with time zone
);


ALTER TABLE public.transaction OWNER TO postgres;

--
-- Name: transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_id_seq OWNER TO postgres;

--
-- Name: transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaction_id_seq OWNED BY public.transaction.id;


--
-- Name: transaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction ALTER COLUMN id SET DEFAULT nextval('public.transaction_id_seq'::regclass);


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books (books_code, title, author, stock, updated_at, created_at) FROM stdin;
JK-45	Harry Potter	J.K Rowling	10	2024-01-19 19:03:12.873444+07	2024-01-19 19:03:12.873444+07
NRN-7	The Lion, the Witch and the Wardrobe	C.S. Lewis	10	2024-01-19 19:03:12.873444+07	2024-01-19 19:03:12.873444+07
SHR-1	A Study in Scarlet	Arthur Conan Doyle	9	2024-01-19 19:03:12.873444+07	2024-01-19 19:03:12.873444+07
TW-11	Twilight	Stephenie Meyer	8	2024-01-19 19:03:12.873444+07	2024-01-19 19:03:12.873444+07
HOB-83	The Hobbit, or There and Back Again	J.R.R. Tolkien	9	2024-01-19 19:03:12.873444+07	2024-01-19 19:03:12.873444+07
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.members (members_code, name, created_at, updated_at, penalized, penalized_until) FROM stdin;
M002	Ferry	2024-01-19 19:05:37.159744+07	2024-01-19 19:05:37.19929+07	f	\N
M003	Putri	2024-01-19 19:05:37.159744+07	2024-01-19 19:05:37.19929+07	f	\N
M001	Angga	2024-01-19 19:05:37.159744+07	2024-01-19 19:05:37.19929+07	f	\N
\.


--
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction (id, books_code, members_code, created_at, updated_at, returned_at) FROM stdin;
11	HOB-83	M001	2024-01-21 22:53:29.957532+07	2024-01-21 22:53:29.957532+07	\N
\.


--
-- Name: transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_id_seq', 1, false);


--
-- Name: books books_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pk PRIMARY KEY (books_code);


--
-- Name: members members_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pk PRIMARY KEY (members_code);


--
-- Name: transaction transaction_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pk PRIMARY KEY (id);


--
-- Name: transaction transaction_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_unique UNIQUE (books_code, members_code);


--
-- Name: transaction transaction_books_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_books_fk FOREIGN KEY (books_code) REFERENCES public.books(books_code);


--
-- Name: transaction transaction_members_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_members_fk FOREIGN KEY (members_code) REFERENCES public.members(members_code);


--
-- PostgreSQL database dump complete
--

