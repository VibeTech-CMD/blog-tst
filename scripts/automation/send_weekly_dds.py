"""
Automação de Segunda-Feira (06h BRT) — Envio Automático dos Kits de DDS Validados pelo Cleilson
Compatível com Resend API (plano grátis até 3.000 e-mails/mês).
Só envia kits com status == 'approved' (validados pelo Cleilson).
"""
import json
import os
import urllib.request

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
RESEND_FROM = os.environ.get("RESEND_FROM", "Cleilson TST <onboarding@resend.dev>")
SUBSCRIBERS_CSV = os.environ.get("DDS_SUBSCRIBERS", "").strip()  # lista separada por vírgula ou integrada à API
DATA_PATH = os.path.join("data", "weekly-dds-pending.json")


def build_email_html(kits):
    cards = []
    for k in kits:
        checklist_html = "".join(f"<li>{item}</li>" for item in k.get("checklist", []))
        script_html = "".join(f"<p>{p}</p>" for p in k.get("script", []))
        cards.append(
            f"""
            <div style="border:1px solid #e2e8f0;border-left:5px solid #f59e0b;border-radius:10px;padding:18px;margin-bottom:20px;background:#ffffff;">
              <small style="color:#d97706;font-weight:bold;">{k.get('areaLabel', '')} • {k.get('norm', '')}</small>
              <h2 style="margin:6px 0 8px;color:#0b2545;">{k.get('title', '')}</h2>
              <p style="background:#fef3c7;padding:10px;border-radius:6px;"><strong>Resumo 30s:</strong> {k.get('summary', '')}</p>
              {script_html}
              <h4 style="color:#0b2545;margin-bottom:6px;">Checklist de Campo:</h4>
              <ul>{checklist_html}</ul>
            </div>
            """
        )

    return f"""
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#f8fafc;padding:24px;color:#0f172a;">
      <h1 style="color:#0b2545;margin-bottom:4px;">Kit Semanal de DDS — Cleilson TST</h1>
      <p style="color:#475569;margin-top:0;">Validado tecnicamente pelo Cleilson e pronto para aplicar no turno desta segunda-feira.</p>
      {''.join(cards)}
      <p style="font-size:12px;color:#64748b;text-align:center;">
        Acesse todos os artigos com auto-leitura em <a href="https://vibetech-cmd.github.io/cleilson-tst-blog/">Cleilson TST</a>.
      </p>
    </div>
    """


def send_weekly_email():
    if not os.path.exists(DATA_PATH):
        print("Nenhum arquivo de DDS encontrado.")
        return

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        kits = json.load(f)

    approved = [k for k in kits if k.get("status") == "approved"]
    if not approved:
        print("Nenhum Kit de DDS validado pelo Cleilson encontrado. Envio cancelado por segurança.")
        return

    if not RESEND_API_KEY or not SUBSCRIBERS_CSV:
        print("Configure RESEND_API_KEY e DDS_SUBSCRIBERS nos Secrets do GitHub para disparo automático.")
        return

    recipients = [e.strip() for e in SUBSCRIBERS_CSV.split(",") if e.strip()]
    html = build_email_html(approved)

    payload = {
        "from": RESEND_FROM,
        "to": recipients,
        "subject": f"🦺 Kit DDS da Semana (Validado por Cleilson TST): {approved[0]['title'][:55]}",
        "html": html,
    }

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {RESEND_API_KEY}",
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=30) as resp:
        print("Disparo concluído:", resp.status)


if __name__ == "__main__":
    send_weekly_email()
