-- Görüntülenme ve damga sayaçları. Anahtar: "yazi:<slug>" | "proje:<slug>".
CREATE TABLE goruntulenme (
	anahtar TEXT PRIMARY KEY,
	sayi INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE damga (
	anahtar TEXT NOT NULL,
	tur TEXT NOT NULL,
	sayi INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY (anahtar, tur)
);

-- Aynı ziyaretçinin aynı gün aynı olayı tekrar saymaması için iz.
-- ziyaretci: SHA-256(IP + UA + günlük tuz); ham IP saklanmaz.
CREATE TABLE iz (
	anahtar TEXT NOT NULL,
	olay TEXT NOT NULL,
	ziyaretci TEXT NOT NULL,
	gun TEXT NOT NULL,
	PRIMARY KEY (anahtar, olay, ziyaretci, gun)
);
CREATE INDEX iz_gun ON iz (gun);
