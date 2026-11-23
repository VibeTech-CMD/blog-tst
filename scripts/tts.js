/**
 * Motor de Auto-Leitura Humanizada & Neural HD — Cleilson TST
 *
 * Melhorias de fluidez e naturalidade:
 * 1. Suporte a Voz Neural HD real via API (OpenAI TTS / ElevenLabs) ou áudio MP3 pré-gerado.
 * 2. Dicionário de pronúncia técnica de SST (expande siglas como NR-37, LOTO, DDS, PT, EPI, SIMOPS, ZLQ, H2S).
 * 3. Segmentação por frases curtas com pausas naturais de respiração (evita travamentos e fala monótona).
 * 4. Entonação dinâmica (títulos, perguntas e dicas recebem variação sutil de ritmo e pitch).
 * 5. Priorização estrita de vozes Neurais/Online do navegador (Microsoft Antonio/Francisca Natural, Google PT-BR).
 */

const VOICE_CONFIG_KEY = "cleilson_tst_voice_config_v1";

// Dicionário de pronúncia natural para termos de Segurança do Trabalho (Offshore & Onshore)
const SST_PRONUNCIATION_RULES = [
  [/\bNR[-\s]?(\d+)\b/gi, "N R $1"],
  [/\bTSTs?\b/g, (m) => (m.endsWith("s") ? "técnicos em segurança do trabalho" : "técnico em segurança do trabalho")],
  [/\bDDS\b/g, "Dê Dê Ésse"],
  [/\bEPIs?\b/g, (m) => (m.endsWith("s") ? "E P Is" : "E P I")],
  [/\bEPCs?\b/g, (m) => (m.endsWith("s") ? "E P Cês" : "E P Cê")],
  [/\bLOTO\b/g, "Lôto"],
  [/\bSIMOPS\b/g, "Símops"],
  [/\bAPR\b/g, "A P R"],
  [/\bPET\b/g, "P E T"],
  [/\bPTs?\b/g, (m) => (m.endsWith("s") ? "permissões de trabalho" : "permissão de trabalho")],
  [/\bZLQ\b/g, "zona livre de queda"],
  [/\bIPVS\b/g, "I P V S"],
  [/\bH2S\b/gi, "gás sulfídrico H 2 S"],
  [/\bO2\b/g, "oxigênio"],
  [/\bLEL\b/g, "limite inferior de explosividade"],
  [/\bSESMT\b/g, "Sésmt"],
  [/\bPGR\b/g, "P G R"],
  [/\bGRO\b/g, "G R O"],
  [/\bHUET\b/g, "Rúet"],
  [/\bCBSP\b/g, "C B S P"],
  [/\bFOD\b/g, "F O D"],
  [/\bSST\b/g, "segurança e saúde no trabalho"],
  [/\bSMS\b/g, "S M S"],
  [/\b14x14\b/gi, "quatorze por quatorze"],
  [/\b15\s*kN\b/gi, "quinze quilonewtons"],
  [/\bTL;DR\b/gi, "resumo rápido"],
  [/•/g, ", "],
  [/—/g, ", "]
];

export function humanizeTextForSpeech(rawText = "") {
  let text = String(rawText).trim();
  for (const [pattern, replacement] of SST_PRONUNCIATION_RULES) {
    text = text.replace(pattern, replacement);
  }
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Quebra um bloco longo em sentenças naturais (curtas e fluidas)
 * para evitar cortes, pausas mecânicas e travamentos no Chrome/Edge.
 */
function splitIntoNaturalSentences(text) {
  const cleaned = humanizeTextForSpeech(text);
  if (!cleaned) return [];

  // Quebra em pontuação forte mantendo o sinal
  const parts = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
  const sentences = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    // Se uma frase ainda for muito longa (> 170 chars), quebra suavemente em vírgulas/ponto-e-vírgula
    if (trimmed.length > 170) {
      const subParts = trimmed.split(/(?<=[,;:])\s+/);
      let buffer = "";
      for (const sp of subParts) {
        if ((buffer + " " + sp).trim().length > 145 && buffer) {
          sentences.push(buffer.trim());
          buffer = sp;
        } else {
          buffer = (buffer + " " + sp).trim();
        }
      }
      if (buffer) sentences.push(buffer.trim());
    } else {
      sentences.push(trimmed);
    }
  }
  return sentences;
}

