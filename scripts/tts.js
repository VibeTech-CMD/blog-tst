/**
 * Motor de Auto-Leitura (Text-to-Speech) — Cleilson TST
 * Quebra textos longos em blocos para evitar travamentos no Chrome/Edge,
 * prioriza vozes pt-BR e destaca o bloco em leitura no artigo em tempo real.
 */

export class AutoReader {
  constructor(callbacks = {}) {
    this.synth = window.speechSynthesis || null;
    this.supported = Boolean(this.synth && typeof SpeechSynthesisUtterance !== "undefined");
    this.voices = [];
    this.selectedVoiceURI = "";
    this.rate = 1.0;
    this.queue = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.mode = "full"; // 'summary' | 'full'

    this.onStateChange = callbacks.onStateChange || (() => {});
    this.onProgress = callbacks.onProgress || (() => {});
    this.onHighlight = callbacks.onHighlight || (() => {});
    this.onVoicesLoaded = callbacks.onVoicesLoaded || (() => {});

    if (this.supported) {
      this._loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this._loadVoices();
      }
    }
  }

  _loadVoices() {
    if (!this.supported) return;
    const allVoices = this.synth.getVoices() || [];
    const ptVoices = allVoices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("pt"));
    this.voices = ptVoices.length > 0 ? ptVoices : allVoices;

    if (!this.selectedVoiceURI && this.voices.length > 0) {
      // Prioriza vozes naturais pt-BR (Google / Microsoft Neural)
      const preferred =
        this.voices.find((v) => /pt-br/i.test(v.lang) && /(google|natural|francisca|antonio|maria)/i.test(v.name)) ||
        this.voices.find((v) => /pt-br/i.test(v.lang)) ||
        this.voices[0];
      this.selectedVoiceURI = preferred.voiceURI;
    }

    this.onVoicesLoaded(this.voices, this.selectedVoiceURI);
  }

  setVoice(voiceURI) {
    this.selectedVoiceURI = voiceURI;
    if (this.isPlaying && !this.isPaused) {
      this._restartCurrentChunk();
    }
  }

  setRate(rate) {
    this.rate = Number(rate) || 1.0;
    if (this.isPlaying && !this.isPaused) {
      this._restartCurrentChunk();
    }
  }

  /**
   * Inicia leitura de uma lista de segmentos: [{ text: string, elementId?: string }]
   */
  start(segments, mode = "full") {
    if (!this.supported || !segments || segments.length === 0) return;

    this.stop(false);
    this.queue = segments.filter((s) => s.text && s.text.trim().length > 0);
    this.currentIndex = 0;
    this.mode = mode;
    this.isPlaying = true;
    this.isPaused = false;

    this._emitState();
    this._speakNext();
  }

  pause() {
    if (!this.supported || !this.isPlaying || this.isPaused) return;
    this.synth.pause();
    this.isPaused = true;
    this._emitState();
  }

  resume() {
    if (!this.supported || !this.isPlaying || !this.isPaused) return;
    this.synth.resume();
    this.isPaused = false;
    this._emitState();
  }

  togglePlayPause() {
    if (!this.isPlaying) return false;
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
    return true;
  }

  stop(emit = true) {
    if (this.supported) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.queue = [];
    this.onHighlight(null);
    if (emit) {
      this.onProgress(0, 0);
      this._emitState();
    }
  }

  _restartCurrentChunk() {
    if (!this.supported || !this.isPlaying) return;
    const savedQueue = this.queue;
    const savedIndex = this.currentIndex;
    const savedMode = this.mode;
    this.synth.cancel();
    this.queue = savedQueue;
    this.currentIndex = savedIndex;
    this.mode = savedMode;
    this.isPlaying = true;
    this.isPaused = false;
    this._speakNext();
  }

  _speakNext() {
    if (!this.isPlaying || this.currentIndex >= this.queue.length) {
      this.stop(true);
      return;
    }

    const segment = this.queue[this.currentIndex];
    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.lang = "pt-BR";
    utterance.rate = this.rate;

    const voiceObj = this.voices.find((v) => v.voiceURI === this.selectedVoiceURI);
    if (voiceObj) {
      utterance.voice = voiceObj;
    }

    utterance.onstart = () => {
      this.onHighlight(segment.elementId || null);
      this.onProgress(this.currentIndex + 1, this.queue.length);
    };

    utterance.onend = () => {
      if (!this.isPlaying) return;
      this.currentIndex += 1;
      this._speakNext();
    };

    utterance.onerror = (event) => {
      if (event.error === "interrupted" || event.error === "canceled") return;
      this.currentIndex += 1;
      this._speakNext();
    };

    this.synth.speak(utterance);
  }

  _emitState() {
    this.onStateChange({
      supported: this.supported,
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      mode: this.mode,
      rate: this.rate
    });
  }
}
