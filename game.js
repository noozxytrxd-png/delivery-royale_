const scene = new THREE.Scene();

// 🌤️ ท้องฟ้า & หมอก
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.FogExp2(0x87ceeb, 0.005);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 16, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ☀️ แสงธรรมชาติ
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x38a169, 0.75);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xfffaed, 0.9);
dirLight.position.set(40, 70, 40);
scene.add(dirLight);

// 🏞️ พื้นดินหมู่บ้านขนาดใหญ่ (รัศมี 80 หน่วย)
const island = new THREE.Mesh(
    new THREE.CylinderGeometry(80, 75, 3, 32),
    new THREE.MeshLambertMaterial({ color: 0x4ade80 })
);
island.position.y = -1.5;
scene.add(island);

// 🎨 เพิ่มสีสันหย่อมหญ้าเข้ม-อ่อนให้มีมิติ
const grassColors = [0x4ade80, 0x22c55e, 0x16a34a, 0x86efac, 0x48bb78];
for(let i = 0; i < 70; i++) {
    let angle = Math.random() * Math.PI * 2;
    let dist = 8 + Math.random() * 35;
    let gx = Math.cos(angle) * dist;
    let gz = Math.sin(angle) * dist;
    
    // เว้นพื้นที่ถนนไม่ให้หย่อมหญ้าทับ
    if (Math.abs(gx) > 7.5 || Math.abs(gz) > 7.5) {
        const patch = new THREE.Mesh(
            new THREE.CircleGeometry(2 + Math.random() * 3, 6),
            new THREE.MeshLambertMaterial({ color: grassColors[Math.floor(Math.random() * grassColors.length)] })
        );
        patch.rotation.x = -Math.PI / 2;
        patch.position.set(gx, 0.015, gz);
        scene.add(patch);
    }
}

// 🛣️ ถนนกากบาททอดยาว
const roadMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
const roadH = new THREE.Mesh(new THREE.BoxGeometry(160, 0.05, 12), roadMat);
roadH.position.y = 0.01;
const roadV = new THREE.Mesh(new THREE.BoxGeometry(12, 0.05, 160), roadMat);
roadV.position.y = 0.02;
scene.add(roadH, roadV);

// 🟡 ตกแต่งลายถนน (เส้นประสีเหลืองกลางถนน)
const lineMat = new THREE.MeshLambertMaterial({ color: 0xfde047 });
for (let x = -72; x <= 72; x += 6) {
    if (Math.abs(x) > 7.5) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(3, 0.02, 0.6), lineMat);
        dash.position.set(x, 0.03, 0);
        scene.add(dash);
    }
}
for (let z = -72; z <= 72; z += 6) {
    if (Math.abs(z) > 7.5) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 3), lineMat);
        dash.position.set(0, 0.03, z);
        scene.add(dash);
    }
}

// 💡 เสาไฟตกแต่งริมถนน
function createStreetLamp(x, z) {
    const group = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.5, 6), new THREE.MeshLambertMaterial({ color: 0x1e293b }));
    pole.position.y = 1.75;
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), new THREE.MeshLambertMaterial({ color: 0xfde047, emissive: 0xfacc15 }));
    lamp.position.y = 3.5;
    group.add(pole, lamp);
    group.position.set(x, 0, z);
    scene.add(group);
}

createStreetLamp(-7, -10); createStreetLamp(7, -10);
createStreetLamp(-7, 10);  createStreetLamp(7, 10);
createStreetLamp(-10, -7); createStreetLamp(-10, 7);
createStreetLamp(10, -7);  createStreetLamp(10, 7);

