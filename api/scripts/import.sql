TRUNCATE tmp_phrase;

LOAD DATA LOCAL INFILE 'sentences_import.csv' INTO TABLE tmp_phrase
CHARACTER SET 'utf8'
FIELDS TERMINATED BY ';' ENCLOSED BY '"'
(phrase, pronunciation, language_id, provider_created_at, provider_updated_at, provider_id)
SET provider = 'tatoeba', created_at = NOW(), updated_at = NOW();

TRUNCATE tmp_phrase_reference;

LOAD DATA LOCAL INFILE 'links.csv' INTO TABLE tmp_phrase_reference
CHARACTER SET 'utf8'
FIELDS TERMINATED BY '\t' ENCLOSED BY '"'
(from_phrase_id, to_phrase_id);

INSERT INTO phrase
SELECT NULL id,
       p.phrase,
       p.pronunciation,
       p.provider,
       p.language_id,
       p.provider_id,
       p.provider_created_at,
       p.provider_updated_at,
       p.created_at,
       p.updated_at
FROM tmp_phrase p
LEFT JOIN phrase ph
   ON ph.provider = p.provider
  AND ph.provider_id = p.provider_id
WHERE p.provider = 'tatoeba'
  AND p.language_id = 1
  AND ph.id IS NULL
UNION ALL
SELECT DISTINCT NULL id,
       p2.phrase,
       p2.pronunciation,
       p2.provider,
       p2.language_id,
       p2.provider_id,
       p2.provider_created_at,
       p2.provider_updated_at,
       p2.created_at,
       p2.updated_at
FROM tmp_phrase p
JOIN tmp_phrase_reference pr
  ON pr.from_phrase_id = p.provider_id
JOIN tmp_phrase p2
  ON p2.provider_id = pr.to_phrase_id
 AND p2.provider = 'tatoeba'
 AND p2.language_id != 1
LEFT JOIN phrase ph
   ON ph.provider = p2.provider
  AND ph.provider_id = p2.provider_id
WHERE p.provider = 'tatoeba'
  AND p.language_id = 1
  AND ph.id IS NULL;

INSERT INTO phrase_reference
SELECT ph.id,
       ph2.id
FROM tmp_phrase p
JOIN tmp_phrase_reference pr
  ON pr.from_phrase_id = p.provider_id
JOIN tmp_phrase p2
  ON p2.provider_id = pr.to_phrase_id
 AND p2.provider = 'tatoeba'
 AND p2.language_id != 1
JOIN phrase ph
   ON ph.provider = p.provider
  AND ph.provider_id = p.provider_id
JOIN phrase ph2
   ON ph2.provider = p2.provider
  AND ph2.provider_id = p2.provider_id
LEFT JOIN phrase_reference phr
   ON phr.from_phrase_id = ph.id
  AND phr.to_phrase_id = ph2.id
WHERE p.provider = 'tatoeba'
  AND p.language_id = 1
  AND ph.id IS NULL;
