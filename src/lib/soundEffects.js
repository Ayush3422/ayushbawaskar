// Sound Effects Manager with Mute Toggle
class SoundManager {
  constructor() {
    this.isMuted = localStorage.getItem('zoho-sounds-muted') === 'true';
    this.audioContext = null;
    this.gainNode = null;
  }

  // Initialize Web Audio API
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.isMuted ? 0 : 0.3; // 30% volume
    }
  }

  // Play a simple beep/notification sound
  playNotification() {
    if (this.isMuted) return;
    this.init();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.gainNode);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime); // 800 Hz
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1); // Slide to 400 Hz

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Play a success/send sound
  playSend() {
    if (this.isMuted) return;
    this.init();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.gainNode);

    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Play a gentle pop/click sound
  playClick() {
    if (this.isMuted) return;
    this.init();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.gainNode);

    oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('zoho-sounds-muted', this.isMuted.toString());
    
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : 0.3;
    }
    
    return this.isMuted;
  }

  // Get mute status
  getMuteStatus() {
    return this.isMuted;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