// ⛰️ ภูเขายักษ์ล้อมรอบขอบฟ้า
function createMountain(x, z, scale) {
    const m = new THREE.Mesh(
        new THREE.ConeGeometry(25 * scale, 35 * scale, 5),
        new THREE.MeshLambertMaterial({ color: 0x64748b })
    );
    m.position.set(x, (17.5 * scale) - 1.5, z);
    scene.add(m);
}
createMountain(-65, -65, 1.5);
createMountain(65, -65, 1.8);
createMountain(-65, 65, 1.3);
createMountain(65, 65, 1.6);
createMountain(0, -75, 2.0);

// 🌿 พุ่มไม้
function createBush(x, z) {
    const bush = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.9, 0),
        new THREE.MeshLambertMaterial({ color: 0x22c55e })
    );
    bush.position.set(x, 0.4, z);
    scene.add(bush);
}

// 🌲 ต้นไม้ Low-Poly
function createTree(x, z) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.8, 8), new THREE.MeshLambertMaterial({ color: 0x78350f }));
    trunk.position.y = 0.9;
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 8), new THREE.MeshLambertMaterial({ color: 0x15803d }));
    leaves.position.y = 2.6;
    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    scene.add(group);
}

// 🏡 บ้านตกแต่งรอบหมู่บ้าน
function createDecorHouse(x, z, rotY, color) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.2, 3), new THREE.MeshLambertMaterial({ color: color }));
    body.position.y = 1.1;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.5, 4), new THREE.MeshLambertMaterial({ color: 0x991b1b }));
    roof.position.y = 2.95; roof.rotation.y = Math.PI / 4;
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.1), new THREE.MeshLambertMaterial({ color: 0x78350f }));
    door.position.set(0, 0.6, 1.51);
    group.add(body, roof, door);
    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    scene.add(group);
}

// วางบ้านรอบหมู่บ้าน
createDecorHouse(-35, -35, 0, 0xfbfbfe);
createDecorHouse(35, -35, Math.PI, 0xfef08a);
createDecorHouse(-35, 35, 0, 0xfbcfe8);
createDecorHouse(35, 35, Math.PI, 0xfed7aa);

// 🛡️ วางต้นไม้และพุ่มไม้แบบคัดกรองเข้มงวด (ห้ามทับถนนเด็ดขาด)
for(let i = 0; i < 35; i++) {
    let angle = (i / 35) * Math.PI * 2;
    let dist = 14 + (i % 4) * 5;
    let tx = Math.cos(angle) * dist;
    let tz = Math.sin(angle) * dist;
    
    // เงื่อนไข: ต้องอยู่ห่างจากจุดศูนย์กลางถนนอย่างน้อย 8.5 หน่วย
    if (Math.abs(tx) > 8.5 || Math.abs(tz) > 8.5) {
        createTree(tx, tz);
        if (i % 2 === 0) createBush(tx + 1.2, tz + 1.2);
    }
}

