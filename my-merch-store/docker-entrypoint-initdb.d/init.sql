--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-04-30 13:20:43

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16415)
-- Name: inventory; Type: TABLE; Schema: public; Owner: storefront
--

CREATE TABLE public.inventory (
    merch_id integer,
    quantity integer
);


ALTER TABLE public.inventory OWNER TO storefront;

--
-- TOC entry 218 (class 1259 OID 16418)
-- Name: merch; Type: TABLE; Schema: public; Owner: storefront
--

CREATE TABLE public.merch (
    id integer NOT NULL,
    name character varying(90),
    price numeric(10,2),
    picture character varying
);


ALTER TABLE public.merch OWNER TO storefront;

--
-- TOC entry 219 (class 1259 OID 16423)
-- Name: merch_id_seq; Type: SEQUENCE; Schema: public; Owner: storefront
--

CREATE SEQUENCE public.merch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.merch_id_seq OWNER TO storefront;

--
-- TOC entry 4914 (class 0 OID 0)
-- Dependencies: 219
-- Name: merch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: storefront
--

ALTER SEQUENCE public.merch_id_seq OWNED BY public.merch.id;


--
-- TOC entry 221 (class 1259 OID 16434)
-- Name: reviews; Type: TABLE; Schema: public; Owner: storefront
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    title character varying,
    rating smallint,
    review character varying
);


ALTER TABLE public.reviews OWNER TO storefront;

--
-- TOC entry 220 (class 1259 OID 16433)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: storefront
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO storefront;

--
-- TOC entry 4915 (class 0 OID 0)
-- Dependencies: 220
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: storefront
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 4751 (class 2604 OID 16424)
-- Name: merch id; Type: DEFAULT; Schema: public; Owner: storefront
--

ALTER TABLE ONLY public.merch ALTER COLUMN id SET DEFAULT nextval('public.merch_id_seq'::regclass);


--
-- TOC entry 4752 (class 2604 OID 16437)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: storefront
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4904 (class 0 OID 16415)
-- Dependencies: 217
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: storefront
--

COPY public.inventory (merch_id, quantity) FROM stdin;
1	5
2	2
3	20
\.


--
-- TOC entry 4905 (class 0 OID 16418)
-- Dependencies: 218
-- Data for Name: merch; Type: TABLE DATA; Schema: public; Owner: storefront
--

COPY public.merch (id, name, price, picture) FROM stdin;
1	T-Shirt	20.00	shirt.png
2	Hat	10.00	hat.png
3	Sticker	2.00	sticker.png
\.


--
-- TOC entry 4908 (class 0 OID 16434)
-- Dependencies: 221
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: storefront
--

COPY public.reviews (id, title, rating, review) FROM stdin;
1	Clair Obscur: Expedition 33	5	This game is like if a French art museum exploded into an RPG. The combat is turn-based but throws in real-time dodging and parrying, keeping you on your toes. The story? A cursed countdown where people vanish annually—talk about pressure! It's emotionally gripping, visually stunning, and the voice acting is top-notch. Despite minor quirks, it's a masterpiece.
2	Atomfall	3	Set in a post-apocalyptic Lake District, this game nails atmosphere. But the lack of fast travel turns it into a walking simulator nightmare. You'll traverse the same areas repeatedly, facing tough enemies that ruin the pacing. It's like being stuck in a scenic loop of frustration.
3	Avowed	4	Obsidian delivers a rich world with engaging lore. The 'Dawntreader' quest is a standout, making the world feel alive. It's a refreshing change from games that dump lore through endless text. A solid RPG that respects your time and curiosity.
4	Promise Mascot Agency	4	Managing a mascot agency in a world inspired by Japanese folklore? It's as bizarre as it sounds, but it works. A blend of sim and visual novel that’s quirky, heartfelt, and surprisingly engaging.
5	Lost Records: Bloom and Rage	4	A narrative adventure that dives deep into nostalgia and memory. Set in 1990s Michigan, it explores inconsistencies of memory and unresolved trauma. A thoughtful journey that resonates.
6	Oblivion Remastered	3	Revisiting this classic feels like opening a time capsule. Great mechanics and early celebrity voice acting shine, but technical issues and those creepy NPC faces hold it back. Nostalgia trip with bumps.
7	Doom: The Dark Ages	4	Doom goes medieval and it’s a blast. Slayer trades guns for swords, battling demons in a brutal dark fantasy. Fast, intense, and fresh while retaining classic Doom feel.
8	Monster Hunter Wilds	4	Capcom delivers another epic. Gorgeous environments and new mechanics deepen the hunts. Challenging and rewarding, it’s a must-play—just kiss your free time goodbye.
9	Split Fiction	4	A co-op platformer with tight gameplay and an engaging narrative. A stellar example of fun and depth combined. Grab a friend and go!
10	Borderlands 4	3	More guns, humor, and chaos. Doesn’t reinvent anything but keeps the formula fun. Jokes may be stale, but gameplay is rock solid. A fun ride, not a game-changer.
\.


--
-- TOC entry 4916 (class 0 OID 0)
-- Dependencies: 219
-- Name: merch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: storefront
--

SELECT pg_catalog.setval('public.merch_id_seq', 3, true);


--
-- TOC entry 4917 (class 0 OID 0)
-- Dependencies: 220
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: storefront
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- TOC entry 4755 (class 2606 OID 16426)
-- Name: merch merchid_primarykey; Type: CONSTRAINT; Schema: public; Owner: storefront
--

ALTER TABLE ONLY public.merch
    ADD CONSTRAINT merchid_primarykey PRIMARY KEY (id);


--
-- TOC entry 4757 (class 2606 OID 16441)
-- Name: reviews reviewid_primarykey; Type: CONSTRAINT; Schema: public; Owner: storefront
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviewid_primarykey PRIMARY KEY (id);


--
-- TOC entry 4753 (class 1259 OID 16427)
-- Name: fki_merch_id_foreign_key; Type: INDEX; Schema: public; Owner: storefront
--

CREATE INDEX fki_merch_id_foreign_key ON public.inventory USING btree (merch_id);


--
-- TOC entry 4758 (class 2606 OID 16428)
-- Name: inventory merchid_inventory_foreign_key; Type: FK CONSTRAINT; Schema: public; Owner: storefront
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT merchid_inventory_foreign_key FOREIGN KEY (merch_id) REFERENCES public.merch(id) NOT VALID;


-- Completed on 2025-04-30 13:20:44

--
-- PostgreSQL database dump complete
--

