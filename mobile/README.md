# ISSB Prep — Mobile (Expo / React Native)

The mobile client. It consumes the **same versioned API** as the web app using
JWT auth (`/api/auth/token` + `/api/auth/token/refresh`) and shares response
types (`src/api/types.ts`, kept in sync with the server DTOs).

## What's implemented

- **Auth**: email/password login → JWT stored in AsyncStorage, auto-refresh.
- **Parity screens**: practice tests (MCQ take + result), flashcards, daily
  digest, profile.
- **Offline** (build prompt §10): flashcards and digest are cached; test
  submissions and flashcard reviews are **queued** and synced automatically when
  connectivity returns (see `src/storage.ts`, `NetInfo` listener in `Home`).
- **Push notifications**: permission + Expo push token + a daily local reminder
  (`src/push.ts`).
- **Camera / voice**: `expo-image-picker` and `expo-av` are configured
  (permissions in `app.json`) for answer-sheet photos and voice answers.

## Run

> Requires Node + the Expo toolchain. Point the app at your running web API.

```bash
cd mobile
npm install
# set the API base URL (defaults to http://127.0.0.1:4310) in app.json → expo.extra.apiBaseUrl
npm start          # then press a for Android, i for iOS, or scan the QR in Expo Go
```

On a physical device, set `apiBaseUrl` to your machine's LAN IP (not
`127.0.0.1`) so the phone can reach the API.

## Release pipeline (EAS)

```bash
npm i -g eas-cli
eas login
eas build --platform android      # produces an .aab for Play Store
eas build --platform ios          # produces an .ipa for App Store (Apple account required)
eas submit --platform android     # upload to Play Console
```

## Store listing & privacy

- App name: **ISSB Prep**; bundle id `com.pop.issbprep`.
- Data collected: account (email), practice responses, voice recordings and
  personality assessments — declared in the store data-safety form and covered
  by the in-app consent (Phase 1) and privacy policy (English + Urdu).
- Clearly states it is an independent tool, not affiliated with ISSB, with no
  guaranteed outcome.

## Notes

This codebase was authored against Expo SDK 52 / RN 0.79 conventions. It was not
executed in the build environment (no device/emulator available there); run the
steps above to launch it against the local API.
