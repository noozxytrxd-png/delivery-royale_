let audioCtx = null;
let bgmInterval = null;
let musicVolume = 0.5;

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function updateVolume(val) {
    musicVolume = val / 100;
    document.getElementById('volVal').innerText = val;
}

function playSound(type) {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(musicVolume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
    } else if (type === 'score') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        gain.gain.setValueAtTime(musicVolume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
    }
}

function startBGM() {
    initAudio();
    if (bgmInterval) return;
    const notes = [261.63, 329.63, 392.00, 523.25];
    let step = 0;
    bgmInterval = setInterval(() => {
        if (musicVolume <= 0 || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(notes[step], audioCtx.currentTime);
            gain.gain.setValueAtTime(musicVolume * 0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + 0.2);
            step = (step + 1) % notes.length;
        } catch(e) {}
    }, 350);
}
