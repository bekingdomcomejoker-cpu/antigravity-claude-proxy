# Troubleshooting

- Windows OAuth port EACCES: set OAUTH_CALLBACK_PORT=3456
- 401: curl -X POST http://localhost:8080/refresh-token or re-auth account
- 429: multi-account auto-rotates; single account wait for reset
- Account Invalid: re-authenticate via WebUI or CLI
- 403 VALIDATION_REQUIRED: complete Google verification via WebUI FIX button
