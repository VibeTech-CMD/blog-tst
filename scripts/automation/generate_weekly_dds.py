"""
Automação Semanal — Geração de Kits de DDS com Estudo de Mercado (Google Gemini)
Roda toda sexta-feira via GitHub Actions e abre Pull Request pedindo a validação técnica do Cleilson.
"""
import json
import os
import urllib.request
from datetime import datetime, timezone

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
OUTPUT_PATH = os.path.join("data", "weekly-dds-pending.json")


def generate_weekly_kits():
    if not GEMINI_API_KEY:
        raise RuntimeError("Defina o Secret GEMINI_API_KEY em Settings > Secrets and variables > Actions.")

    prompt = (
        "Você é um engenheiro e técnico sênior em Segurança do Trabalho (TST) no Brasil. "
        "Faça um estudo das tendências atuais de prevenção de acidentes no mercado brasileiro (Offshore NR-37 e Onshore) "
        "e crie 2 Kits de DDS práticos de 5 minutos para a próxima segunda-feira: "
        "1 voltado para Offshore (NR-37) e 1 voltado para Onshore (Indústria/Construção/NR-10/NR-12/NR-35). "
        "Retorne ESTRITAMENTE um array JSON com 2 objetos contendo as chaves: "
        "area, areaLabel, norm, trendSource, title, duration, summary, script (array de 3 parágrafos), "
        "questions (array de 2 perguntas), checklist (array de 3 itens)."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {"responseMimeType": "application/json"},
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
    kits = json.loads(raw_text)

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    enriched = []
    for idx, kit in enumerate(kits, start=1):
        kit["id"] = f"dds-auto-{now_iso}-{idx}"
        kit["status"] = "pending_validation"
        kit["validatedBy"] = None
        kit["generatedAt"] = now_iso
        enriched.append(kit)

    os.makedirs("data", exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(enriched, f, ensure_ascii=False, indent=2)

    print(f"Gerados {len(enriched)} Kits de DDS pendentes de validação em {OUTPUT_PATH}.")


if __name__ == "__main__":
    generate_weekly_kits()
