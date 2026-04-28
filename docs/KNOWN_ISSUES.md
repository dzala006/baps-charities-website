# Known Issues

_Last updated: 2026-04-28_

## Cross-Browser Testing Status

Tested on: Safari (desktop + iOS), Chrome, Firefox.

### Open Issues

None identified at this time. This file will be updated as issues are found during browser testing.

### Testing Checklist

| Page | Chrome | Firefox | Safari Desktop | Safari iOS |
|------|--------|---------|----------------|------------|
| Home | [ ] | [ ] | [ ] | [ ] |
| Donate | [ ] | [ ] | [ ] | [ ] |
| Find a Center | [ ] | [ ] | [ ] | [ ] |
| About | [ ] | [ ] | [ ] | [ ] |

### Notes

- Hero slideshow: relies on CSS `aspectRatio` — verify in Safari 14 (may need fallback)
- Google Maps embed in Find a Center: requires HTTPS in production
- Cookie banner: uses `localStorage` — verify in Safari private mode (storage is cleared on session end)
