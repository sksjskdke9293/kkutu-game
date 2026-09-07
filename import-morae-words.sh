#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

MORAE_BASE_URL="${MORAE_BASE_URL:-https://morae.me/data/word-chain}"
MORAE_VERSION="${MORAE_VERSION:-20260814-1}"
DB_CONTAINER="${DB_CONTAINER:-$(sudo docker compose ps -q db)}"

if [[ -z "$DB_CONTAINER" ]]; then
  echo "KKuTu database container is not running." >&2
  exit 1
fi

psql_exec() {
  sudo docker exec -i "$DB_CONTAINER" psql -v ON_ERROR_STOP=1 -U postgres -d main "$@"
}

psql_exec <<'SQL'
ALTER TABLE kkutu_ko ADD COLUMN IF NOT EXISTS morae_basic boolean NOT NULL DEFAULT false;
ALTER TABLE kkutu_ko ADD COLUMN IF NOT EXISTS morae_standard boolean NOT NULL DEFAULT false;
ALTER TABLE kkutu_ko ADD COLUMN IF NOT EXISTS morae_complex boolean NOT NULL DEFAULT false;

DROP TABLE IF EXISTS morae_import_words;
DROP TABLE IF EXISTS morae_import_load;
CREATE UNLOGGED TABLE morae_import_words (
  word character varying(256) PRIMARY KEY,
  morae_basic boolean NOT NULL DEFAULT false,
  morae_standard boolean NOT NULL DEFAULT false,
  morae_complex boolean NOT NULL DEFAULT false
);
CREATE UNLOGGED TABLE morae_import_load (word text);
SQL

import_preset() {
  local preset="$1"
  local membership_column="$2"

  echo "Downloading Morae ${preset} wordbook..."
  psql_exec -c 'TRUNCATE morae_import_load;'
  {
    for index in $(seq 0 18); do
      curl --fail --silent --show-error --location \
        --retry 5 --retry-delay 2 --retry-all-errors \
        "${MORAE_BASE_URL}/${preset}/${index}.txt?v=${MORAE_VERSION}"
      printf '\n'
    done
  } | tr -d '\r' | psql_exec -c '\copy morae_import_load(word) FROM STDIN'

  psql_exec <<SQL
INSERT INTO morae_import_words (word, ${membership_column})
SELECT DISTINCT btrim(word), true
FROM morae_import_load
WHERE btrim(word) ~ '^[가-힣]+$'
  AND char_length(btrim(word)) BETWEEN 2 AND 256
ON CONFLICT (word) DO UPDATE SET ${membership_column} = true;
SQL
}

import_preset basic morae_basic
import_preset standard morae_standard
import_preset complex morae_complex

echo "Merging Morae wordbooks into KKuTu..."
psql_exec <<SQL
UPDATE kkutu_ko
SET morae_basic = false,
    morae_standard = false,
    morae_complex = false
WHERE morae_basic OR morae_standard OR morae_complex;

INSERT INTO kkutu_ko
  (_id, type, mean, hit, flag, theme, morae_basic, morae_standard, morae_complex)
SELECT word,
       '1',
       'Morae 낱말집 (${MORAE_VERSION})',
       0,
       0,
       'morae',
       morae_basic,
       morae_standard,
       morae_complex
FROM morae_import_words
ON CONFLICT (_id) DO UPDATE SET
  morae_basic = EXCLUDED.morae_basic,
  morae_standard = EXCLUDED.morae_standard,
  morae_complex = EXCLUDED.morae_complex;

CREATE INDEX IF NOT EXISTS kkutu_ko_morae_basic_id_idx
  ON kkutu_ko (_id varchar_pattern_ops) WHERE morae_basic;
CREATE INDEX IF NOT EXISTS kkutu_ko_morae_standard_id_idx
  ON kkutu_ko (_id varchar_pattern_ops) WHERE morae_standard;
CREATE INDEX IF NOT EXISTS kkutu_ko_morae_complex_id_idx
  ON kkutu_ko (_id varchar_pattern_ops) WHERE morae_complex;

TRUNCATE kkutu_manner_ko;
ANALYZE kkutu_ko;

SELECT
  count(*) FILTER (WHERE morae_basic) AS basic,
  count(*) FILTER (WHERE morae_standard) AS standard,
  count(*) FILTER (WHERE morae_complex) AS complex,
  count(*) FILTER (WHERE morae_basic OR morae_standard OR morae_complex) AS total_unique
FROM kkutu_ko;

DROP TABLE morae_import_load;
DROP TABLE morae_import_words;
SQL

echo "Morae wordbooks imported successfully."
