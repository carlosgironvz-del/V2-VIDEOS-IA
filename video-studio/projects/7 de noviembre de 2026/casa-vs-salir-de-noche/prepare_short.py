"""Arma el Short (≤3 min) de la batería social reutilizando escenas y narraciones del video largo.

Las entradas {"ref": id} se copian del timeline principal (misma locución y arte);
las escenas nuevas se sintetizan con la misma voz. Genera src/timeline-short.json
y public/score-short.wav. Requiere haber ejecutado prepare.py antes.
"""
import asyncio
import json
import math

import prepare as main_prep  # reutiliza TTS (con CA del proxy), loudnorm y banda sonora

HERE = main_prep.HERE
FPS = main_prep.FPS


async def main():
    board = json.loads((HERE / "storyboard-short.json").read_text(encoding="utf-8"))
    full = {s["id"]: s for s in json.loads((HERE / "timeline.json").read_text(encoding="utf-8"))["scenes"]}
    sem = asyncio.Semaphore(3)
    new = [s for s in board["scenes"] if "ref" not in s]
    narr = dict(zip([s["id"] for s in new], await asyncio.gather(*[main_prep.generate_narration(s, board, sem) for s in new])))

    scenes, cursor = [], 0
    for entry in board["scenes"]:
        if "ref" in entry:
            base = {k: v for k, v in full[entry["ref"]].items() if k not in ("start",)}
            frames = base["frames"]
        else:
            nar = narr[entry["id"]]
            dur = max(float(entry.get("minSeconds", 3.0)), float(nar["words"][-1]["end"]) + 0.55)
            frames = math.ceil(dur * FPS)
            base = {**entry, "frames": frames, "words": nar["words"], "audio": f"{entry['id']}.mp3"}
        scenes.append({**base, "start": cursor})
        cursor += frames

    seconds = cursor / FPS
    if seconds > board.get("maxSeconds", 180):
        raise SystemExit(f"El Short dura {seconds:.1f}s y supera el máximo de {board['maxSeconds']}s")
    data = {"title": board["title"], "channel": board["channel"], "fps": FPS, "durationInFrames": cursor, "scenes": scenes}
    (HERE / "src" / "timeline-short.json").write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    main_prep.generate_lofi_score(seconds, "score-short.wav")
    print(f"Short listo: {len(scenes)} escenas, {cursor} frames ({int(seconds // 60)}:{seconds % 60:04.1f})")


if __name__ == "__main__":
    asyncio.run(main())
