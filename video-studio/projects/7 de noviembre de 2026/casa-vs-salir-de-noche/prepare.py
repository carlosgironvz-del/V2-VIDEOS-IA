"""Preparación de audio TTS, SFX y sincronización temporal para casa-vs-salir-de-noche.

Genera por escena: narración Edge-TTS normalizada (loudnorm I=-17, TP=-2) con
marcas palabra por palabra, la línea de tiempo a 30 FPS y una banda sonora
lo-fi procedural (libre de derechos) que nunca se apaga.
"""
import asyncio
import hashlib
import json
import math
import os
import shutil
import ssl
import subprocess
import wave
from pathlib import Path

import edge_tts
import edge_tts.communicate as edge_comm
import numpy as np

HERE = Path(__file__).resolve().parent


def find_studio(p: Path) -> Path:
    curr = p
    while curr != curr.parent:
        if (curr / "remotion/package.json").exists():
            return curr
        curr = curr.parent
    return p.parents[1]


STUDIO = find_studio(HERE)
ASSETS = STUDIO / "assets"
PUBLIC = HERE / "public"
SOURCE = HERE / "src"
FPS = 30

# Detrás de un proxy con CA propia (entornos cloud), Edge-TTS necesita ese bundle.
CA_BUNDLE = os.environ.get("EDGE_TTS_CA_BUNDLE") or ("/root/.ccr/ca-bundle.crt" if Path("/root/.ccr/ca-bundle.crt").exists() else None)
if CA_BUNDLE:
    edge_comm._SSL_CTX = ssl.create_default_context(cafile=CA_BUNDLE)

SFX = {
    "whoosh": ASSETS / "sfx/Trancisiones Necesarias/Whoosh Sound Effect HD _ No Copyright(MP3_70K).mp3",
    "ding": ASSETS / "sfx/Expresiones (Celebraciones y Asombros)/efecto de sonido DING(MP3_160K).mp3",
    "pop": ASSETS / "sfx/Trancisiones Necesarias/Sonido del Click del Mouse __ Mouse Click - Sound Effect(MP3_70K).mp3",
    "laugh": ASSETS / "sfx/Risas/cartoon laugh (sound effect)(MP3_70K).mp3",
    "tada": ASSETS / "sfx/Expresiones (Celebraciones y Asombros)/Descargar Efecto de Sonido Acierto _ Correcto en HD (Sin Copyright)(MP3_160K).mp3",
}


def get_duration(path):
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "csv=p=0", str(path)], text=True))


def loudnorm(src: Path, dst: Path, target="I=-17:TP=-2:LRA=7"):
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-af", f"loudnorm={target}",
                           "-ar", "44100", "-ac", "1", "-b:a", "160k", str(dst)])


async def generate_narration(scene, config, sem):
    target = PUBLIC / f"{scene['id']}.mp3"
    cache_dir = HERE / "audio_cache"
    cache_dir.mkdir(exist_ok=True)
    cache = cache_dir / f"{scene['id']}.json"
    key = hashlib.sha256(json.dumps([scene['text'], config['voice'], config['rate'], 'loudnorm-17']).encode()).hexdigest()
    if target.exists() and cache.exists():
        data = json.loads(cache.read_text(encoding="utf-8"))
        if data.get('key') == key and target.stat().st_size > 1000:
            return data
    async with sem:
        for attempt in range(4):
            try:
                words = []
                raw = cache_dir / f"{scene['id']}.raw.mp3"
                tts = edge_tts.Communicate(scene['text'], config['voice'], rate=config['rate'], boundary='WordBoundary')
                with raw.open('wb') as stream:
                    async for chunk in tts.stream():
                        if chunk.get('type') == 'audio' and chunk.get('data'):
                            stream.write(chunk['data'])
                        elif chunk.get('type') == 'WordBoundary':
                            off, dur = float(chunk.get('offset') or 0), float(chunk.get('duration') or 0)
                            words.append({'word': str(chunk.get('text') or ''), 'start': off / 1e7, 'end': (off + dur) / 1e7})
                if not words:
                    raise RuntimeError(f"Sin marcas de palabras para {scene['id']}")
                partial = target.with_suffix('.partial.mp3')
                loudnorm(raw, partial)
                seconds = get_duration(partial)
                partial.replace(target)
                raw.unlink(missing_ok=True)
                data = {'key': key, 'duration': seconds, 'words': words}
                cache.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
                print(f"Audio {scene['id']}: {seconds:.2f}s, {len(words)} palabras", flush=True)
                return data
            except Exception as exc:  # reintento con espera creciente
                if attempt == 3:
                    raise
                print(f"  reintento {scene['id']}: {exc}", flush=True)
                await asyncio.sleep(2 ** (attempt + 1))
    raise RuntimeError(f"Fallo al sintetizar audio para {scene['id']}")


def copy_sfx():
    for name, src in SFX.items():
        dst = PUBLIC / f"sfx_{name}.mp3"
        if not dst.exists():
            subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-t", "2.5",
                                   "-af", "loudnorm=I=-20:TP=-3,afade=t=out:st=2.0:d=0.5", "-ar", "44100", str(dst)])


