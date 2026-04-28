# BAPS Charities Website — Backup & Restore Runbook

This runbook covers backup and restore procedures for the BAPS Charities Website, a Supabase-backed Next.js application.

---

## Prerequisites

### Backup Retention Policies

- **Free Tier**: Daily automated backups with **7-day retention**. Point-in-Time Recovery (PITR) is **NOT available**.
- **Pro/Enterprise Tiers**: Daily automated backups + **Point-in-Time Recovery (PITR)** with up to 30-day retention.

**Current Project Status**: Verify your Supabase plan in the Dashboard → Project Settings → Billing to confirm which features are available.

### Required Tools

- `psql` (PostgreSQL client) — install via `brew install postgresql` on macOS
- `pg_dump` (included with PostgreSQL)
- Supabase Dashboard access (https://app.supabase.com/)
- Project connection credentials (database URL + password)

### Connection String Location

1. Open Supabase Dashboard → Your Project → Settings → Database
2. Copy the "Connection string" (URI format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
3. **Treat connection strings as secrets** — never commit or share them

---

## How to Take a Manual Backup

### Option 1: Supabase Dashboard (Recommended for non-technical users)

1. Go to **Supabase Dashboard** → Your Project → Database → **Backups**
2. Click **"Create backup"** button
3. Backup starts immediately; monitor status in the Backups list
4. Once "Completed", you can download or restore directly

### Option 2: Command Line (`pg_dump`)

Use this for automated backups or integration with CI/CD pipelines.

```bash
# Set your connection details
BACKUP_DATE=$(date +%Y%m%d)
CONNECTION_STRING="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run pg_dump
pg_dump "$CONNECTION_STRING" \
  --no-privileges \
  --no-owner \
  -f "backup-${BACKUP_DATE}.sql"

echo "Backup complete: backup-${BACKUP_DATE}.sql"
```

**Parameters explained:**
- `--no-privileges`: Omit GRANT/REVOKE statements (safer for restoring to different projects)
- `--no-owner`: Omit ALTER OWNER statements (avoids permission conflicts)
- `-f`: Output filename

**Example output file**: `backup-20260427.sql` (~50 MB for typical dataset)

---

## How to Restore to a New Project

### Setup the Target Project

1. Create a new Supabase project (Project Settings → New Project, or via API)
2. Wait for database initialization (~5 minutes)
3. Get the new project's connection string: Settings → Database → Connection string

### Run the Restore

```bash
# Set variables
NEW_CONNECTION_STRING="postgresql://postgres:[NEW-PASSWORD]@db.[NEW-PROJECT-REF].supabase.co:5432/postgres"
BACKUP_FILE="backup-20260427.sql"

# Restore the backup
psql "$NEW_CONNECTION_STRING" < "$BACKUP_FILE"

echo "Restore complete"
```

### Post-Restore Checklist

- [ ] Verify no error messages in restore output
- [ ] Test critical endpoints (e.g., GET /api/donations, POST /api/newsletter)
- [ ] Check row counts (see "Verify Backup Integrity" below)
- [ ] Verify Supabase Storage contents (see "Storage" section below)

---

## How to Spot-Restore a Single Table

If only one table is corrupted, you can restore just that table without affecting others.

### Extract Table from Backup

```bash
# Create a single-table dump from your backup SQL file
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -t donations \
  -f "donations-backup-$(date +%Y%m%d).sql"
```

**Available tables to restore individually:**
- `donations` — financial records (most critical)
- `centers` — public content
- `newsletter_subscribers` — email subscribers
- `contact_submissions` — contact form submissions
- `user_roles` — user permissions

### Restore the Single Table

```bash
# Restore only that table to production or target project
psql "$TARGET_CONNECTION_STRING" < "donations-backup-20260427.sql"

echo "Table restoration complete"
```

**Warning**: If the table has foreign key constraints, dependent tables may also need restoration to maintain referential integrity.

---

## How to Verify Backup Integrity

After restoring to a new project, always verify row counts to ensure the backup is complete and uncorrupted.

### Compare Row Counts

```bash
# Connect to ORIGINAL project
echo "=== ORIGINAL PROJECT ==="
psql "$ORIGINAL_CONNECTION_STRING" << EOF
SELECT 'donations' AS table_name, COUNT(*) AS row_count FROM donations
UNION ALL
SELECT 'centers', COUNT(*) FROM centers
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'contact_submissions', COUNT(*) FROM contact_submissions
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles;
EOF

# Connect to RESTORED project
echo ""
echo "=== RESTORED PROJECT ==="
psql "$NEW_CONNECTION_STRING" << EOF
SELECT 'donations' AS table_name, COUNT(*) AS row_count FROM donations
UNION ALL
SELECT 'centers', COUNT(*) FROM centers
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'contact_submissions', COUNT(*) FROM contact_submissions
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles;
EOF
```

**Expected output (example):**
```
 table_name             | row_count
------------------------+-----------
 donations              |       1,247
 centers                |         52
 newsletter_subscribers |       3,891
 contact_submissions    |         127
 user_roles             |         18
```

All row counts **must match exactly**. If any differ, the restore was incomplete — do not use the restored project until the discrepancy is resolved.

### Spot-Check Data Integrity

```bash
# Check for NULL values in critical columns
psql "$NEW_CONNECTION_STRING" -c "
  SELECT COUNT(*) as null_amount_donations 
  FROM donations 
  WHERE amount IS NULL;
"

# Verify recent donations exist
psql "$NEW_CONNECTION_STRING" -c "
  SELECT id, amount, created_at 
  FROM donations 
  ORDER BY created_at DESC 
  LIMIT 5;
"
```

---

## Test Run Record

Document each backup/restore test to ensure procedures are sound before production use.

| Date | Duration | Row count match? | Notes |
|------|----------|-----------------|-------|
| [Not yet tested] | — | — | **ACTION REQUIRED**: Run full backup/restore cycle before go-live |
| | | | |

---

## Storage (Supabase Storage)

### Important: Storage ≠ Database Backup

**Database backups do NOT include files stored in Supabase Storage.** If your application stores donation receipts, documents, or other files in the Storage bucket, they must be backed up separately.

### Tables and Storage Relationship

- `donations` table ← stores donation metadata (amount, donor, timestamp)
- Supabase Storage bucket ← stores receipt PDFs, documents, images

If a donation record references a file in Storage, **both must exist together** for data integrity.

### Backup Storage Contents

#### Option 1: Dashboard Download (Simple)

1. Supabase Dashboard → Storage → Select bucket
2. Click folder → **Download** (downloads as ZIP)
3. Store ZIP securely alongside database backups

#### Option 2: Programmatic Export (Automation-Friendly)

```bash
# List all files in a bucket
curl -X GET \
  'https://[PROJECT-REF].supabase.co/storage/v1/object/list/receipts' \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY"

# Download a specific file
curl -X GET \
  'https://[PROJECT-REF].supabase.co/storage/v1/object/receipts/receipt-12345.pdf' \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -o receipt-12345.pdf
```

Replace:
- `[PROJECT-REF]` with your Supabase project ref (from Settings)
- `$SUPABASE_ANON_KEY` with your publishable key (Settings → API)
- `receipts` with your actual bucket name

### Restore Storage Contents

1. Create matching Storage bucket in target/restored project
2. Upload downloaded files back to the bucket
3. Verify file URLs are accessible: `https://[NEW-PROJECT-REF].supabase.co/storage/v1/object/public/receipts/receipt-12345.pdf`

---

## Key Tables & Restore Priority

Restore in this order to maintain referential integrity:

| Table | Content | Priority | Restore Alone? |
|-------|---------|----------|---|
| `centers` | Organization info (BAPS centers) | **CRITICAL** | Yes |
| `donations` | All donations (amount, donor, timestamp) | **CRITICAL** | No — depends on `centers` |
| `user_roles` | User permissions and authentication | **HIGH** | Yes |
| `newsletter_subscribers` | Email subscriber list | **MEDIUM** | Yes |
| `contact_submissions` | Contact form submissions | **MEDIUM** | Yes |

**Foreign Key Dependencies:**
- `donations.center_id` → `centers.id`
- `user_roles.user_id` → Supabase Auth users table

---

## Disaster Recovery Scenarios

### Scenario 1: Accidental Data Deletion

**Problem**: A donation record was deleted by mistake.

**Solution**:
1. If your plan includes **PITR** (Pro/Enterprise): Use Supabase Dashboard → Database → PITR to restore to a point before deletion
2. If you only have **daily backups** (Free tier):
   - Restore the entire database to a temporary project using the last known good backup
   - Query the donated record
   - Use `INSERT` to re-add it to production

**Timeline**: ~10 minutes (PITR) or ~30 minutes (backup restore + manual insert)

### Scenario 2: Ransomware or Malicious Data Modification

**Problem**: Database records have been systematically corrupted or encrypted.

**Solution**:
1. **Immediately** take the application offline (disable DNS or set maintenance mode)
2. Identify the last known good backup (check dashboard timeline)
3. Create a new temporary Supabase project
4. Restore the clean backup to the temporary project
5. Verify row counts and data integrity (use checks from this runbook)
6. Once confirmed clean, restore to production (or swap DNS to new project)
7. Review audit logs for breach investigation

**Timeline**: ~1 hour (including verification)

### Scenario 3: Corruption of Production Database

**Problem**: Table structure is corrupted or indexes are broken.

**Solution**:
1. Restore to a temporary project (testing won't impact users)
2. Run diagnostic queries to pinpoint corruption:
   ```bash
   psql "$NEW_CONNECTION_STRING" -c "
     REINDEX DATABASE postgres;
   "
   ```
3. If REINDEX succeeds, backup the temporary project and restore to production
4. If REINDEX fails, restore from an earlier backup

**Timeline**: ~45 minutes (diagnosis + restore)

---

## Automation & Scheduling

### Supabase Automated Backups

Supabase automatically creates backups:
- **Free tier**: Daily at 00:00 UTC (7-day retention)
- **Pro/Enterprise**: Multiple daily (up to 30-day retention with PITR)

No action required — these are automatic.

### Custom Backup Script (Optional)

For additional safety or archival, schedule a cron job:

```bash
#!/bin/bash
# File: /usr/local/bin/baps-backup.sh

BACKUP_DIR="/backups/baps-charities"
RETENTION_DAYS=30
CONNECTION_STRING="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Create backup
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql"
pg_dump "$CONNECTION_STRING" --no-privileges --no-owner -f "$BACKUP_FILE"

# Compress
gzip "$BACKUP_FILE"

# Clean up old backups (older than $RETENTION_DAYS)
find "$BACKUP_DIR" -name "backup-*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup complete: ${BACKUP_FILE}.gz"
```

Add to crontab:
```bash
# Daily backup at 2 AM UTC
0 2 * * * /usr/local/bin/baps-backup.sh
```

---

## Troubleshooting

### "psql: connection refused"

**Cause**: Connection string is incorrect or network is unreachable.

**Fix**:
1. Verify connection string from Supabase Dashboard → Settings → Database
2. Check your IP is whitelisted (Supabase Dashboard → Database → Connection pooler → Allowed client IPs)
3. Ensure PostgreSQL client is installed: `psql --version`

### "ERROR: role 'postgres' does not exist"

**Cause**: Backup was created with privileges that don't exist in target project.

**Fix**: Use `--no-privileges` flag when creating backups (see "Command Line" section).

### "Restore hangs or times out"

**Cause**: Large backup file or slow network connection.

**Fix**:
- Increase timeout: `psql -c "SET statement_timeout = 0" && psql < backup.sql`
- Use compression: `gzip backup.sql` before transfer, then `gunzip backup.sql.gz && psql < backup.sql`
- Restore in smaller chunks (table-by-table) to isolate any failing table

### Row counts don't match

**Cause**: Incomplete restore or data was added to source after backup.

**Fix**:
1. Check restore output for errors: Look for "ERROR:" messages
2. Verify the backup file is complete: `wc -l backup.sql` (should be >1000 lines)
3. If source data changed after backup, re-run backup and restore again

---

## Contacts & Escalation

- **Supabase Support**: [https://supabase.com/support](https://supabase.com/support) (Pro/Enterprise plans)
- **Database Team Lead**: [To be filled in]
- **Emergency Contact**: [To be filled in]

---

## Version History

| Date | Author | Change |
|------|--------|--------|
| 2026-04-27 | Initial | Created runbook with manual backup, restore, and verification procedures |

