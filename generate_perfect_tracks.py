import subprocess

# PAR2: 2-lane basketball track.
# The user's image is a wide rectangular board (aspect ratio around 3.5:1)
# 1050 width x 300 height
# Features:
# 1. Outer deep blue bevel 3D rim base: #002b66, rounded corners
# 2. Outer cyan glossy border: #00b4d8 / #38bdf8
# 3. Inner clean white court border
# 4. Light golden/amber honey basketball hardwood parquet floor (#f5af42, #e08e2b, subtle horizontal lines)
# 5. Left side starting chevrons:
#    - Lane 1 (top): Emerald green chevron (#008f5d) with a lighter green inner arrow (#48d098)
#    - Lane 2 (bottom): Royal blue chevron (#0d52ba) with a lighter blue inner arrow (#64a2f8)
# 6. Central lane divider: Thick clean white line
# 7. Center of each lane: White dashed running dash lines (dashed road markers)
# 8. Right side:
#    - Reddish-orange key / free throw half-court area arcs (#e65100)
#    - White semi-circular key line arc
#    - Vertical dark navy mounting pole on right edge (#111827 / #1e293b)
#    - Two basketball backboards: glass blue border (#7dd3fc, #38bdf8), inner white/blue target rectangle
#    - Orange circular metal hoop/rim (#f97316)
#    - Realistic white hanging basketball netting

