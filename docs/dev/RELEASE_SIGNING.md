# Release Signing

Gate 0 Android release signing is configured through environment variables and Gradle properties. No keystore or password is stored in this repository.

Required local or CI variables:

- `THAI_MEET_UPLOAD_KEYSTORE`
- `THAI_MEET_UPLOAD_KEYSTORE_PASSWORD`
- `THAI_MEET_UPLOAD_KEY_ALIAS`
- `THAI_MEET_UPLOAD_KEY_PASSWORD`

Build command:

```powershell
cd apps/mobile
flutter build appbundle --release
```

Gradle signing config:

- `releaseSigning`
- Uses `THAI_MEET_UPLOAD_KEYSTORE` for `storeFile`.
- Uses `THAI_MEET_UPLOAD_KEYSTORE_PASSWORD` for `storePassword`.
- Uses `THAI_MEET_UPLOAD_KEY_ALIAS` for `keyAlias`.
- Uses `THAI_MEET_UPLOAD_KEY_PASSWORD` for `keyPassword`.

CI/store boundary:

- CI must inject keystore secrets through the protected production environment.
- Local debug signing remains available only for debug/profile builds.
- Release builds must not fall back to debug signing.