// 🏠 บ้านเป้าหมายส่งพัสดุหลัก
const houseGroup = new THREE.Group();
const depotBase = new THREE.Mesh(new THREE.BoxGeometry(4, 2.5, 3), new THREE.MeshLambertMaterial({ color: 0x0284c7 }));
depotBase.position.y = 1.25;
const depotRoof = new THREE.Mesh(new THREE.ConeGeometry(3.2, 1.6, 4), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
depotRoof.position.y = 3.3; depotRoof.rotation.y = Math.PI / 4;
const depotDoor = new THREE.Mesh(new THREE.BoxGeometry(1, 1.4, 0.1), new THREE.MeshLambertMaterial({ color: 0xf59e0b }));
depotDoor.position.set(0, 0.7, 1.51);
houseGroup.add(depotBase, depotRoof, depotDoor);
houseGroup.position.set(0, 0, -4);
scene.add(houseGroup);

// 📦 กล่องพัสดุ
const packageGroup = new THREE.Group();
const pkgBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
const ribbonX = new THREE.Mesh(new THREE.BoxGeometry(1.22, 1.22, 0.3), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
const ribbonZ = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.22, 1.22), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
packageGroup.add(pkgBox, ribbonX, ribbonZ);
packageGroup.position.set(0, 3.6, -4);
scene.add(packageGroup);
const packageMesh = packageGroup;

// ⚔️ ระบบอาวุธ: อาวุธทุกชนิดตกจากฟ้าพร้อมกัน, เก็บทีละชิ้น และใช้ได้ครั้งเดียว
const WEAPONS = {
    sword:    { name: "SWORD",    icon: "⚔️", color: 0xe2e8f0, damage: 35, range: 3.5,  knockback: 2.5 },
    hammer:   { name: "HAMMER",   icon: "🔨", color: 0x94a3b8, damage: 45, range: 3.2,  knockback: 4.0 },
    bow:      { name: "BOW",      icon: "🏹", color: 0x92400e, damage: 30, range: 9.0,  knockback: 2.0 },
    blaster:  { name: "BLASTER",  icon: "🔫", color: 0x38bdf8, damage: 40, range: 11.0, knockback: 2.5 },
    bomb:     { name: "BOMB",     icon: "💣", color: 0x111827, damage: 55, range: 6.0,  knockback: 5.0 },
    spear:    { name: "SPEAR",    icon: "🔱", color: 0x60a5fa, damage: 40, range: 5.0,  knockback: 3.0 },
    lightning:{ name: "LIGHTNING",icon: "⚡", color: 0xfacc15, damage: 60, range: 10.0, knockback: 3.5 },
    freeze:   { name: "FREEZE",   icon: "❄️", color: 0x67e8f9, damage: 20, range: 8.0,  knockback: 1.0 }
};
const weaponKeys = Object.keys(WEAPONS);
let weaponDropMeshes = {};
let weaponDrops = [];
let weaponDropCooldown = 0;

function createWeaponDropMesh(type) {
    const w = WEAPONS[type];
    const group = new THREE.Group();
    const crate = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 0.75, 1.25),
        new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    crate.position.y = 0.4;
    const core = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.48, 0),
        new THREE.MeshLambertMaterial({ color: w.color, emissive: w.color, emissiveIntensity: 0.25 })
    );
    core.position.y = 1.05;
    group.add(crate, core);

    if (type === "sword" || type === "spear") {
        const blade = new THREE.Mesh(
            new THREE.BoxGeometry(0.14, 1.4, 0.14),
            new THREE.MeshLambertMaterial({ color: w.color })
        );
        blade.position.set(0, 1.7, 0);
        blade.rotation.z = type === "sword" ? 0.25 : 0;
        group.add(blade);
    } else if (type === "hammer") {
        const handle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8),
            new THREE.MeshLambertMaterial({ color: 0x78350f })
        );
        handle.position.y = 1.65;
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.35, 0.35),
            new THREE.MeshLambertMaterial({ color: w.color })
        );
        head.position.y = 2.15;
        group.add(handle, head);
    } else {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.5, 0.08, 8, 20),
            new THREE.MeshLambertMaterial({ color: w.color, emissive: w.color, emissiveIntensity: 0.2 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 1.35;
        group.add(ring);
    }
    return group;
}

function removeWeaponDrops() {
    Object.values(weaponDropMeshes).forEach(mesh => {
        if (mesh) scene.remove(mesh);
    });
    weaponDropMeshes = {};
    weaponDrops = [];
}

function spawnWeaponDrop(type, x, z, y = 10) {
    const existing = weaponDropMeshes[type];
    if (existing) scene.remove(existing);
    const drop = { id: type, type, x, y, z };
    const mesh = createWeaponDropMesh(type);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    weaponDropMeshes[type] = mesh;
    weaponDrops = weaponDrops.filter(d => d.type !== type);
    weaponDrops.push(drop);
}

