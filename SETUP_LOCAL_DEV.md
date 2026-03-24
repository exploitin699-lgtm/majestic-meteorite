# Local Development Setup

## Testing Signup Locally

There are two ways to test the signup functionality:

### Option 1: Use Firebase Emulator (Recommended for Development)

1. **Start Firebase Functions Emulator:**
   ```bash
   firebase emulators:start --only functions,firestore,auth
   ```

2. **In another terminal, start Astro dev server:**
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:4321/teacher/signup` and test the signup form.

The emulator will handle Firebase Auth and Firestore storage locally. Check the emulator console output for any errors.

### Option 2: Deploy to Firebase Hosting (Production)

Your `firebase.json` is already configured with rewrites. Just deploy:

```bash
npm run build
firebase deploy
```

This will serve your static site on Firebase Hosting with Cloud Functions integrated.

## Troubleshooting

- **404 Error in Local Dev**: Run the Firebase emulator (Option 1)
- **Function Not Found**: Ensure `firebase.json` has the correct function name: `teacherSignup`
- **Auth Errors**: Check that Firestore rules allow writes to `teachers` collection
