# Password-Only Auth Setup

The app now requires a **single password** to access the tracker. No usernames or emails—just one password for your team.

## How It Works

1. **First sign-in:** Enter any password → It's saved to Supabase
2. **Subsequent sign-ins:** Use the same password
3. **Session:** Password verified for current browser session
4. **Sign-out:** Clears session, returns to password prompt

## Testing

```bash
# 1. Start dev server
python -m http.server 8000

# 2. Open browser to http://localhost:8000
# 3. See password modal
# 4. Enter any password on first login (becomes your password)
# 5. Tracker loads, "✓ Authenticated" in top-right
# 6. Refresh page → password stays verified
# 7. Close tab → password required next session
```

## Key Features

✅ Simple password protection (no user accounts)  
✅ Auto-saves password on first sign-in  
✅ Session persistence within browser tab  
✅ Sign-out button in top-right  
✅ No access without password  

## How Password is Stored

- Stored as Base64 hash in Supabase `settings` table (`password_hash` column)
- First user to sign in sets the password
- All team members share the same password

## No Setup Required!

The app is ready to use immediately. Just run it and enter a password—that's it!

---

**Note:** If you need more security later, consider:
- Using a stronger hash function (bcrypt, argon2) instead of Base64
- Restricting access with Row Level Security (RLS) policies
- Using Supabase Auth for multi-user support with individual accounts
