const MAX_PLAYERS = 4;
let isHost = false, myId = null, connections = {}, guestConn = null, peer = null;
let players = {}, packageHolderId = null, gameTimeSeconds = 180;

const statusText = document.getElementById('statusText');
const btnStartGame = document.getElementById('btnStartGame');

function switchPage(page) {
    document.getElementById('menuMain').style.display = page === 'main' ? 'flex' : 'none';
    document.getElementById('menuPlay').style.display = page === 'play' ? 'flex' : 'none';
    document.getElementById('menuCustom').style.display = page === 'custom' ? 'flex' : 'none';
    document.getElementById('menuSettings').style.display = page === 'settings' ? 'flex' : 'none';
}

function getMyProfile() {
    return {
        name: document.getElementById('inputName').value.trim() || "Delivery_01",
        color: document.getElementById('inputColor').value,
        hat: document.getElementById('inputHat').value
    };
}

function updateLobbyPositions() {
    const pKeys = Object.keys(players);
    const spacing = 2.0;
    const slots = [0, -spacing, spacing, -spacing * 2]; 

    pKeys.forEach((id, idx) => {
        if (players[id]) {
            const slotIdx = (idx === 0) ? 1 : (idx === 1) ? 0 : (idx === 2) ? 2 : 3;
            players[id].lobbyX = slots[slotIdx];
            players[id].lobbyZ = 3;
        }
    });
}

function createHostRoom() {
    const code = document.getElementById('hostRoomCode').value.trim();
    if (code.length !== 4) return alert('กรุณากรอกรหัสห้อง 4 หลัก');
    if (peer) peer.destroy();

    isHost = true;
    startBGM();
    statusText.innerText = 'สถานะ: กำลังสร้างห้อง...';

    peer = new Peer(`dr-4p-v3-${code}`);
    peer.on('open', (id) => {
        myId = id;
        statusText.innerText = `สถานะ: เปิดห้อง [${code}] สำเร็จ`;
        btnStartGame.disabled = false;
        
        clearAllPlayerMeshes();
        players = {};
        players[myId] = { id: myId, x: 0, z: 3, rotY: 0, score: 0, health: 100, weapon: null, profile: getMyProfile() };
        updateLobbyPositions();
        updatePlayerMesh(myId, players[myId]);
    });

    peer.on('connection', (conn) => {
        if (!isHost) return;
        conn.on('open', () => {
            if (Object.keys(connections).length + 1 >= MAX_PLAYERS) {
                conn.send({ type: 'ERROR', msg: 'ห้องเต็ม!' });
                conn.close();
                return;
            }
            connections[conn.peer] = conn;
        });
        conn.on('data', (data) => {
            if (data.type === 'JOIN_PROFILE') {
                players[conn.peer] = { id: conn.peer, x: 0, z: 3, rotY: 0, score: 0, profile: data.profile };
                updateLobbyPositions();
                broadcastWorldState();
            } else if (data.type === 'UPDATE_PROFILE') {
                if (players[conn.peer]) players[conn.peer].profile = data.profile;
                broadcastWorldState();
            } else if (data.type === 'USE_WEAPON') {
                hostUseWeapon(conn.peer);
            } else if (data.type === 'PLAYER_MOVE') {
                if (players[conn.peer]) { 
                    players[conn.peer].x = data.x; 
                    players[conn.peer].z = data.z; 
                    players[conn.peer].rotY = data.rotY; 
                }
            }
        });
        conn.on('close', () => { 
            delete connections[conn.peer]; 
            if (playerMeshes[conn.peer]) {
                scene.remove(playerMeshes[conn.peer]);
                delete playerMeshes[conn.peer];
            }
            delete players[conn.peer]; 
            updateLobbyPositions();
            broadcastWorldState(); 
        });
    });
}

function joinRoom() {
    const code = document.getElementById('inputJoinCode').value.trim();
    if (code.length !== 4) return alert('กรุณากรอกรหัส 4 หลัก');
    if (peer) peer.destroy();

    isHost = false;
    startBGM();
    statusText.innerText = 'สถานะ: กำลังเข้าห้อง...';

    peer = new Peer();
    peer.on('open', (id) => {
        myId = id;
        guestConn = peer.connect(`dr-4p-v3-${code}`);
        guestConn.on('open', () => {
            statusText.innerText = 'สถานะ: จอยห้องสำเร็จ!';
            guestConn.send({ type: 'JOIN_PROFILE', profile: getMyProfile() });
            
            clearAllPlayerMeshes();
            players = {};
            players[myId] = { id: myId, x: 0, z: 3, rotY: 0, score: 0, health: 100, weapon: null, profile: getMyProfile() };
            updatePlayerMesh(myId, players[myId]);
        });
        guestConn.on('data', (data) => {
            if (data.type === 'WORLD_STATE') syncWorldState(data);
            else if (data.type === 'START_GAME') startGame();
        });
    });
}

function requestStartGame() {
    if (isHost) {
        Object.values(connections).forEach(c => { if (c && c.open) c.send({ type: 'START_GAME' }); });
        startGame();
    }
}

function broadcastWorldState() {
    if (!isHost) return;
    const state = { type: 'WORLD_STATE', players, packageHolderId, pkgPos: { x: packageMesh.position.x, y: packageMesh.position.y, z: packageMesh.position.z }, housePos: houseGroup.position, gameTime: gameTimeSeconds, weaponDrops };
    Object.values(connections).forEach(c => { if (c && c.open) c.send(state); });
    syncWorldState(state);
}

function syncWorldState(state) {
    players = state.players;
    packageHolderId = state.packageHolderId;
    gameTimeSeconds = state.gameTime;
    syncWeaponDrops(state.weaponDrops || (state.weaponDrop ? [state.weaponDrop] : []));
    if (packageHolderId === null && state.pkgPos) packageMesh.position.set(state.pkgPos.x, state.pkgPos.y, state.pkgPos.z);
    if (state.housePos) houseGroup.position.copy(state.housePos);

    updateLobbyPositions();
    Object.values(players).forEach(p => {
        if (!playerMeshes[p.id]) updatePlayerMesh(p.id, p);
        else {
            const isLobby = document.getElementById('lobbyOverlay').style.display !== 'none';
            const targetX = isLobby ? (p.lobbyX || 0) : p.x;
            const targetZ = isLobby ? (p.lobbyZ || 3) : p.z;
            playerMeshes[p.id].position.x = THREE.MathUtils.lerp(playerMeshes[p.id].position.x, targetX, 0.3);
            playerMeshes[p.id].position.z = THREE.MathUtils.lerp(playerMeshes[p.id].position.z, targetZ, 0.3);
            if (!isLobby) {
                playerMeshes[p.id].rotation.y = p.rotY || 0;
            }
        }
    });
    updateHUD();
}