function syncWeaponDrops(stateDrops) {
    const drops = Array.isArray(stateDrops) ? stateDrops : [];
    const wanted = new Set(drops.map(d => d.type));
    Object.keys(weaponDropMeshes).forEach(type => {
        if (!wanted.has(type)) {
            scene.remove(weaponDropMeshes[type]);
            delete weaponDropMeshes[type];
        }
    });
    weaponDrops = drops.map(d => ({ ...d }));
    drops.forEach(d => {
        if (!weaponDropMeshes[d.type]) {
            const mesh = createWeaponDropMesh(d.type);
            scene.add(mesh);
            weaponDropMeshes[d.type] = mesh;
        }
        weaponDropMeshes[d.type].position.set(d.x, d.y, d.z);
    });
}

// Backward-compatible aliases for older state packets.
function removeWeaponDrop() { removeWeaponDrops(); }
function syncWeaponDrop(stateDrop) {
    syncWeaponDrops(stateDrop ? [stateDrop] : []);
}

function updateWeaponHUD() {
    const btn = document.getElementById('btnUseItem');
    const me = myId && players[myId];
    if (!btn) return;
    if (!me || !me.weapon || !WEAPONS[me.weapon]) {
        btn.style.display = 'none';
        return;
    }
    const w = WEAPONS[me.weapon];
    btn.style.display = 'block';
    btn.innerHTML = `${w.icon} USE ${w.name}<br><small>ONE USE</small>`;
    btn.title = `Use ${w.name} once`;
}

function useInventoryItem() {
    if (!myId || !players[myId] || !players[myId].weapon) return;
    playSound('click');
    if (isHost) hostUseWeapon(myId);
    else if (guestConn && guestConn.open) guestConn.send({ type: 'USE_WEAPON' });
}

function findNearestTarget(attackerId, range) {
    const attacker = players[attackerId];
    if (!attacker) return null;
    let best = null, bestDist = range;
    Object.values(players).forEach(target => {
        if (!target || target.id === attackerId) return;
        const d = Math.hypot(target.x - attacker.x, target.z - attacker.z);
        if (d <= bestDist) { bestDist = d; best = target; }
    });
    return best;
}

function hostUseWeapon(attackerId) {
    if (!isHost) return;
    const attacker = players[attackerId];
    if (!attacker || !attacker.weapon || !WEAPONS[attacker.weapon]) return;
    const type = attacker.weapon;
    const w = WEAPONS[type];
    const target = findNearestTarget(attackerId, w.range);

    // ใช้แล้วหมดทันที ไม่ว่าชนเป้าหมายหรือไม่
    attacker.weapon = null;
    if (target) {
        target.health = Math.max(0, (target.health == null ? 100 : target.health) - w.damage);
        const dx = target.x - attacker.x, dz = target.z - attacker.z;
        const len = Math.hypot(dx, dz) || 1;
        target.x += (dx / len) * w.knockback;
        target.z += (dz / len) * w.knockback;
        if (target.health <= 0) {
            attacker.score = (attacker.score || 0) + 50;
            target.health = 100;
            target.x = 0;
            target.z = 3;
        }
    }
    playSound('score');
    broadcastWorldState();
}

function hostSpawnAllWeapons() {
    if (!isHost || document.getElementById('lobbyOverlay').style.display !== 'none') return;
    if (weaponDrops.length > 0 || Date.now() < weaponDropCooldown) return;

    // ปล่อยอาวุธครบทุกชนิดจากฟ้าในแต่ละรอบ
    weaponDrops = [];
    weaponKeys.forEach((type, index) => {
        const angle = (index / weaponKeys.length) * Math.PI * 2 + Math.random() * 0.3;
        const radius = 5 + Math.random() * 13;
        spawnWeaponDrop(type, Math.cos(angle) * radius, Math.sin(angle) * radius, 10 + Math.random() * 2);
    });
    weaponDropCooldown = Date.now() + 3000;
    broadcastWorldState();
}

