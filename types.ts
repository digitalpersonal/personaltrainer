@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  /* Custom Vibrant Palette overrides */
  --color-zinc-950: #1a1a1a;
  --color-zinc-900: #262626;
  --color-zinc-850: #333333;
  --color-zinc-800: #404040;
}

body {
  background-color: #1a1a1a; /* Custom background #1A1A1A */
  color: #e4e4e7; /* zinc-200 */
  font-family: var(--font-sans);
}