svg_par2 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 286" width="1000" height="286">
  <defs>
    <!-- 3D Stadium Base Gradients -->
    <linearGradient id="baseGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="25%" stop-color="#0369a1" />
      <stop offset="70%" stop-color="#075985" />
      <stop offset="100%" stop-color="#0c2d48" />
    </linearGradient>

    <!-- Deep 3D Shadow -->
    <linearGradient id="bottomShadow2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#034b75" />
      <stop offset="100%" stop-color="#061c2d" />
    </linearGradient>

    <!-- Hardwood Court Gradient -->
    <linearGradient id="woodGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffbe53" />
      <stop offset="30%" stop-color="#f5a435" />
      <stop offset="70%" stop-color="#e89320" />
      <stop offset="100%" stop-color="#d67b0d" />
    </linearGradient>

    <!-- Gloss Highlight -->
    <linearGradient id="courtGloss" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.35)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </linearGradient>

    <filter id="dropShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- 3D Stadium Base Bottom Lip -->
  <rect x="8" y="24" width="984" height="258" rx="30" fill="url(#bottomShadow2)" />
  <!-- 3D Stadium Base Main -->
  <rect x="8" y="10" width="984" height="260" rx="30" fill="url(#baseGrad2)" />
  <!-- Cyan Outer Ring -->
  <rect x="12" y="14" width="976" height="248" rx="26" fill="#00b4d8" />
  <!-- White Inset Border -->
  <rect x="18" y="20" width="964" height="236" rx="22" fill="#ffffff" />

  <!-- Hardwood Court Area -->
  <g clip-path="url(#courtClip2)">
    <clipPath id="courtClip2">
      <rect x="24" y="26" width="952" height="224" rx="18" />
    </clipPath>

    <!-- Wood Background -->
    <rect x="24" y="26" width="952" height="224" fill="url(#woodGrad2)" />

    <!-- Subtle Parquet Floor Planks Lines -->
    <path d="
      M24,54 L976,54 
      M24,82 L976,82 
      M24,110 L976,110 
      M24,166 L976,166 
      M24,194 L976,194 
      M24,222 L976,222
    " stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    <path d="
      M24,55 L976,55 
      M24,83 L976,83 
      M24,111 L976,111 
      M24,167 L976,167 
      M24,195 L976,195 
      M24,223 L976,223
    " stroke="rgba(180,83,9,0.12)" stroke-width="1.5" />

    <!-- Right-side Reddish-Orange Basketball Key Areas (3-Point Semi-Circle Paint) -->
    <!-- Lane 1 Key (Top) -->
    <path d="M920,26 A70,56 0 0,0 826,82 A70,56 0 0,0 920,138 Z" fill="#e65100" opacity="0.95" />
    <!-- White Arc boundary -->
    <path d="M920,26 A70,56 0 0,0 826,82 A70,56 0 0,0 920,138" fill="none" stroke="#ffffff" stroke-width="4.5" />

    <!-- Lane 2 Key (Bottom) -->
    <path d="M920,138 A70,56 0 0,0 826,194 A70,56 0 0,0 920,250 Z" fill="#e65100" opacity="0.95" />
    <!-- White Arc boundary -->
    <path d="M920,138 A70,56 0 0,0 826,194 A70,56 0 0,0 920,250" fill="none" stroke="#ffffff" stroke-width="4.5" />

    <!-- White Dashed Center Race Track Lines -->
    <!-- Lane 1 Dashed Line (cy = 82) -->
    <line x1="175" y1="82" x2="825" y2="82" stroke="#ffffff" stroke-width="6" stroke-dasharray="24,20" stroke-linecap="round" opacity="0.92" />
    <!-- Lane 2 Dashed Line (cy = 194) -->
    <line x1="175" y1="194" x2="825" y2="194" stroke="#ffffff" stroke-width="6" stroke-dasharray="24,20" stroke-linecap="round" opacity="0.92" />

    <!-- Solid White Central Divider Line -->
    <line x1="24" y1="138" x2="976" y2="138" stroke="#ffffff" stroke-width="6.5" />

    <!-- Left Starting Chevrons -->
    <!-- Top Lane: Green Chevron -->
    <path d="M24,26 L130,26 L175,82 L130,138 L24,138 Z" fill="#008f5d" />
    <!-- Inner Green Triangle Arrow -->
    <polygon points="126,62 152,82 126,102" fill="#6ee7b7" />

    <!-- Bottom Lane: Blue Chevron -->
    <path d="M24,138 L130,138 L175,194 L130,250 L24,250 Z" fill="#0d52ba" />
    <!-- Inner Blue Triangle Arrow -->
    <polygon points="126,174 152,194 126,214" fill="#93c5fd" />

    <!-- Top Gloss Shine on Floor -->
    <rect x="24" y="26" width="952" height="40" fill="url(#courtGloss)" />
  </g>

  <!-- BASKETBALL HOOP POST & HOOPS (Right Edge) -->
  <!-- Dark Navy Mounting Post Structure -->
  <g filter="url(#dropShadow)">
    <rect x="926" y="16" width="22" height="244" rx="7" fill="#0f172a" stroke="#1e293b" stroke-width="3" />
    <circle cx="937" cy="40" r="3" fill="#64748b" />
    <circle cx="937" cy="138" r="4" fill="#64748b" />
    <circle cx="937" cy="236" r="3" fill="#64748b" />
  </g>

  <!-- HOOP 1 (Top Lane - cy = 82) -->
  <g filter="url(#dropShadow)">
    <!-- Backboard Overhang Arms -->
    <rect x="902" y="78" width="26" height="8" rx="2" fill="#334155" />
    
    <!-- Clear Glass / Cyan Backboard with White Border -->
    <rect x="894" y="44" width="16" height="76" rx="4" fill="#7dd3fc" stroke="#ffffff" stroke-width="3" />
    <!-- Inner Red/Orange Target Box -->
    <rect x="897" y="62" width="10" height="40" rx="2" fill="none" stroke="#0284c7" stroke-width="2.5" />

    <!-- White Netting Behind Rim -->
    <path d="M860,86 L870,122 L892,122 L898,86 Z" fill="rgba(255,255,255,0.7)" stroke="#ffffff" stroke-width="2" />
    <!-- Cross netting weave -->
    <path d="M862,94 L894,116 M868,104 L888,122 M896,94 L864,116 M890,104 L872,122" stroke="#cbd5e1" stroke-width="1.5" />

    <!-- Orange Metallic Rim (Elliptical Perspective) -->
    <ellipse cx="878" cy="83" rx="24" ry="8" fill="none" stroke="#ea580c" stroke-width="6" />
    <ellipse cx="878" cy="83" rx="22" ry="6.5" fill="none" stroke="#f97316" stroke-width="3" />
  </g>

  <!-- HOOP 2 (Bottom Lane - cy = 194) -->
  <g filter="url(#dropShadow)">
    <!-- Backboard Overhang Arms -->
    <rect x="902" y="190" width="26" height="8" rx="2" fill="#334155" />

    <!-- Clear Glass / Cyan Backboard with White Border -->
    <rect x="894" y="156" width="16" height="76" rx="4" fill="#7dd3fc" stroke="#ffffff" stroke-width="3" />
    <!-- Inner Red/Orange Target Box -->
    <rect x="897" y="174" width="10" height="40" rx="2" fill="none" stroke="#0284c7" stroke-width="2.5" />

    <!-- White Netting Behind Rim -->
    <path d="M860,198 L870,234 L892,234 L898,198 Z" fill="rgba(255,255,255,0.7)" stroke="#ffffff" stroke-width="2" />
    <!-- Cross netting weave -->
    <path d="M862,206 L894,228 M868,216 L888,234 M896,206 L864,228 M890,216 L872,234" stroke="#cbd5e1" stroke-width="1.5" />

    <!-- Orange Metallic Rim -->
    <ellipse cx="878" cy="195" rx="24" ry="8" fill="none" stroke="#ea580c" stroke-width="6" />
    <ellipse cx="878" cy="195" rx="22" ry="6.5" fill="none" stroke="#f97316" stroke-width="3" />
  </g>
