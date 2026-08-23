# Delivery Royale 3D

A small multiplayer 3D browser game built with **Three.js + PeerJS**.

## Features
- 4-player rooms using PeerJS.
- Delivery / score gameplay.
- Mobile-friendly landscape controls.
- Custom character name, color and accessories.
- **8 one-use weapons** that randomly fall from the sky:
  Sword, Hammer, Bow, Blaster, Bomb, Spear, Lightning and Freeze.
- Pick up a weapon, then press the **USE** button. The weapon disappears after one use.
- Host-authoritative weapon damage / knockback.

## Run locally

This is a static website, but use a local HTTP server instead of opening `index.html` directly.

### Python
```bash
python -m http.server 8000
```

Then open:
`http://localhost:8000`

## GitHub Pages

1. Create a new GitHub repository.
2. Upload all files in this folder to the repository root.
3. Go to **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save and open the generated Pages URL.

No build step or Node.js installation is required.

## Project structure

```text
delivery-royale/
├── index.html
├── style.css
├── README.md
└── js/
    ├── game.js
    ├── network.js
    └── sound.js
```

## Notes

PeerJS and Three.js are loaded from public CDNs in `index.html`, so an internet connection is required for multiplayer and the 3D engine.
