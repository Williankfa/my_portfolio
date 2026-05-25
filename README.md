# ★ PORTFOLIO.EXE ★
> *It fills you with DETERMINATION.*

A professional portfolio website inspired by **Omori**, **Terraria**, and **Undertale**.

---

## ✦ Features

- 🌑 **Omori** — White void aesthetic, pixel character, ink-border dialogue boxes, surreal doodle floaters
- ⛏ **Terraria** — Procedural terrain strip, underground layers with ore veins, inventory grid skill system, XP bars
- ❤️ **Undertale** — Battle system project showcase, SOUL cursor, pixel font, CRT scanline overlay, chiptune audio
- Scroll-triggered animations (IntersectionObserver)
- Parallax layers
- Typewriter dialogue effect
- Glitch title effect
- Shooting stars
- Chiptune audio via Web Audio API (toggle on/off)
- Contact form → Flask `/api/contact` endpoint
- Fully responsive

---

## ✦ Structure

```
portfolio/
├── app.py               ← Flask server
├── requirements.txt
├── templates/
│   └── index.html       ← Main page
└── static/
    ├── css/
    │   └── style.css    ← All styles (~600 lines)
    └── js/
        └── main.js      ← All animations & logic (~500 lines)
```

---

## ✦ Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run dev server
python app.py

# 3. Open browser
# http://localhost:5000
```

---

## ✦ Customization

### Change your name
Search and replace `PLAYER_ONE` in `templates/index.html`.

### Edit projects
In `static/js/main.js`, find `PROJECTS_DATA` and update each entry:
```js
{
  name:  'YOUR PROJECT',
  emoji: '🎮',
  color: '#6B21A8',
  desc:  'Short description for the card.',
  long:  '* YOUR PROJECT is staring at you!',
  tags:  ['React', 'Python', '...'],
  link:  'https://your-project-url.com',
  hp: 1000, maxHp: 1000,
}
```

### Edit skills
Find `SKILLS_DATA` in `main.js` and update names, icons, tiers, and descriptions.

### Change colors
All palette variables are at the top of `style.css` under `:root {}`.

### Contact form
By default, `app.py` logs messages to console. To send emails, integrate Flask-Mail or an email API in the `/api/contact` route.

---

## ✦ Production Deployment

```bash
# Using gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

Or deploy to **Railway**, **Render**, **Heroku**, or any Python-compatible host.

---

*© PLAYER_ONE — You will not run from this portfolio.*
