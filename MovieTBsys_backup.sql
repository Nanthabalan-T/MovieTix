--
-- PostgreSQL database dump
--

\restrict gtwy2UcF1GTWGTPEJ1fLD09oDUqCq6yOEXZeWQXe6zeAeJS8chtHeLncwQ0xMfV

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

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
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    booking_id integer NOT NULL,
    movie_name character varying(100) NOT NULL,
    theatre_name character varying(100) NOT NULL,
    show_date date NOT NULL,
    show_time time without time zone NOT NULL,
    seat_number character varying(20) NOT NULL,
    customer_name character varying(100),
    customer_phone character varying(15),
    booking_amount numeric(10,2),
    booking_status character varying(20) DEFAULT 'BOOKED'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: bookings_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_booking_id_seq OWNER TO postgres;

--
-- Name: bookings_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_booking_id_seq OWNED BY public.bookings.booking_id;


--
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    genre character varying(100) NOT NULL,
    language character varying(50) NOT NULL,
    duration character varying(20) NOT NULL,
    certificate character varying(20) DEFAULT 'U/A'::character varying,
    release_date date,
    poster text,
    description text,
    rating numeric(3,1) DEFAULT 0,
    year integer,
    status character varying(20) DEFAULT 'Now Showing'::character varying,
    trending boolean DEFAULT false,
    featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- Name: movies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_id_seq OWNER TO postgres;

--
-- Name: movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_id_seq OWNED BY public.movies.id;


--
-- Name: bookings booking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.bookings_booking_id_seq'::regclass);


--
-- Name: movies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN id SET DEFAULT nextval('public.movies_id_seq'::regclass);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (booking_id, movie_name, theatre_name, show_date, show_time, seat_number, customer_name, customer_phone, booking_amount, booking_status, created_at) FROM stdin;
1	Coolie	SUGAPRIYA	2026-07-03	13:30:00	B3	Nanthabalan	7987987999	200.00	BOOKED	2026-07-03 11:00:07.179884
2	Leo	MINIPRIYA	2026-07-03	13:30:00	B3	iojfoidsjfodsjf	5456464465	220.00	BOOKED	2026-07-03 11:00:37.472619
3	Coolie	SUGAPRIYA	2026-07-04	13:30:00	B3	uggjlgj	5254346534	200.00	BOOKED	2026-07-03 11:01:01.874564
4	Coolie	SUGAPRIYA	2026-07-05	13:30:00	B3	uufthfgh	6452685555	200.00	BOOKED	2026-07-03 11:01:56.32671
5	Coolie	CINEPRIYA	2026-07-05	18:30:00	B3	trtytry	6537863453	300.00	BOOKED	2026-07-03 11:06:00.484242
6	Coolie	SUGAPRIYA	2026-07-05	18:30:00	B3	hgfgh	8767878758	260.00	BOOKED	2026-07-03 11:06:52.652402
7	GOAT	MINIPRIYA	2026-07-05	18:30:00	B3	auyyggappppa	4423333333	280.00	BOOKED	2026-07-03 11:45:49.752951
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movies (id, title, genre, language, duration, certificate, release_date, poster, description, rating, year, status, trending, featured, created_at) FROM stdin;
1	Leo	Action	Tamil	2h 42m	U/A	2023-10-19	https://image.tmdb.org/t/p/w500/npdB6eFzizki0WaZ1OvKcJV3scu.jpg	A man embroiled in the underworld is forced to confront his violent past when his family is threatened.	7.5	2023	Now Showing	t	t	2026-07-03 10:52:41.953758
2	RRR	Action	Telugu	2h 57m	U/A	2022-03-25	https://image.tmdb.org/t/p/w500/cNV5G2oH5n5KuP9bEgR0gDw5wG.jpg	A fictitious story about two legendary Indian revolutionaries and their journey away from and back to the motherland.	7.8	2022	Now Showing	t	f	2026-07-03 10:52:41.953758
3	Jawan	Action	Hindi	2h 49m	U/A	2023-09-07	https://image.tmdb.org/t/p/w500/kS5pYhMkxSsd9nrdLPrxSvEoWkq.jpg	A man driven by a personal vendetta against a ruthless businessman systematically targets the corrupt system.	7.2	2023	Now Showing	t	f	2026-07-03 10:52:41.953758
4	Coolie	Action	Tamil	2h 30m	U/A	2025-08-14	https://image.tmdb.org/t/p/w500/placeholder.jpg	A high-octane action thriller set in the world of gold smuggling.	0.0	2025	Coming Soon	t	t	2026-07-03 10:52:41.953758
5	GOAT	Action	Tamil	2h 45m	U/A	2024-09-05	https://image.tmdb.org/t/p/w500/placeholder.jpg	An action-packed entertainer featuring dual roles spanning different time periods.	0.0	2024	Now Showing	f	t	2026-07-03 10:52:41.953758
6	Oppenheimer	Drama	English	3h 0m	U/A	2023-07-21	https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg	The story of American physicist J. Robert Oppenheimer and his role in the development of the atomic bomb.	8.3	2023	Now Showing	t	t	2026-07-03 10:52:41.953758
\.


--
-- Name: bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_booking_id_seq', 7, true);


--
-- Name: movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_id_seq', 6, true);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict gtwy2UcF1GTWGTPEJ1fLD09oDUqCq6yOEXZeWQXe6zeAeJS8chtHeLncwQ0xMfV

