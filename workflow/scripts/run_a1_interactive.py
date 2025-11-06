#!/usr/bin/env python3
"""
Interactive wrapper for checkcard-cli.py
Shows questions and answers step by step
"""
import subprocess
import sys

# Prepared answers for A1
answers = [
    "1",  # Agent: orchestrator
    "1",  # Step: A1
    # A1: User Request
    "Hero in 3 Variationen für Unternehmenswebsite Pacon Real Estate GmbH (Facility Management). Website: www.pacon-re.de, Primärfarbe: #98221F, Logo: public/paconMedium.svg. 3 Varianten mit Counter (1000 Mitarbeiter, 35 Standorte, 2000 Kunden), Media-Support (Bild/Video), CTAs für Bewerben + Vertrieb, mobil responsiv.",
    # A2: Orchestrator Dialog
    "true",  # user_approved_stepA2
    "Responsive Hero-Section mit 3 Design-Varianten für Pacon Real Estate GmbH Website (Facility Management), inkl. animierten Statistik-Countern, Media-Support (Bild/Video) und dualen CTAs für Recruiting + Vertrieb.",  # description_of_feature
    "Als Marketing-Manager von Pacon Real Estate GmbH möchte ich eine moderne, mobile-responsive Hero-Section in 3 Layout-Varianten entwickeln, damit ich verschiedene Zielgruppen (B2B Property Manager, potenzielle Mitarbeiter, Immobilienbesitzer) effektiv anspreche und gleichzeitig die Unternehmenskompetenz mit Statistiken (1000 Mitarbeiter, 35 Standorte, 2000 Kunden) unterstreiche. Acceptance Criteria: 3 Hero-Varianten (1: Stats-Driven mit Counter im Vordergrund, 2: Split-Screen Text/CTAs links Media rechts, 3: Fullscreen Media mit Overlay), CTAs (Jetzt bewerben + Vertrieb kontaktieren), Animierte Counter (Framer Motion), Media-Support (Bild/Video), Primärfarbe #98221F, Logo public/paconMedium.svg, Mobil-responsiv (Tailwind), Techstack: React+TypeScript+Tailwind+shadcn/ui",  # user_story
    # Tools
    "package.json,.claude/templates/README.md,public/paconMedium.svg",  # file_context_accessed
    "WebFetch",  # mcp_servers_accessed
    ".claude/skills/.custom/speckit"  # claude_skills_accessed
]

print("=" * 60)
print("Running Checkcard CLI for A1 - Step by Step")
print("=" * 60)
print()

# Create input string with all answers
input_text = "\n".join(answers) + "\n"

# Run CLI with prepared input
process = subprocess.Popen(
    [sys.executable, "checkcard-cli.py"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    cwd="."
)

# Send all answers at once and get output
stdout, _ = process.communicate(input=input_text)

# Print output
print(stdout)

# Exit with same code as CLI
sys.exit(process.returncode)