function updateWeaponDrop() {
    if (!weaponDrops.length) return;

    weaponDrops.forEach(drop => {
        const mesh = weaponDropMeshes[drop.type];
        if (!mesh) return;
        if (drop.y > 0.8) {
            drop.y = Math.max(0.8, drop.y - 0.12);
            mesh.position.y = drop.y;
            mesh.rotation.y += 0.035;
        } else {
            mesh.position.y = 0.8 + Math.sin(Date.now() * 0.005 + drop.x) * 0.15;
            mesh.rotation.y += 0.01;
        }
    });

    if (isHost) {
        let changed = false;
        for (let i = weaponDrops.length - 1; i >= 0; i--) {
            const drop = weaponDrops[i];
            let picked = false;
            for (const p of Object.values(players)) {
                if (!p || p.weapon) continue;
                if (Math.hypot(p.x - drop.x, p.z - drop.z) < 2.2) {
                    p.weapon = drop.type;
                    const mesh = weaponDropMeshes[drop.type];
                    if (mesh) scene.remove(mesh);
                    delete weaponDropMeshes[drop.type];
                    weaponDrops.splice(i, 1);
                    picked = true;
                    changed = true;
                    break;
                }
            }
            if (picked) continue;
        }
        if (changed) {
            weaponDropCooldown = weaponDrops.length ? weaponDropCooldown : Date.now() + 2000;
            broadcastWorldState();
        }
    }
}

let playerMeshes = {}, pickupCooldown = 0, timerInterval = null;
let moveVector = { x: 0, z: 0 };

function clearAllPlayerMeshes() {
    Object.keys(playerMeshes).forEach(id => {
        if (playerMeshes[id]) scene.remove(playerMeshes[id]);
    });
    playerMeshes = {};
}

// 🕹️ Analog Joystick 360°
const joystickBase = document.getElementById('joystickBase');
const joystickKnob = document.getElementById('joystickKnob');
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };

joystickBase.addEventListener('pointerdown', (e) => {
    joystickActive = true;
    const rect = joystickBase.getBoundingClientRect();
    joystickCenter.x = rect.left + rect.width / 2;
    joystickCenter.y = rect.top + rect.height / 2;
    updateJoystick(e.clientX, e.clientY);
});

window.addEventListener('pointermove', (e) => {
    if (!joystickActive) return;
    updateJoystick(e.clientX, e.clientY);
});

window.addEventListener('pointerup', () => {
    if (!joystickActive) return;
    joystickActive = false;
    joystickKnob.style.transform = `translate(0px, 0px)`;
    moveVector = { x: 0, z: 0 };
});

function updateJoystick(clientX, clientY) {
    const maxDist = 35;
    let dx = clientX - joystickCenter.x;
    let dy = clientY - joystickCenter.y;
    const dist = Math.hypot(dx, dy);

    if (dist > maxDist) {
        dx = (dx / dist) * maxDist;
        dy = (dy / dist) * maxDist;
    }

    joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    moveVector.x = (dx / maxDist) * 0.16;
    moveVector.z = (dy / maxDist) * 0.16;
}

function createNameTag(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(10,10,236,44);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center';
    ctx.fillText(text, 128, 40);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }));
    sprite.scale.set(4, 1, 1); sprite.position.y = 3.1;
    return sprite;
}

