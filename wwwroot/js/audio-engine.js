/**
 * Ritmik Kodlar (RhythmCode) - Web Audio API Pentatonik Ses Motoru
 * C4 Pentatonik Skala: Do(261.63Hz), Re(293.66Hz), Mi(329.63Hz), Sol(392.00Hz), La(440.00Hz), Do5(523.25Hz)
 * Harici ses dosyası gerekmez; ksilofon/marimba tınısında gerçek zamanlı sentezleme.
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.masterGain = null;
        this.notes = {
            'Do': 261.63,
            'C4': 261.63,
            'Re': 293.66,
            'D4': 293.66,
            'Mi': 329.63,
            'E4': 329.63,
            'Sol': 392.00,
            'G4': 392.00,
            'La': 440.00,
            'A4': 440.00,
            'Do5': 523.25,
            'C5': 523.25,
            'Re5': 587.33,
            'D5': 587.33,
            'Mi5': 659.25,
            'E5': 659.25
        };

        // Otomatik kullanıcı etkileşimi dinleyicisi
        this._setupAutoUnlock();
    }

    _setupAutoUnlock() {
        const unlock = () => {
            this.ensureContext();
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };
        window.addEventListener('pointerdown', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
    }

    ensureContext() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.8, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    }

    setMuted(mute) {
        this.muted = mute;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.8, this.ctx.currentTime);
        }
        // UI bildirimi
        window.dispatchEvent(new CustomEvent('audio-mute-changed', { detail: { muted: this.muted } }));
        return this.muted;
    }

    toggleMute() {
        return this.setMuted(!this.muted);
    }

    isMuted() {
        return this.muted;
    }

    getFrequency(noteOrFreq) {
        if (typeof noteOrFreq === 'number') return noteOrFreq;
        if (typeof noteOrFreq === 'string') {
            const trimmed = noteOrFreq.trim();
            if (this.notes[trimmed]) return this.notes[trimmed];
            const parsed = parseFloat(trimmed);
            if (!isNaN(parsed)) return parsed;
        }
        return 261.63; // Do varsayılan
    }

    /**
     * Pentatonik ksilofon/marimba tınılı tek nota çalar
     */
    playNote(noteOrFreq, duration = 0.4, type = 'sine', volume = 0.35) {
        if (this.muted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const freq = this.getFrequency(noteOrFreq);
        const now = ctx.currentTime;

        // Ana osilatör
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Hafif armonik zenginlik için 2. yumuşak osilatör (marimba üst tonu)
        const harmOsc = ctx.createOscillator();
        const harmGain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        harmOsc.type = 'triangle';
        harmOsc.frequency.setValueAtTime(freq * 2, now);

        // Zarf (Envelope) - Hızlı atak, yumuşak ksilofon sönümü
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        harmGain.gain.setValueAtTime(0.0001, now);
        harmGain.gain.linearRampToValueAtTime(volume * 0.25, now + 0.015);
        harmGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.5));

        osc.connect(gain);
        harmOsc.connect(harmGain);
        gain.connect(this.masterGain);
        harmGain.connect(this.masterGain);

        osc.start(now);
        harmOsc.start(now);
        osc.stop(now + duration);
        harmOsc.stop(now + duration);

        // Olay yayını (Canvas görselleştirmesi vb. için)
        window.dispatchEvent(new CustomEvent('audio-note-played', { detail: { freq, duration } }));
    }

    /**
     * Akor çalma (birden fazla notayı eşzamanlı veya hafif arpejle çalma)
     */
    playChord(notesList = ['Do', 'Mi', 'Sol'], duration = 0.6, arpeggioSpeed = 0.04) {
        if (this.muted) return;
        notesList.forEach((n, idx) => {
            setTimeout(() => {
                this.playNote(n, duration, 'sine', 0.25);
            }, idx * (arpeggioSpeed * 1000));
        });
    }

    /**
     * Başarı melodisi (neşeli pentatonik yükseliş + majör kutlama)
     */
    playSuccess() {
        if (this.muted) return;
        const melody = [
            { note: 'Do', time: 0 },
            { note: 'Mi', time: 100 },
            { note: 'Sol', time: 200 },
            { note: 'La', time: 300 },
            { note: 'Do5', time: 420, dur: 0.8 }
        ];
        melody.forEach(item => {
            setTimeout(() => {
                this.playNote(item.note, item.dur || 0.45, 'triangle', 0.35);
            }, item.time);
        });
    }

    /**
     * Yumuşak hata / deneme uyarısı (kulak tırmalamayan, merak uyandırıcı soru tonu)
     */
    playErrorSoft() {
        if (this.muted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // Mi'den Re'ye yumuşak kayma (düşünme melodisi)
        osc.frequency.setValueAtTime(329.63, now);
        osc.frequency.linearRampToValueAtTime(293.66, now + 0.3);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.35);
    }

    /**
     * Nesne sürükleme / geçiş efekti (Whoosh)
     */
    playWhoosh(pitchUp = true) {
        if (this.muted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const startFreq = pitchUp ? 220 : 440;
        const endFreq = pitchUp ? 440 : 220;

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.25);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    /**
     * Tıklama / Pop sesi
     */
    playPop(freq = 400) {
        if (this.muted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    /**
     * Pırıltı / Işıltı çan sesi
     */
    playSparkle() {
        if (this.muted) return;
        const chimes = [523.25, 659.25, 783.99, 1046.50];
        chimes.forEach((f, i) => {
            setTimeout(() => {
                this.playNote(f, 0.3, 'sine', 0.15);
            }, i * 60);
        });
    }

    /**
     * Ritmik Davul / Vuruş efekti (Sentetik perküsyon)
     */
    playPercussion(low = true) {
        if (this.muted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const startFreq = low ? 150 : 250;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.15);
    }
}

// Global Singleton
window.RhythmMixer = new AudioEngine();