</svg>'''


# PAR3: 3-lane basketball track.
# Same glorious layout, 3 lanes: Top = Green, Middle = Red/Crimson, Bottom = Blue.
# 1000 width x 380 height
svg_par3 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 380" width="1000" height="380">
  <defs>
    <!-- 3D Stadium Base Gradients -->
    <linearGradient id="baseGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="25%" stop-color="#0369a1" />
      <stop offset="70%" stop-color="#075985" />
      <stop offset="100%" stop-color="#0c2d48" />
    </linearGradient>

    <linearGradient id="bottomShadow3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#034b75" />
      <stop offset="100%" stop-color="#061c2d" />
    </linearGradient>

    <linearGradient id="woodGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffbe53" />
      <stop offset="30%" stop-color="#f5a435" />
      <stop offset="70%" stop-color="#e89320" />
      <stop offset="100%" stop-color="#d67b0d" />
    </linearGradient>

    <linearGradient id="courtGloss3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.35)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </linearGradient>

    <filter id="dropShadow3" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- 3D Base -->
  <rect x="8" y="24" width="984" height="350" rx="30" fill="url(#bottomShadow3)" />
  <rect x="8" y="10" width="984" height="352" rx="30" fill="url(#baseGrad3)" />
  <!-- Cyan Outer Ring -->
  <rect x="12" y="14" width="976" height="340" rx="26" fill="#00b4d8" />
  <!-- White Inset Border -->
  <rect x="18" y="20" width="964" height="328" rx="22" fill="#ffffff" />

  <!-- Hardwood Court Area -->
  <g clip-path="url(#courtClip3)">
    <clipPath id="courtClip3">
      <rect x="24" y="26" width="952" height="316" rx="18" />
    </clipPath>

    <!-- Wood Background -->
    <rect x="24" y="26" width="952" height="316" fill="url(#woodGrad3)" />

    <!-- Floor Plank Lines -->
    <path d="
      M24,50 L976,50 M24,78 L976,78 M24,106 L976,106 
      M24,156 L976,156 M24,184 L976,184 M24,212 L976,212 
      M24,262 L976,262 M24,290 L976,290 M24,318 L976,318
    " stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    <path d="
      M24,51 L976,51 M24,79 L976,79 M24,107 L976,107 
      M24,157 L976,157 M24,185 L976,185 M24,213 L976,213 
      M24,263 L976,263 M24,291 L976,291 M24,319 L976,319
    " stroke="rgba(180,83,9,0.12)" stroke-width="1.5" />

    <!-- Lane 1 Key (Top) - cy = 79 -->
    <path d="M920,26 A64,52 0 0,0 836,79 A64,52 0 0,0 920,131 Z" fill="#e65100" opacity="0.95" />
    <path d="M920,26 A64,52 0 0,0 836,79 A64,52 0 0,0 920,131" fill="none" stroke="#ffffff" stroke-width="4" />

    <!-- Lane 2 Key (Middle) - cy = 184 -->
    <path d="M920,131 A64,52 0 0,0 836,184 A64,52 0 0,0 920,237 Z" fill="#e65100" opacity="0.95" />
    <path d="M920,131 A64,52 0 0,0 836,184 A64,52 0 0,0 920,237" fill="none" stroke="#ffffff" stroke-width="4" />

    <!-- Lane 3 Key (Bottom) - cy = 289 -->
    <path d="M920,237 A64,52 0 0,0 836,289 A64,52 0 0,0 920,342 Z" fill="#e65100" opacity="0.95" />
    <path d="M920,237 A64,52 0 0,0 836,289 A64,52 0 0,0 920,342" fill="none" stroke="#ffffff" stroke-width="4" />

    <!-- Dashed Center Running Track Lines -->
    <line x1="175" y1="79" x2="835" y2="79" stroke="#ffffff" stroke-width="5.5" stroke-dasharray="22,18" stroke-linecap="round" opacity="0.92" />
    <line x1="175" y1="184" x2="835" y2="184" stroke="#ffffff" stroke-width="5.5" stroke-dasharray="22,18" stroke-linecap="round" opacity="0.92" />
    <line x1="175" y1="289" x2="835" y2="289" stroke="#ffffff" stroke-width="5.5" stroke-dasharray="22,18" stroke-linecap="round" opacity="0.92" />

    <!-- Solid Dividers -->
    <line x1="24" y1="131" x2="976" y2="131" stroke="#ffffff" stroke-width="6" />
    <line x1="24" y1="237" x2="976" y2="237" stroke="#ffffff" stroke-width="6" />

    <!-- Left Starting Chevrons -->
    <!-- Lane 1: Green -->
    <path d="M24,26 L130,26 L175,79 L130,131 L24,131 Z" fill="#008f5d" />
    <polygon points="126,60 152,79 126,98" fill="#6ee7b7" />

    <!-- Lane 2: Red/Crimson -->
    <path d="M24,131 L130,131 L175,184 L130,237 L24,237 Z" fill="#c01d2e" />
    <polygon points="126,165 152,184 126,203" fill="#fca5a5" />

    <!-- Lane 3: Blue -->
    <path d="M24,237 L130,237 L175,289 L130,342 L24,342 Z" fill="#0d52ba" />
    <polygon points="126,270 152,289 126,308" fill="#93c5fd" />

    <rect x="24" y="26" width="952" height="40" fill="url(#courtGloss3)" />
  </g>

  <!-- Mounting Post -->
  <g filter="url(#dropShadow3)">
    <rect x="926" y="16" width="22" height="336" rx="7" fill="#0f172a" stroke="#1e293b" stroke-width="3" />
    <circle cx="937" cy="40" r="3" fill="#64748b" />
    <circle cx="937" cy="131" r="3.5" fill="#64748b" />
    <circle cx="937" cy="237" r="3.5" fill="#64748b" />
    <circle cx="937" cy="330" r="3" fill="#64748b" />
  </g>

  <!-- HOOP 1 (Lane 1 - cy = 79) -->
  <g filter="url(#dropShadow3)">
    <rect x="902" y="75" width="26" height="8" rx="2" fill="#334155" />
    <rect x="894" y="44" width="16" height="70" rx="4" fill="#7dd3fc" stroke="#ffffff" stroke-width="3" />
    <rect x="897" y="60" width="10" height="38" rx="2" fill="none" stroke="#0284c7" stroke-width="2.5" />
    <path d="M860,83 L870,117 L892,117 L898,83 Z" fill="rgba(255,255,255,0.7)" stroke="#ffffff" stroke-width="2" />
    <path d="M862,90 L894,111 M868,100 L888,117 M896,90 L864,111 M890,100 L872,117" stroke="#cbd5e1" stroke-width="1.5" />
    <ellipse cx="878" cy="80" rx="23" ry="7.5" fill="none" stroke="#ea580c" stroke-width="5.5" />
    <ellipse cx="878" cy="80" rx="21" ry="6" fill="none" stroke="#f97316" stroke-width="3" />
  </g>

  <!-- HOOP 2 (Lane 2 - cy = 184) -->
  <g filter="url(#dropShadow3)">
    <rect x="902" y="180" width="26" height="8" rx="2" fill="#334155" />
    <rect x="894" y="149" width="16" height="70" rx="4" fill="#7dd3fc" stroke="#ffffff" stroke-width="3" />
    <rect x="897" y="165" width="10" height="38" rx="2" fill="none" stroke="#0284c7" stroke-width="2.5" />
    <path d="M860,188 L870,222 L892,222 L898,188 Z" fill="rgba(255,255,255,0.7)" stroke="#ffffff" stroke-width="2" />
    <path d="M862,195 L894,216 M868,205 L888,222 M896,195 L864,216 M890,205 L872,222" stroke="#cbd5e1" stroke-width="1.5" />
    <ellipse cx="878" cy="185" rx="23" ry="7.5" fill="none" stroke="#ea580c" stroke-width="5.5" />
    <ellipse cx="878" cy="185" rx="21" ry="6" fill="none" stroke="#f97316" stroke-width="3" />
  </g>

  <!-- HOOP 3 (Lane 3 - cy = 289) -->
  <g filter="url(#dropShadow3)">
    <rect x="902" y="285" width="26" height="8" rx="2" fill="#334155" />
    <rect x="894" y="254" width="16" height="70" rx="4" fill="#7dd3fc" stroke="#ffffff" stroke-width="3" />
    <rect x="897" y="270" width="10" height="38" rx="2" fill="none" stroke="#0284c7" stroke-width="2.5" />
    <path d="M860,293 L870,327 L892,327 L898,293 Z" fill="rgba(255,255,255,0.7)" stroke="#ffffff" stroke-width="2" />
    <path d="M862,300 L894,321 M868,310 L888,327 M896,300 L864,321 M890,310 L872,327" stroke="#cbd5e1" stroke-width="1.5" />
    <ellipse cx="878" cy="290" rx="23" ry="7.5" fill="none" stroke="#ea580c" stroke-width="5.5" />
    <ellipse cx="878" cy="290" rx="21" ry="6" fill="none" stroke="#f97316" stroke-width="3" />
  </g>
</svg>'''

with open("public/par2.svg", "w") as f:
    f.write(svg_par2)

with open("public/par3.svg", "w") as f:
    f.write(svg_par3)

subprocess.run(["convert", "-background", "none", "public/par2.svg", "public/par2.png"], check=True)
subprocess.run(["convert", "-background", "none", "public/par3.svg", "public/par3.png"], check=True)
print("Generated high-res par2.png and par3.png in public/")