// 🧍 โมเดลตัวละครพนักงานส่งของ พร้อมไอเทมแต่งตัว
function createPlayerMesh(profile) {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: profile.color || '#38bdf8' });
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xfde047 });
    const bagMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.7), mat);
    body.position.y = 1.0;

    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.5), bagMat);
    backpack.position.set(0, 1.1, -0.5);
    group.add(backpack);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), skinMat);
    head.position.y = 2.0;
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), mat);
    armL.position.set(-0.7, 1.0, 0);
    const armR = armL.clone();
    armR.position.x = 0.7;
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 0.4), new THREE.MeshLambertMaterial({ color: 0x1e293b }));
    legL.position.set(-0.3, 0.45, 0);
    const legR = legL.clone();
    legR.position.x = 0.3;

    group.add(body, head, armL, armR, legL, legR);

    if (profile.hat === 'crown') {
        const c = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.5, 5), new THREE.MeshLambertMaterial({ color: 0xf59e0b }));
        c.position.y = 2.4; group.add(c);
    } else if (profile.hat === 'cap') {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.2, 16), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
        c.position.y = 2.4; group.add(c);
    } else if (profile.hat === 'horns') {
        const h1 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 8), new THREE.MeshLambertMaterial({ color: 0xdc2626 }));
        h1.position.set(-0.3, 2.4, 0); h1.rotation.z = -0.3;
        const h2 = h1.clone(); h2.position.set(0.3, 2.4, 0); h2.rotation.z = 0.3;
        group.add(h1, h2);
    } else if (profile.hat === 'headphones') {
        const band = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.2), new THREE.MeshLambertMaterial({ color: 0x334155 }));
        band.position.y = 2.4;
        const e1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 0x38bdf8 }));
        e1.position.set(-0.4, 2.1, 0);
        const e2 = e1.clone(); e2.position.x = 0.4;
        group.add(band, e1, e2);
    } else if (profile.hat === 'glasses') {
        const g = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.2), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
        g.position.set(0, 2.0, 0.4);
        group.add(g);
    } else if (profile.hat === 'mohawk') {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.6), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
        m.position.set(0, 2.4, 0);
        group.add(m);
    }

    group.add(createNameTag(profile.name || "Delivery_01"));
    return group;
}

function updatePlayerMesh(id, pData) {
    if (playerMeshes[id]) scene.remove(playerMeshes[id]);
    const mesh = createPlayerMesh(pData.profile);
    mesh.position.set(pData.x || 0, 0, pData.z || 3);
    scene.add(mesh);
    playerMeshes[id] = mesh;
}

function updatePreviewMesh() {
    clearAllPlayerMeshes();
    const profile = getMyProfile();
    const previewId = myId || 'preview-local';
    players = {};
    players[previewId] = { id: previewId, x: 0, z: 3, rotY: 0, profile: profile };
    updateLobbyPositions();
    updatePlayerMesh(previewId, players[previewId]);
}

function onProfileChange() {
    updatePreviewMesh();
    if (myId && players[myId]) {
        if (isHost) broadcastWorldState();
        else if (guestConn && guestConn.open) guestConn.send({ type: 'UPDATE_PROFILE', profile: getMyProfile() });
    }
}

window.addEventListener('DOMContentLoaded', () => updatePreviewMesh());

function relocateHouse() {
    const angle = Math.random() * Math.PI * 2, radius = Math.random() * 16 + 6;
    houseGroup.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
}

function updateHUD() {
    const lb = document.getElementById('lbContainer');
    const sorted = Object.values(players).sort((a,b) => (b.score || 0) - (a.score || 0));
    let html = `<div style="font-size:0.7rem; color:#38bdf8; font-weight:900; border-bottom:1px solid #334155; padding-bottom:2px;">🏆 คะแนน</div>`;
    sorted.forEach((p, idx) => {
        if (!p.profile) return;
        html += `<div class="lb-item" style="color: ${p.id === myId ? '#38bdf8' : '#fff'}"><span>${idx+1}. ${p.profile.name}</span><span>${p.score || 0}</span></div>`;
    });
    lb.innerHTML = html;
    document.getElementById('timerDisplay').innerText = `${Math.floor(gameTimeSeconds/60).toString().padStart(2,'0')}:${(gameTimeSeconds%60).toString().padStart(2,'0')}`;
    document.getElementById('playerCountText').innerText = Object.keys(players).length;
    updateWeaponHUD();
}

function enableAutoLandscape() {
    const doc = document.documentElement;
    if (doc.requestFullscreen) doc.requestFullscreen().catch(()=>{});
    if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(()=>{});
}