def generate_lofi_score(total_seconds: float, name: str = "score.wav"):
    """Lo-fi acogedor a 78 BPM: Rhodes procedural, bajo, bombo suave, hats con swing y crujido de vinilo."""
    sr = 32000
    n = math.ceil((total_seconds + 1) * sr)
    out = np.zeros((n, 2))
    rng = np.random.default_rng(7)
    beat = 60 / 78

    def place(sig, at, gain, pan=0.0):
        s = int(at * sr)
        if s >= n:
            return
        sig = sig[:n - s] * gain
        out[s:s + len(sig), 0] += sig * math.sqrt((1 - pan) / 2)
        out[s:s + len(sig), 1] += sig * math.sqrt((1 + pan) / 2)

    def rhodes(freq, dur):
        t = np.arange(int(sr * dur)) / sr
        env = (1 - np.exp(-t * 60)) * np.exp(-t * 1.4)
        trem = 1 + 0.12 * np.sin(2 * np.pi * 4.2 * t)
        tone = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 3) + 0.08 * np.sin(2 * np.pi * freq * 3.01 * t)
        return tone * env * trem

    def kick():
        t = np.arange(int(sr * 0.45)) / sr
        f = 48 + 70 * np.exp(-t * 28)
        return np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-t * 9)

    def hat():
        t = np.arange(int(sr * 0.06)) / sr
        noise = rng.standard_normal(len(t))
        noise = np.diff(noise, prepend=0)  # tilt agudo
        return noise * np.exp(-t * 70)

    def snare():
        t = np.arange(int(sr * 0.25)) / sr
        return (rng.standard_normal(len(t)) * 0.6 + np.sin(2 * np.pi * 190 * t)) * np.exp(-t * 18)

    # Fmaj9 – Em7 – Dm9 – Cmaj7 (progresión jazzy descendente)
    chords = [[174.61, 220.0, 261.63, 329.63, 392.0], [164.81, 196.0, 246.94, 293.66], [146.83, 174.61, 220.0, 261.63, 329.63], [130.81, 164.81, 196.0, 246.94]]
    bass = [87.31, 82.41, 73.42, 65.41]
    bars = math.ceil(total_seconds / (beat * 4)) + 1
    for bar in range(bars):
        t0 = bar * beat * 4
        ch = chords[bar % 4]
        for i, fr in enumerate(ch):
            place(rhodes(fr, beat * 4.2), t0 + i * 0.018, 0.055, (i - 2) * 0.18)
        if bar % 2:
            place(rhodes(ch[-1] * 2, beat * 1.5), t0 + beat * 2.5, 0.03, 0.4)
        bt = np.arange(int(sr * beat * 3.8)) / sr
        place(np.sin(2 * np.pi * bass[bar % 4] * bt) * np.exp(-bt * 0.9) * (1 - np.exp(-bt * 40)), t0, 0.16)
        intro = bar < 2
        for b in range(4):
            if not intro and b in (0, 2):
                place(kick(), t0 + b * beat + (0.0 if b == 0 else 0.03), 0.30)
            if not intro and b in (1, 3):
                place(snare(), t0 + b * beat, 0.05)
            for s in (0, 1):
                place(hat(), t0 + b * beat + s * beat * 0.58, 0.035 if s else 0.05, 0.3)

    crackle = np.zeros(n)
    idx = rng.integers(0, n, size=int(total_seconds * 25))
    crackle[idx] = rng.standard_normal(len(idx)) * 0.25
    out[:, 0] += crackle * 0.12 + rng.standard_normal(n) * 0.0025
    out[:, 1] += np.roll(crackle, 37) * 0.12 + rng.standard_normal(n) * 0.0025

    fade = int(sr * 3)
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    out[:int(sr * 1.5)] *= np.linspace(0, 1, int(sr * 1.5))[:, None]
    out = out / max(1e-9, np.max(np.abs(out))) * 0.89
    raw = HERE / "audio_cache" / f"raw_{name}"
    with wave.open(str(raw), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((out * 32767).astype(np.int16).tobytes())
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", "loudnorm=I=-19:TP=-2", "-ar", "44100", str(PUBLIC / name)])
    print(f"Banda sonora lo-fi guardada: {PUBLIC / name} ({total_seconds:.1f}s)")


async def main():
    storyboard = json.loads((HERE / "storyboard.json").read_text(encoding="utf-8"))
    PUBLIC.mkdir(exist_ok=True)
    (HERE / "audio_cache").mkdir(exist_ok=True)
    copy_sfx()
    sem = asyncio.Semaphore(3)
    narrations = await asyncio.gather(*[generate_narration(sc, storyboard, sem) for sc in storyboard["scenes"]])

    scenes, cursor = [], 0
    for sc, nar in zip(storyboard["scenes"], narrations):
        # Se mide desde la última palabra (Edge-TTS deja ~0.8 s de silencio al final) + respiro de 0.55 s.
        dur = max(float(sc.get("minSeconds", 3.0)), float(nar["words"][-1]["end"]) + 0.55)
        frames = math.ceil(dur * FPS)
        scenes.append({**sc, "start": cursor, "frames": frames, "words": nar["words"], "audio": f"{sc['id']}.mp3"})
        cursor += frames

    data = {"title": storyboard["title"], "channel": storyboard.get("channel", ""), "fps": FPS,
            "durationInFrames": cursor, "scenes": scenes}
    text = json.dumps(data, ensure_ascii=False, indent=1) + "\n"
    (HERE / "timeline.json").write_text(text, encoding="utf-8")
    (SOURCE / "timeline.json").write_text(text, encoding="utf-8")
    if not (PUBLIC / "score.wav").exists() or abs(get_duration(PUBLIC / "score.wav") - (cursor / FPS + 1)) > 1.5:
        generate_lofi_score(cursor / FPS)
    print(f"Timeline completado: {len(scenes)} escenas, {cursor} frames ({cursor / FPS / 60:.2f} min)")


if __name__ == "__main__":
    asyncio.run(main())
