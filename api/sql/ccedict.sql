-- UPDATE IDEOGRAM RAW

UPDATE tmp_cedict ce
JOIN cjk c ON c.ideogram = ce.ideogram
SET c.ideogram_raw = ce.ideogram_raw
WHERE c.ideogram_raw IS NULL;

-- DELETE REMOVED

DELETE c 
FROM cjk c 
LEFT JOIN tmp_cedict ce
  ON ce.ideogram = c.ideogram
 AND ce.pronunciation = c.pronunciation
WHERE ce.ideogram IS NULL
  AND c.definition_cedict IS NOT NULL
  AND c.definition_unihan IS NULL
  AND c.definition_pt IS NULL;


SELECT 
  ce.ideogram,
  ce.ideogram_raw,
  ce.pronunciation ce_pronunciation,
  c.pronunciation c_pronunciation,
  ce.definition ce_definition,
  c.definition_cedict c_definition
FROM tmp_cedict ce
JOIN cjk c 
  ON c.ideogram = ce.ideogram
 AND c.pronunciation = ce.pronunciation
WHERE IFNULL(c.definition_cedict, '') != ce.definition;

SELECT * 
FROM cjk c
WHERE ideogram = '382f';

SELECT * 
FROM tmp_cedict
WHERE ideogram_raw = '锡霍特·阿林山脉';

SELECT * 
FROM cjk
WHERE ideogram_raw = '锡霍特·阿林山脉';