function startGame() {
    houseGroup.position.set(12, 0, 0);
    packageMesh.position.set(0, 0.6, 0);
    removeWeaponDrops();
    weaponDropCooldown = Date.now() + 2000;

    if (isHost) {
        gameTimeSeconds = 180;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (gameTimeSeconds > 0) { gameTimeSeconds--; broadcastWorldState(); }
            else { clearInterval(timerInterval); alert('หมดเวลาแข่งขัน!'); }
        }, 1000);
        broadcastWorldState();
    }

    document.getElementById('lobbyOverlay').style.display = 'none';
    document.getElementById('hudOverlay').style.display = 'flex';
}

function update() {
    if (document.getElementById('lobbyOverlay').style.display !== 'none') {
        packageMesh.position.y = 3.6 + Math.sin(Date.now() * 0.005) * 0.2;
    }

    if (myId && players[myId] && document.getElementById('lobbyOverlay').style.display === 'none') {
        if (moveVector.x !== 0 || moveVector.z !== 0) {
            let newX = players[myId].x + moveVector.x;
            let newZ = players[myId].z + moveVector.z;

            // 🛡️ ล็อกขอบเขตการเดินกันตกแมพ (Boundary Radius = 22)
            const maxRadius = 22;
            const distFromCenter = Math.hypot(newX, newZ);
            if (distFromCenter > maxRadius) {
                newX = (newX / distFromCenter) * maxRadius;
                newZ = (newZ / distFromCenter) * maxRadius;
            }

            players[myId].x = newX;
            players[myId].z = newZ;

            const targetRotY = Math.atan2(moveVector.x, moveVector.z);
            players[myId].rotY = targetRotY;

            if (playerMeshes[myId]) {
                playerMeshes[myId].rotation.y = targetRotY;
            }

            if (isHost) broadcastWorldState();
            else if (guestConn && guestConn.open) {
                guestConn.send({ type: 'PLAYER_MOVE', x: newX, z: newZ, rotY: targetRotY });
            }
        }

        // 📷 กล้องนิ่งเสถียรสไตล์ 2D (Smooth Follow นุ่มนวล ไม่สั่น)
        const p = players[myId];
        const targetCamX = p.x;
        const targetCamZ = p.z + 12;
        const targetCamY = 14;

        camera.position.x += (targetCamX - camera.position.x) * 0.12;
        camera.position.y += (targetCamY - camera.position.y) * 0.12;
        camera.position.z += (targetCamZ - camera.position.z) * 0.12;
        
        camera.lookAt(p.x, 0.5, p.z);
    }

    if (isHost && document.getElementById('lobbyOverlay').style.display === 'none') {
        if (packageHolderId === null && Date.now() > pickupCooldown) {
            Object.values(players).forEach(p => {
                if (p.profile && Math.hypot(p.x - packageMesh.position.x, p.z - packageMesh.position.z) < 2.5) {
                    packageHolderId = p.id; broadcastWorldState();
                }
            });
        }
        if (packageHolderId && players[packageHolderId]) {
            const h = players[packageHolderId];
            if (Math.hypot(h.x - houseGroup.position.x, h.z - houseGroup.position.z) < 3.0) {
                h.score = (h.score || 0) + 100;
                packageHolderId = null; packageMesh.position.set(0, 0.6, 0);
                playSound('score'); relocateHouse(); broadcastWorldState();
            }
        }
    }

    if (packageHolderId && playerMeshes[packageHolderId] && document.getElementById('lobbyOverlay').style.display === 'none') {
        packageMesh.position.set(playerMeshes[packageHolderId].position.x, 2.8, playerMeshes[packageHolderId].position.z);
    }

    if (isHost && document.getElementById('lobbyOverlay').style.display === 'none') {
        if (weaponDrops.length === 0 && Date.now() > weaponDropCooldown) hostSpawnAllWeapons();
    }
    updateWeaponDrop();

    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