export class AutoReader {
  constructor(callbacks = {}) {
    this.synth = window.speechSynthesis || null;
    this.supported = Boolean(this.synth && typeof SpeechSynthesisUtterance !== "undefined");
    this.voices = [];
    this.selectedVoiceURI = "";
    this.rate = 1.05; // Ritmo levemente mais dinâmico e envolvente
    this.queue = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.mode = "full";
    this._pauseTimer = null;
    this._audioEl = null;
    this._activeEngine = "browser"; // 'browser' | 'openai' | 'elevenlabs'

    this.neuralConfig = this._loadNeuralConfig();

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

  _loadNeuralConfig() {
    try {
      const raw = localStorage.getItem(VOICE_CONFIG_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      provider: "browser", // 'browser' | 'openai' | 'elevenlabs'
      apiKey: "",
      openaiVoice: "onyx", // onyx, nova, echo, shimmer
      elevenVoiceId: "pNInz6obpgDQGcFmaJgB" // Adam / voz expressiva multilíngue
    };
  }

  saveNeuralConfig(config) {
    this.neuralConfig = { ...this.neuralConfig, ...config };
    localStorage.setItem(VOICE_CONFIG_KEY, JSON.stringify(this.neuralConfig));
    this._emitState();
  }

  getNeuralConfig() {
    return { ...this.neuralConfig };
  }

  _scoreVoice(v) {
    const name = (v.name || "").toLowerCase();
    const lang = (v.lang || "").toLowerCase();
    let score = 0;

    if (lang === "pt-br") score += 100;
    else if (lang.startsWith("pt")) score += 50;

    // Vozes Neurais / Online de altíssima qualidade
    if (name.includes("natural") || name.includes("neural") || name.includes("online")) score += 80;
    if (name.includes("antonio") || name.includes("francisca") || name.includes("thalita")) score += 60;
    if (name.includes("google português do brasil") || name.includes("google portugues")) score += 55;
    if (name.includes("luciana") || name.includes("felipe") || name.includes("fernanda")) score += 35;

    // Penaliza vozes SAPI antigas/robotizadas do Windows
    if (name.includes("desktop") || name.includes("maria") || name.includes("daniel")) score -= 30;
    if (v.localService === false) score += 25;

    return score;
  }

  _loadVoices() {
    if (!this.supported) return;
    const allVoices = this.synth.getVoices() || [];
    const ptVoices = allVoices
      .filter((v) => v.lang && v.lang.toLowerCase().startsWith("pt"))
      .sort((a, b) => this._scoreVoice(b) - this._scoreVoice(a));

    this.voices = ptVoices.length > 0 ? ptVoices : allVoices;

    if (this.voices.length > 0) {
      const stillExists = this.voices.some((v) => v.voiceURI === this.selectedVoiceURI);
      if (!stillExists) {
        this.selectedVoiceURI = this.voices[0].voiceURI;
      }
    }

    this.onVoicesLoaded(this.voices, this.selectedVoiceURI, this._isHighQualityBrowserVoice());
  }

  _isHighQualityBrowserVoice() {
    const v = this.voices.find((x) => x.voiceURI === this.selectedVoiceURI);
    if (!v) return false;
    return this._scoreVoice(v) >= 140;
  }

  setVoice(voiceURI) {
    this.selectedVoiceURI = voiceURI;
    if (this.isPlaying && !this.isPaused && this._activeEngine === "browser") {
      this._restartCurrentChunk();
    }
  }

  setRate(rate) {
    this.rate = Number(rate) || 1.05;
    if (this._audioEl) {
      this._audioEl.playbackRate = this.rate;
    } else if (this.isPlaying && !this.isPaused) {
      this._restartCurrentChunk();
    }
  }

  /**
   * Inicia leitura humanizada de segmentos: [{ text, elementId, kind?: 'title'|'heading'|'body'|'tip' }]
   */
  async start(segments, mode = "full") {
    if (!segments || segments.length === 0) return;
    this.stop(false);

    this.mode = mode;
    this.isPlaying = true;
    this.isPaused = false;

    // Se o usuário configurou Voz Neural HD (OpenAI ou ElevenLabs), usa áudio neural real!
    if (this.neuralConfig.provider !== "browser" && this.neuralConfig.apiKey.trim()) {
      this._activeEngine = this.neuralConfig.provider;
      this._emitState();
      const fullText = segments.map((s) => humanizeTextForSpeech(s.text)).join(". ");
      const ok = await this._playNeuralAudio(fullText, segments[0]?.elementId || null);
      if (ok) return;
      // Se falhar a API (chave inválida/sem saldo), cai suavemente para o motor natural do navegador
      this._activeEngine = "browser";
    }

    if (!this.supported) {
      this.stop(true);
      return;
    }

    this._activeEngine = "browser";
    // Expande cada bloco em frases curtas com metadados de prosódia e pausa respirada
    const expanded = [];
    for (const seg of segments) {
      const sentences = splitIntoNaturalSentences(seg.text);
      sentences.forEach((sentence, idx) => {
        const isLastOfBlock = idx === sentences.length - 1;
        expanded.push({
          text: sentence,
          elementId: seg.elementId || null,
          kind: seg.kind || "body",
          pauseAfterMs: isLastOfBlock ? (seg.kind === "title" || seg.kind === "heading" ? 340 : 240) : 110
        });
      });
    }

    this.queue = expanded;
    this.currentIndex = 0;
    this._emitState();
    this._speakNextBrowser();
  }

  async _playNeuralAudio(text, firstElementId) {
    try {
      this.onHighlight(firstElementId);
      this.onProgress(1, 2);

      let blob = null;
      if (this.neuralConfig.provider === "openai") {
        const res = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.neuralConfig.apiKey.trim()}`
          },
          body: JSON.stringify({
            model: "tts-1-hd",
            voice: this.neuralConfig.openaiVoice || "onyx",
            input: text.slice(0, 4000)
          })
        });
        if (!res.ok) throw new Error("Falha OpenAI TTS");
        blob = await res.blob();
      } else if (this.neuralConfig.provider === "elevenlabs") {
        const voiceId = this.neuralConfig.elevenVoiceId || "pNInz6obpgDQGcFmaJgB";
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": this.neuralConfig.apiKey.trim()
          },
          body: JSON.stringify({
            text: text.slice(0, 4000),
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.48, similarity_boost: 0.78, style: 0.35 }
          })
        });
        if (!res.ok) throw new Error("Falha ElevenLabs TTS");
        blob = await res.blob();
      }

      if (!blob || !this.isPlaying) return false;

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = this.rate;
      this._audioEl = audio;

      audio.ontimeupdate = () => {
        if (audio.duration && isFinite(audio.duration)) {
          this.onProgress(Math.round(audio.currentTime), Math.round(audio.duration));
        }
      };

      audio.onended = () => {
        URL.revokeObjectURL(url);
        this.stop(true);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        this.stop(true);
      };

      await audio.play();
      this._emitState();
      return true;
    } catch (err) {
      console.warn("Fallback para voz natural do navegador:", err);
      return false;
    }
  }

  pause() {
    if (!this.isPlaying || this.isPaused) return;
    clearTimeout(this._pauseTimer);
    if (this._audioEl) {
      this._audioEl.pause();
    } else if (this.supported) {
      this.synth.pause();
    }
    this.isPaused = true;
    this._emitState();
  }

  resume() {
    if (!this.isPlaying || !this.isPaused) return;
    if (this._audioEl) {
      this._audioEl.play();
    } else if (this.supported) {
      this.synth.resume();
    }
    this.isPaused = false;
    this._emitState();
  }

  togglePlayPause() {
    if (!this.isPlaying) return false;
    if (this.isPaused) this.resume();
    else this.pause();
    return true;
  }

  stop(emit = true) {
    clearTimeout(this._pauseTimer);
    if (this._audioEl) {
      this._audioEl.pause();
      this._audioEl.src = "";
      this._audioEl = null;
    }
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
    clearTimeout(this._pauseTimer);
    const savedQueue = this.queue;
    const savedIndex = this.currentIndex;
    const savedMode = this.mode;
    this.synth.cancel();
    this.queue = savedQueue;
    this.currentIndex = savedIndex;
    this.mode = savedMode;
    this.isPlaying = true;
    this.isPaused = false;
    this._speakNextBrowser();
  }

  _speakNextBrowser() {
    if (!this.isPlaying || this.currentIndex >= this.queue.length) {
      this.stop(true);
      return;
    }

    const segment = this.queue[this.currentIndex];
    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.lang = "pt-BR";

    // Dinâmica de prosódia: varia levemente entonação e cadência conforme o tipo de trecho
    const isQuestion = segment.text.endsWith("?");
    const isExclamation = segment.text.endsWith("!");

    if (segment.kind === "title" || segment.kind === "heading") {
      utterance.rate = Math.max(0.85, this.rate * 0.96);
      utterance.pitch = 1.06;
    } else if (isQuestion) {
      utterance.rate = this.rate;
      utterance.pitch = 1.08;
    } else if (isExclamation || segment.kind === "tip") {
      utterance.rate = Math.min(2.0, this.rate * 1.03);
      utterance.pitch = 1.05;
    } else {
      utterance.rate = this.rate;
      utterance.pitch = 1.01;
    }

    const voiceObj = this.voices.find((v) => v.voiceURI === this.selectedVoiceURI);
    if (voiceObj) {
      utterance.voice = voiceObj;
    }

    utterance.onstart = () => {
      this.onHighlight(segment.elementId || null);
      this.onProgress(this.currentIndex + 1, this.queue.length);
    };

    utterance.onend = () => {
      if (!this.isPlaying || this.isPaused) return;
      this.currentIndex += 1;
      this._pauseTimer = setTimeout(() => {
        if (this.isPlaying && !this.isPaused) {
          this._speakNextBrowser();
        }
      }, segment.pauseAfterMs || 120);
    };

    utterance.onerror = (event) => {
      if (event.error === "interrupted" || event.error === "canceled") return;
      this.currentIndex += 1;
      this._speakNextBrowser();
    };

    this.synth.speak(utterance);
  }

  _emitState() {
    this.onStateChange({
      supported: this.supported || this.neuralConfig.provider !== "browser",
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      mode: this.mode,
      rate: this.rate,
      engine: this._activeEngine,
      hasNeuralConfigured: this.neuralConfig.provider !== "browser" && Boolean(this.neuralConfig.apiKey),
      highQualityBrowser: this._isHighQualityBrowserVoice()
    });
  }
}
