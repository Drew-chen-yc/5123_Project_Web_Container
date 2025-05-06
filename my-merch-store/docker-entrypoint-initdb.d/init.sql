--
-- storefrontQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-06 15:03:25

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
    merch_id integer NOT NULL,
    quantity integer,
    size character varying(50) NOT NULL
);


ALTER TABLE public.inventory OWNER TO storefront;

--
-- TOC entry 218 (class 1259 OID 16418)
-- Name: merch; Type: TABLE; Schema: public; Owner: storefront
--

CREATE TABLE public.merch (
    id integer NOT NULL,
    name character varying(90),
    category character varying(50),
    price numeric,
    picture character varying(50),
    description character varying
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
-- TOC entry 4916 (class 0 OID 0)
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
    review character varying,
    release_date date,
    review_date date,
    link character varying,
    category character varying(50)
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
-- TOC entry 4917 (class 0 OID 0)
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
-- TOC entry 4906 (class 0 OID 16415)
-- Dependencies: 217
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: storefront
--

COPY public.inventory (merch_id, quantity, size) FROM stdin;
1	4	Large
1	3	X-Large
2	2	One Size
3	20	
4	14	
5	7	
6	4	Queen
6	3	King
7	13	Medium
7	2	Large
7	3	X-Large
\.


--
-- TOC entry 4907 (class 0 OID 16418)
-- Dependencies: 218
-- Data for Name: merch; Type: TABLE DATA; Schema: public; Owner: storefront
--

COPY public.merch (id, name, category, price, picture, description) FROM stdin;
1	T-Shirt	Apparel	20	shirt.png	This cotton unisex tee is perfect for wiping your cheese puff-stained fingers on during a long gaming sesh. Game on!
2	Hat	Apparel	10	hat.png	What better to wear than a GAMEZONE hat to rep your gaming cred?
3	Sticker	Accessories	2	sticker.png	Show everyone that you, indeed, are a True Gamer.
4	Mousepad	Accessories	5	mousepad.png	Don't have one of those huge new mousepads? Fret not—the GAMEZONE has you covered. Frag everyone!
5	Drink Coozi	Accessories	6	coozi.png	Keep your Gaming Fuel nice and chill with this GAMEZONE coozi.
6	Blanket	Accessories	40	blanket.png	Gaming on a cold day? Wrap your body with this GAMEZONE blanket to add 50% cold resistance!
7	Hoodie	Apparel	50	hoodie.png	With this premium cotton hoodie, you will be a Certified Gaming God. The GAMEZONE is yours to command.
\.


--
-- TOC entry 4910 (class 0 OID 16434)
-- Dependencies: 221
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: storefront
--

COPY public.reviews (id, title, rating, review, release_date, review_date, link, category) FROM stdin;
1	Clair Obscur: Expedition 33	5	This game is like if a French art museum exploded into an RPG. The combat is turn-based but throws in real-time dodging and parrying, keeping you on your toes. The story? A cursed countdown where people vanish annually—talk about pressure! It's emotionally gripping, visually stunning, and the voice acting is top-notch. Despite minor quirks, it's a masterpiece.	2025-04-24	2025-04-20	https://store.steampowered.com/agecheck/app/1903340/	Turn-Based RPG
2	Atomfall	3	Set in a post-apocalyptic Lake District, this game nails atmosphere. But the lack of fast travel turns it into a walking simulator nightmare. You'll traverse the same areas repeatedly, facing tough enemies that ruin the pacing. It's like being stuck in a scenic loop of frustration.	2025-03-27	2025-03-26	https://store.steampowered.com/app/801800/Atomfall/	Action Survival
3	Avowed	4	Obsidian delivers a rich world with engaging lore. The 'Dawntreader' quest is a standout, making the world feel alive. It's a refreshing change from games that dump lore through endless text. A solid RPG that respects your time and curiosity.	2025-02-18	2025-02-20	https://store.steampowered.com/app/2457220/Avowed/	First-Person Action, RPG
4	Promise Mascot Agency	4	Managing a mascot agency in a world inspired by Japanese folklore? It's as bizarre as it sounds, but it works. A blend of sim and visual novel that’s quirky, heartfelt, and surprisingly engaging.	2025-04-10	2025-04-15	https://store.steampowered.com/app/2585830/Promise_Mascot_Agency/	Narrative Adventure / Sim
5	Lost Records: Bloom and Rage	4	A narrative adventure that dives deep into nostalgia and memory. Set in 1990s Michigan, it explores inconsistencies of memory and unresolved trauma. A thoughtful journey that resonates.	2025-02-18	2025-02-21	https://store.steampowered.com/app/1902960/Lost_Records_Bloom__Rage/	Story-Driven Adventure
6	Oblivion Remastered	3	Revisiting this classic feels like opening a time capsule. Great mechanics and early celebrity voice acting shine, but technical issues and those creepy NPC faces hold it back. Nostalgia trip with bumps.	2025-04-22	2025-04-24	https://store.steampowered.com/agecheck/app/2623190/	Open-World RPG
7	Doom: The Dark Ages	4	Doom goes medieval and it’s a blast. Slayer trades guns for swords, battling demons in a brutal dark fantasy. Fast, intense, and fresh while retaining classic Doom feel.	2025-05-14	2025-05-12	https://store.steampowered.com/agecheck/app/3017860/	First-Person Shooter (FPS)
8	Monster Hunter Wilds	4	Capcom delivers another epic. Gorgeous environments and new mechanics deepen the hunts. Challenging and rewarding, it’s a must-play—just kiss your free time goodbye.	2025-02-27	2025-02-25	https://store.steampowered.com/app/2246340/Monster_Hunter_Wilds/	Action RPG
9	Split Fiction	4	A co-op platformer with tight gameplay and an engaging narrative. A stellar example of fun and depth combined. Grab a friend and go!	2025-03-06	2025-03-04	https://store.steampowered.com/app/2001120/Split_Fiction/	Action-Adventure / Co-op
10	Borderlands 4	3	More guns, humor, and chaos. Doesn’t reinvent anything but keeps the formula fun. Jokes may be stale, but gameplay is rock solid. A fun ride, not a game-changer.	2025-09-12	2025-09-12	https://store.steampowered.com/agecheck/app/1285190/	FPS / Looter-Shooter
11	Don't Starve Together	4	A dark, quirky survival sandbox where everything wants you dead—including your friends. Chaotic, challenging, and strangely beautiful in its despair.	2016-04-23	2016-05-07	https://store.steampowered.com/app/322330/Dont_Starve_Together/	Survival / Co-op
12	Stardew Valley	5	The gold standard of cozy farming sims. Grow crops, fall in love, explore caves—lose your weekend. Peaceful yet deep, with heart in every pixel.	2016-02-26	2016-03-13	https://store.steampowered.com/app/413150/Stardew_Valley/	Farming Sim / Life RPG
13	Diablo IV	4	Grim, brutal, and beautifully crafted. Diablo IV returns to its dark roots with addictive loot, fluid combat, and a haunting open world.	2023-06-06	2023-06-25	https://store.steampowered.com/agecheck/app/2344520/	Action RPG
14	Lost Ark	3	A flashy ARPG-MMORPG hybrid with epic scale and fast combat. Endgame is a grind, but the early game is a thrilling rollercoaster.	2022-02-11	2022-02-25	https://store.steampowered.com/agecheck/app/1599340/	MMORPG / Action RPG
15	Palworld	5	A game combining Pokémon-style monster collecting and survival mechanics. The vast world and diverse gameplay make it highly immersive.	2024-01-18	2024-01-28	https://store.steampowered.com/app/1623730/Palworld/	Survival / Building / Monster Collecting
16	Age of Empires: Definitive Edition	4	A remaster of the classic RTS, now in 4K with modernized interfaces and multiplayer modes. It brings history’s grand battles back to life.	2019-08-19	2019-09-04	https://store.steampowered.com/app/1017900/Age_of_Empires_Definitive_Edition/	Real-Time Strategy / Historical Simulation
17	Rusty's Retirement	4	A relaxing idle farm game, perfect for casual play while doing other tasks. The cute art style and easy mechanics make it enjoyable.	2024-04-26	2024-05-09	https://store.steampowered.com/app/2666510/Rustys_Retirement/	Idle Farm Simulation
18	The Farmer Was Replaced	3	Control drones to automate farming, challenging players’ logic and efficiency. Great for fans of strategy and automation.	2023-02-10	2023-02-26	https://store.steampowered.com/app/2060160/The_Farmer_Was_Replaced/	Automation Farming Simulation
19	Plantera 2: Golden Acorn	4	A simple yet fun farming game where you grow plants and raise animals to create your own dream garden. Perfect for all ages.	2023-04-12	2023-04-30	https://store.steampowered.com/app/1091920/Plantera_2_Golden_Acorn/	Casual Farming Simulation
20	Cat God Ranch	4	Manage a farm run by animals and sacrifice to the Cat God. The quirky style and rich content make for a fun experience.	2024-09-13	2024-09-29	https://store.steampowered.com/app/2797340/Cat_God_Ranch/	Idle Farm Simulation
21	Sun Haven	5	A farming simulation with RPG elements, including farming, fishing, combat, and relationship-building with NPCs. Full of content.	2023-03-11	2023-03-29	https://store.steampowered.com/app/1432860/Sun_Haven/	Farming Life / Action RPG
22	Swords 'n Magic and Stuff	4	A co-op sandbox game blending adventure and farming elements. Explore, build, and enjoy a rich world with friends.	2020-09-08	2020-09-22	https://store.steampowered.com/app/810040/Swords_n_Magic_and_Stuff/	Sandbox Adventure / Farming Simulation
23	Black Myth: Wukong	5	Based on the legendary Journey to the West, this action RPG promises thrilling combat, a detailed story, and beautiful graphics. A must-play for myth lovers.	2024-08-19	2024-09-07	https://store.steampowered.com/app/2358720/Black_Myth_Wukong/	Action RPG / Mythical Adventure
24	Elden Ring	5	From the creators of Dark Souls, this vast open-world RPG offers tough combat, stunning landscapes, and an unforgettable journey.	2022-02-25	2022-03-17	https://store.steampowered.com/app/1245620/ELDEN_RING/	Open-World Action RPG
25	The Last of Us Part I	5	A post-apocalyptic survival story with deep emotional storytelling, solid combat mechanics, and a gripping narrative. A masterpiece.	2022-09-02	2022-09-22	https://store.steampowered.com/app/1888930/The_Last_of_Us_Part_I/	Action-Adventure / Horror
26	Resident Evil Village	5	The latest Resident Evil installment mixes traditional horror elements with action-packed gameplay, delivering a memorable experience.	2021-05-07	2021-05-18	https://store.steampowered.com/app/1196590/Resident_Evil_Village/	Horror / Action-Adventure
27	Silent Hill 2 Remake	4	The Silent Hill 2 remake brings new visuals and sound to the classic horror tale, with a chilling atmosphere and psychological dread.	2024-10-07	2024-10-21	https://store.steampowered.com/app/2124490/SILENT_HILL_2/	Survival Horror
28	Dead by Daylight	4	A multiplayer horror game where players either control survivors or a killer. The tense, unpredictable gameplay keeps you on edge.	2016-06-14	2016-06-25	https://store.steampowered.com/app/381210/Dead_by_Daylight/	Asymmetric Horror Multiplayer
29	Amnesia: The Dark Descent	5	A true psychological horror game that plays with fear of the unknown, putting players into a world full of terrifying creatures.	2010-09-08	2010-09-20	https://store.steampowered.com/app/57300/Amnesia_The_Dark_Descent/	Survival Horror / Puzzle
30	Outlast	4	A heart-pounding, first-person survival horror game where players navigate a psychiatric hospital while being hunted by horrifying creatures.	2013-09-04	2013-09-16	https://store.steampowered.com/app/238320/Outlast/	Survival Horror / First-Person
31	Blue Prince	4	A breathtaking action-adventure game that challenges your intellect. The clever puzzles, combined with the mysterious narrative, will keep you captivated from start to finish.	2025-04-10	2025-05-01	https://store.steampowered.com/app/1569580/Blue_Prince/	Action-Adventure / Puzzle
32	The Talos Principle: Reawakened	5	A mesmerizing puzzle game with a deep narrative that explores philosophy and artificial intelligence. A masterpiece that engages the mind and emotions.	2025-04-10	2025-05-06	https://store.steampowered.com/app/2806640/The_Talos_Principle_Reawakened/	Puzzle / First-Person Adventure
\.


--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 219
-- Name: merch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: storefront
--

SELECT pg_catalog.setval('public.merch_id_seq', 3, true);


--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 220
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: storefront
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- TOC entry 4757 (class 2606 OID 16426)
-- Name: merch merchid_primarykey; Type: CONSTRAINT; Schema: public; Owner: storefront
--

ALTER TABLE ONLY public.merch
    ADD CONSTRAINT merchid_primarykey PRIMARY KEY (id);


--
-- TOC entry 4755 (class 2606 OID 16451)
-- Name: inventory merchid_size_inventory_primarykey; Type: CONSTRAINT; Schema: public; Owner: storefront
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT merchid_size_inventory_primarykey PRIMARY KEY (merch_id, size);


--
-- TOC entry 4759 (class 2606 OID 16441)
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
-- TOC entry 4760 (class 2606 OID 16428)
-- Name: inventory merchid_inventory_foreign_key; Type: FK CONSTRAINT; Schema: public; Owner: storefront
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT merchid_inventory_foreign_key FOREIGN KEY (merch_id) REFERENCES public.merch(id) NOT VALID;


-- Completed on 2025-05-06 15:03:25

--
-- storefrontQL database dump complete
--

