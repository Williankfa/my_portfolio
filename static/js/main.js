/*PORTFOLIO — MAIN SCRIPT */

'use strict';

// CUSTOM CURSOR

class SoulCursor {
  constructor() {
    this.el = document.getElementById('cursor');
    if (!this.el || window.matchMedia('(max-width: 900px)').matches) return;
    this.x = -100; this.y = -100;
    this.tx = -100; this.ty = -100;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', e => {
      this.tx = e.clientX;
      this.ty = e.clientY;
    });

    document.addEventListener('mousedown', () => this.el.classList.add('clicking'));
    document.addEventListener('mouseup',   () => this.el.classList.remove('clicking'));

    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => this.el.classList.add('hovering'));
      el.addEventListener('mouseleave', () => this.el.classList.remove('hovering'));
    });

    this.animate();
  }

  animate() {
    this.x += (this.tx - this.x) * 0.2;
    this.y += (this.ty - this.y) * 0.2;
    this.el.style.left = `${this.x}px`;
    this.el.style.top  = `${this.y}px`;
    requestAnimationFrame(() => this.animate());
  }
}

// TYPEWRITER EFFECT
class Typewriter {
  constructor(el, text, speed = 38) {
    this.el       = el;
    this.text     = text;
    this.speed    = speed;
    this.idx      = 0;
    this._stopped = false;
    // cursor removido — causava o quadradinho piscando no canto errado
  }

  stop() {
    this._stopped = true;
  }

  start() {
    this._stopped = false;
    this.el.textContent = '';
    this.idx = 0;
    this._type();
  }

  _type() {
    if (this._stopped) return;

    if (this.idx < this.text.length) {
      this.el.textContent += this.text[this.idx++];
      const jitter = Math.random() * 20 - 10;
      setTimeout(() => this._type(), this.speed + jitter);
    }
  }
}


// SCROLL REVEAL

class ScrollReveal {
  constructor() {
    this.observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          if (e.target.classList.contains('stagger-children')) {
            e.target.classList.add('revealed');
          }
        } else {
          e.target.classList.remove('revealed');
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
  }

  observe() {
    document.querySelectorAll('[data-reveal], .stagger-children').forEach(el => {
      this.observer.observe(el);
    });
  }
}


// PARALLAX

class ParallaxEngine {
  constructor() {
    this.elements = [];
    this.ticking = false;
    this.collect();
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => { this.update(); this.ticking = false; });
        this.ticking = true;
      }
    });
  }

  collect() {
    document.querySelectorAll('[data-parallax]').forEach(el => {
      this.elements.push({ el, speed: parseFloat(el.dataset.parallax) || 0.3 });
    });
  }

  update() {
    const sy = window.scrollY;
    this.elements.forEach(({ el, speed }) => {
      const rect = el.closest('section')?.getBoundingClientRect();
      if (!rect) return;
      const off = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${off}px)`;
    });
  }
}


// STAR FIELD

class StarField {
  constructor(container) {
    this.container = container;
    if (!container) return;
    this.spawn(120);
    this.spawnShootingStars();
  }

  spawn(count) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.style.cssText = `
        position: absolute;
        width: ${Math.random() < 0.15 ? 3 : 2}px;
        height: ${Math.random() < 0.15 ? 3 : 2}px;
        background: #fff;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 65}%;
        opacity: ${0.3 + Math.random() * 0.7};
        image-rendering: pixelated;
        animation: blink ${1.5 + Math.random() * 3}s steps(2) ${Math.random() * 4}s infinite;
      `;
      this.container.appendChild(s);
    }
  }

  spawnShootingStars() {
    const shoot = () => {
      const s = document.createElement('div');
      const top  = Math.random() * 50;
      const left = 20 + Math.random() * 60;
      s.style.cssText = `
        position: absolute;
        width: 60px; height: 2px;
        background: linear-gradient(90deg, transparent, #fff);
        left: ${left}%;
        top: ${top}%;
        transform: rotate(-25deg);
        animation: shootStar 0.7s linear forwards;
        pointer-events: none;
      `;
      this.container.appendChild(s);
      setTimeout(() => s.remove(), 800);
      setTimeout(shoot, 3000 + Math.random() * 8000);
    };
    setTimeout(shoot, 2000);
  }
}

// TERRAIN GENERATOR

class TerrainGenerator {
  constructor(container) {
    this.container = container;
    if (!container) return;
    this.generate();
    this.addOres();
  }

  generate() {
    const heights = [];
    for (let i = 0; i < 60; i++) {
      heights.push(20 + Math.sin(i * 0.3) * 12 + Math.sin(i * 0.7) * 8 + Math.random() * 6);
    }

    const colors = ['#3D7A1A','#3D7A1A','#4A8B21','#5C3B1E','#5C3B1E','#4A3018'];
    heights.forEach((h, i) => {
      const block = document.createElement('div');
      block.className = 'terrain-block';
      block.style.cssText = `height:${h}px; background:${colors[i % colors.length]};`;
      this.container.appendChild(block);
    });
  }

  addOres() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    const ores = [
      { color: '#C8A832', count: 8 },
      { color: '#3C8CB5', count: 6 },
      { color: '#B53C3C', count: 5 },
    ];
    ores.forEach(({ color, count }) => {
      for (let i = 0; i < count; i++) {
        const ore = document.createElement('div');
        ore.className = 'ore-vein';
        ore.style.cssText = `
          background: ${color};
          width: ${8 + Math.random() * 16}px;
          height: ${8 + Math.random() * 8}px;
          top: ${20 + Math.random() * 70}%;
          left: ${Math.random() * 95}%;
          box-shadow: 0 0 6px ${color}88;
          border-radius: 1px;
        `;
        skillsSection.querySelector('.underground-layers')?.appendChild(ore);
      }
    });
  }
}

// INVENTORY GRID

const SKILLS_DATA = [
  { name: 'HTML & CSS',      iconSlug: 'html5',           iconColor: 'E34F26', tier: 'gold',  lvl: '★★★★☆', desc: 'Layouts, animações e design responsivo.' },
  { name: 'JavaScript',      iconSlug: 'javascript',      iconColor: 'F7DF1E', tier: 'gold',  lvl: '★★★☆☆', desc: 'Lógica de programação e interatividade na web.' },
  { name: 'Python',          iconSlug: 'python',          iconColor: '3776AB', tier: 'gem',   lvl: '★★★☆☆', desc: 'Algoritmos, lógica e automação de scripts.' },
  { name: 'Git',             iconSlug: 'git',             iconColor: 'F05032', tier: 'gold',  lvl: '★★★★☆', desc: 'Controle de versão e git workflow na prática.' },
  { name: 'GitHub',          iconSlug: 'github',          iconColor: '181717', tier: 'gem',   lvl: '★★★★☆', desc: 'Repositórios, colaboração e projetos open source.' },
  { name: 'VS Code',         iconSlug: null,              iconColor: '007ACC', tier: 'stone', lvl: '★★★★★', desc: 'Editor principal — extensões e produtividade.', svgInline: `<svg viewBox="0 0 24 24" width="44" height="44" xmlns="http://www.w3.org/2000/svg" fill="%23007ACC"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 00-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 00-1.276.057L.327 7.261A1 1 0 00.326 8.74L3.899 12 .326 15.26a1 1 0 00.001 1.479L1.65 17.94a.999.999 0 001.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 001.704.29l4.942-2.377A1.5 1.5 0 0024 19.923V4.077a1.5 1.5 0 00-.85-1.49zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>` },
  { name: 'Algorithms',      iconSlug: 'leetcode',        iconColor: 'FFA116', tier: 'ruby',  lvl: '★★★☆☆', desc: 'Algoritmos e resolução de problemas lógicos.' },
  { name: 'Data Structures', iconSlug: 'stackoverflow',   iconColor: 'F58025', tier: 'ruby',  lvl: '★★☆☆☆', desc: 'Estruturas de dados fundamentais em estudo.' },
  { name: 'Shell',           iconSlug: 'gnubash',         iconColor: '4EAA25', tier: 'stone', lvl: '★★★☆☆', desc: 'Scripts bash, terminal e automação de tarefas.' },
  { name: 'Agile / Scrum',   iconSlug: 'jira',            iconColor: '0052CC', tier: 'stone', lvl: '★★☆☆☆', desc: 'Metodologias ágeis e entrega incremental.' },
];

const EXP_BARS = [
  { label: 'Frontend',   pct: 70, cls: 'gold' },
  { label: 'Logic',      pct: 65, cls: 'gem'  },
  { label: 'Git Flow',   pct: 75, cls: 'ruby' },
  { label: 'Shell',      pct: 60, cls: 'gold' },
  { label: 'Agile',      pct: 50, cls: 'gem'  },
  { label: 'Communication', pct: 85, cls: 'ruby' },
];

function buildInventory() {
  const grid = document.getElementById('inventory-grid');
  if (!grid) return;
  SKILLS_DATA.forEach((skill, i) => {
    const slot = document.createElement('div');
    slot.className = 'inv-slot';
    slot.style.transitionDelay = `${i * 0.06}s`;
    const iconUrl = `https://cdn.simpleicons.org/${skill.iconSlug}/${skill.iconColor}`;
    const iconHTML = skill.svgInline
      ? `<span class="inv-icon-img" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;">${skill.svgInline}</span>`
      : `<img class="inv-icon-img" src="${iconUrl}" alt="${skill.name}" width="44" height="44" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'inv-icon',textContent:'◈'}))" />`;
    slot.innerHTML = `
      ${iconHTML}
      <span class="inv-name">${skill.name}</span>
      <span class="inv-tier tier-${skill.tier}">${skill.lvl}</span>
      <div class="tooltip">${skill.desc}</div>
    `;
    grid.appendChild(slot);
  });

  const expContainer = document.getElementById('exp-bars');
  if (!expContainer) return;
  EXP_BARS.forEach(bar => {
    const item = document.createElement('div');
    item.className = 'exp-bar-item';
    item.innerHTML = `
      <div class="exp-bar-label">
        <span>${bar.label}</span>
        <span>${bar.pct}%</span>
      </div>
      <div class="exp-bar-track">
        <div class="exp-bar-fill ${bar.cls}" data-pct="${bar.pct}"></div>
      </div>
    `;
    expContainer.appendChild(item);
  });
}

function animateExpBars() {
  document.querySelectorAll('.exp-bar-fill').forEach(bar => {
    bar.style.transition = 'none';
    bar.style.width = '0%';
    bar.offsetWidth;
    bar.style.transition = '';
    const pct = bar.dataset.pct;
    setTimeout(() => { bar.style.width = `${pct}%`; }, 80);
  });
}

// ================================================================
// PROJECTS GRID
// ================================================================

const PROJECTS_DATA = [
  {
    id:    'wasm',
    name:  'WASM GUARDIAN',
    color: '#00BCB4',
    badge: null,
    tags:  ['JavaScript', 'React', 'WebAssembly', 'Security'],
    desc:  'Analisador estático local para engenharia reversa de binários WebAssembly. Roda 100% no browser — nenhum byte trafega pela rede. Valida a assinatura mágica do arquivo antes de qualquer processamento; mapeia seções internas (Type, Import, Function, Code, Data) exibindo offsets exatos e tamanhos; perfila opcodes em três categorias — fluxo de controle, operações de memória e lógica matemática — gerando um diagnóstico comportamental automático; calcula entropia Shannon (valores acima de 7.5 indicam ofuscação ou compressão); realiza taint analysis rastreando caminhos suspeitos entre imports externos e funções marcadas como críticas; extrai strings com filtros por URLs, tokens de autenticação e flags CTF; reconstrói strings montadas em runtime via sequências de opcodes; e decompila bytecode em pseudocódigo indentado e legível.',
    link:  'https://williankfa.github.io/wasm-guardian',
    repo:  'https://github.com/Williankfa/wasm-guardian',
    wip:   false,
  },
  {
    id:    'hashmax',
    name:  'HASHMAX',
    color: '#39d353',
    badge: 'PROJETO EM GRUPO',
    badgeColor: '#7f77dd',
    tags:  ['HTML5', 'CSS3', 'JavaScript', 'CryptoJS'],
    desc:  'Sistema avançado de criptografia web desenvolvido em equipe. Cobre codificação (Base64, Hexadecimal, Binário, URL Encoding RFC 3986 e Código Morse); criptografia simétrica com AES-256 padrão militar, AES-128, DES clássico, Triple DES, stream cipher Rabbit e RC4; criptografia assimétrica com RSA-2048 — geração completa de par de chaves pública/privada, cifragem e decifragem; e hashing com SHA-256, SHA-512, SHA-1, MD5, SHA-3 última geração e RIPEMD-160 pronto para Bitcoin. Recursos extras: histórico de operações persistido em localStorage, drag & drop para carregar arquivos, geração de QR Code para acesso rápido ao repositório, contadores de caracteres em tempo real e modal de membros integrado ao GitHub da equipe.',
    link:  'https://jotavedreis.github.io/criptografia-HASHMAX/',
    repo:  'https://github.com/jotavedreis/criptografia-HASHMAX',
    wip:   false,
  },
  {
    id:    'wifi',
    name:  'AIC8800D80 FIX',
    color: '#F05032',
    badge: 'KERNEL 6.17',
    badgeColor: '#cc0000',
    tags:  ['C', 'Linux', 'Kernel', 'Driver', 'DKMS'],
    desc:  'Driver fix para adaptadores WiFi com chipset AIC8800D80 — exibidos como 1111:1111 Pandora International Ltd. 88M80 no lsusb — que param de funcionar no Linux Kernel 6.17 devido a quebras de API. Afeta dispositivos como WIFI6-BW22/BW23, AX900 WiFi 6 USB Adapter e qualquer adaptador "900Mbps WiFi 6" não-identificado. Corrige cinco breaking changes introduzidos no kernel 6.17: remoção de from_timer e substituição por timer_container_of; assinaturas de cfg80211_rx_spurious_frame e cfg80211_rx_unexpected_4addr_frame com novo argumento obrigatório; mudança na assinatura de set_tx_power; e adição do parâmetro radio_idx em set_wiphy_params. A instalação é feita com um único script bash. Testado com sucesso no Zorin OS 17 com kernel 6.17.0-23-generic.',
    link:  'https://github.com/Williankfa/AIC8800D80-kernel-6.17-fix',
    repo:  'https://github.com/Williankfa/AIC8800D80-kernel-6.17-fix',
    wip:   false,
    repoOnly: true,
  },
  {
    id:    'lyric',
    name:  'MUSIC_APP',
    color: '#D4A017',
    badge: 'EM BREVE',
    badgeColor: '#D4A017',
    tags:  ['Linux', 'Python', 'GTK', 'LRC Sync'],
    desc:  'App gerenciador de músicas nativo para Linux com letras sincronizadas linha a linha em tempo real. Cada faixa exibe a letra com destaque na linha atual conforme a música avança. Conta com playlists completas com fotos de capa e fotos dos artistas, aba de favoritos, ranking das músicas mais escutadas, miniplayer flutuante que persiste durante a navegação, botão de ordem aleatória, fila de reprodução editável com drag & drop, histórico de plays com estatísticas e controles de reprodução completos — play, pause, próxima, anterior e volume. Interface inspirada nos grandes players de desktop, reconstruída do zero para o ecossistema Linux.',
    link:  null,
    repo:  null,
    wip:   true,
  },
];

const PROJECT_SVG_ICONS = {
  wasm: `<svg viewBox="0 0 24 24" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 7l-4 4 4 4M16 7l4 4-4 4M13 6l-2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  hashmax: `<svg viewBox="0 0 24 24" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <path d="M7 9h10M7 12h10M7 15h10M10 6v12M14 6v12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`,
  wifi: `<svg viewBox="0 0 24 24" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5C6.5 6 10 4.5 12 4.5s5.5 1.5 9 5M6.5 13c1.5-1.5 3.5-2.5 5.5-2.5s4 1 5.5 2.5M9 16.5c.8-.8 1.8-1.5 3-1.5s2.2.7 3 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
  </svg>`,
  lyric: `<svg viewBox="0 0 24 24" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="17" r="3" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="18" cy="15" r="3" stroke="currentColor" stroke-width="1.5"/>
    <path d="M11 17V7l10-2v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M5 10h14" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-dasharray="2 2"/>
  </svg>`,
};

function buildProjectsGrid() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  PROJECTS_DATA.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'proj-card';
    if (proj.wip) card.classList.add('proj-card--wip');
    card.style.animationDelay = `${i * 0.08}s`;

    let badgeHTML = '';
    if (proj.badge) {
      badgeHTML = `<span class="proj-badge" style="border-color:${proj.badgeColor};color:${proj.badgeColor};">${proj.badge}</span>`;
    }

    let actionsHTML = '';
    if (proj.wip) {
      actionsHTML = `<span class="proj-btn proj-btn--soon">EM BREVE</span>`;
    } else if (proj.repoOnly) {
      actionsHTML = `<a href="${proj.repo}" target="_blank" rel="noopener" class="proj-btn proj-btn--ghost">REPO ↗</a>`;
    } else {
      actionsHTML = `
        <a href="${proj.link}" target="_blank" rel="noopener" class="proj-btn">DEMO ↗</a>
        <a href="${proj.repo}" target="_blank" rel="noopener" class="proj-btn proj-btn--ghost">REPO ↗</a>
      `;
    }

    card.innerHTML = `
      <div class="proj-card-top">
        <div class="proj-icon" style="color:${proj.color};">
          ${PROJECT_SVG_ICONS[proj.id] || PROJECT_SVG_ICONS.wasm}
        </div>
        <div class="proj-header">
          <div class="proj-title-row">
            <span class="proj-dot" style="background:${proj.color};box-shadow:0 0 6px ${proj.color}88;"></span>
            <span class="proj-name">${proj.name}</span>
            ${badgeHTML}
          </div>
          <div class="proj-tags">
            ${proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
      <p class="proj-desc">${proj.desc}</p>
      <div class="proj-actions">${actionsHTML}</div>
    `;

    card.style.setProperty('--proj-accent', proj.color);
    grid.appendChild(card);
  });
}


// SECTION TRANSITIONS (battle flash)

function observeSectionTransitions() {
  let lastSection = '';

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      if (id === lastSection) return;
      lastSection = id;

      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });

      if (id === 'projects') {
        const flash = document.createElement('div');
        flash.className = 'battle-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);
      }

      if (id === 'about') {
        const flash = document.createElement('div');
        flash.style.cssText = `
          position:fixed;inset:0;background:var(--omori-white);
          z-index:99990;pointer-events:none;
          animation: flashOut 0.4s ease forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 500);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('section').forEach(s => io.observe(s));
}


// SKILLS OBSERVER
function observeSkills() {
  const skillsBlock = document.querySelector('.inventory-grid');
  const expSection  = document.getElementById('exp-bars');

  if (skillsBlock) {
    let generation = 0; // ← chave da correção

    const slotObserver = new IntersectionObserver(([e]) => {
      const myGen = ++generation; // incrementa a cada disparo

      if (e.isIntersecting) {
        skillsBlock.querySelectorAll('.inv-slot').forEach((slot, i) => {
          slot.style.transition = 'none';
          slot.style.opacity    = '0';
          slot.style.transform  = 'scale(0.7)';
          slot.offsetWidth; // força reflow

          setTimeout(() => {
            if (generation !== myGen) return; // timer de geração antiga → ignora
            slot.style.transition = 'opacity 0.3s steps(4), transform 0.3s steps(4)';
            slot.style.opacity    = '1';
            slot.style.transform  = 'scale(1)';
          }, i * 80);
        });
      } else {
        skillsBlock.querySelectorAll('.inv-slot').forEach(slot => {
          slot.style.transition = 'none';
          slot.style.opacity    = '0';
          slot.style.transform  = 'scale(0.7)';
        });
      }
    }, { threshold: 0.1 });

    slotObserver.observe(skillsBlock);
  }

  if (expSection) {
    const barObserver = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        animateExpBars();
      } else {
        expSection.querySelectorAll('.exp-bar-fill').forEach(bar => {
          bar.style.transition = 'none';
          bar.style.width = '0%';
        });
      }
    }, { threshold: 0.2 });

    barObserver.observe(expSection);
  }
}

// ABOUT SECTION TYPEWRITER

function initAboutTypewriter() {
  const textEl       = document.getElementById('dialogue-text-content');
  const aboutSection = document.getElementById('about');
  if (!textEl || !aboutSection) return;

  // esconde o cursor externo — ele não acompanha o texto inline
  const cursorEl = textEl.parentElement?.querySelector('.dialogue-cursor');
  if (cursorEl) cursorEl.style.display = 'none';

  let fired = false;

  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || fired) return;
    fired = true;

    const fullText = textEl.dataset.text || '';
    textEl.textContent = '';

    const tw = new Typewriter(textEl, fullText, 35);
    window._currentDialogueTw = tw;
    setTimeout(() => tw.start(), 600);

    setTimeout(() => {
      document.querySelectorAll('.stat-bar-fill').forEach(bar => bar.classList.add('go'));
    }, 900);

    io.unobserve(aboutSection);
  }, { threshold: 0.25 });

  io.observe(aboutSection);
}

// CHIPTUNE AUDIO (Web Audio API)

class ChiptuneAudio {
  constructor() {
    this.ctx    = null;
    this.active = false;
    this.btn    = document.getElementById('audio-toggle');
    this.btn?.addEventListener('click', () => this.toggle());
    document.querySelectorAll('.nav-links a, .pixel-btn').forEach(el => {
      el.addEventListener('click', () => this.beep(523, 0.08, 0.1));
    });
    document.querySelectorAll('.proj-card').forEach(el => {
      el.addEventListener('mouseenter', () => this.beep(660, 0.06, 0.08));
    });
  }

  initCtx() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  toggle() {
    this.initCtx();
    this.active = !this.active;
    if (this.btn) {
      this.btn.textContent = this.active ? '♪ ON' : '♪ OFF';
      this.btn.classList.toggle('on', this.active);
    }
    if (this.active) this.playAmbient();
  }

  beep(freq, vol = 0.1, dur = 0.1) {
    if (!this.active) return;
    this.initCtx();
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }

  playAmbient() {
    if (!this.active) return;
    const melody = [262, 294, 330, 349, 392, 349, 330, 294];
    melody.forEach((freq, i) => {
      setTimeout(() => {
        if (this.active) this.beep(freq, 0.04, 0.3);
      }, i * 350);
    });
    setTimeout(() => { if (this.active) this.playAmbient(); }, melody.length * 350 + 2000);
  }
}

// ================================================================
// CONTACT FORM — Formspree (fetch/AJAX, sem redirect)
// ================================================================

async function initContactForm() {
  const form     = document.getElementById('contact-form');
  const response = document.getElementById('form-response');
  if (!form) return;

  const BOT_TOKEN = '8801591036:AAEFOJCi5Waey7ug2GifmLZ_YjJ2Sp3eEC4';
  const CHAT_ID   = '8051815434';

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = form.querySelector('[name="name"]')?.value.trim()    || '';
    const message = form.querySelector('[name="message"]')?.value.trim() || '';

    if (!name || !message) {
      if (response) {
        response.textContent = '* Preencha seu nome e mensagem antes de enviar.';
        response.classList.add('visible');
      }
      return;
    }

    const btn = form.querySelector('.submit-btn');
    if (btn) { btn.innerHTML = '* Sending... <span class="soul-mini">♥</span>'; btn.disabled = true; }

    const text = ` *PORTFOLIO CONTACT*\n\n*Nome:* ${name}\n*Msg:* ${message}`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:    CHAT_ID,
          text:       text,
          parse_mode: 'Markdown',
        }),
      });

      const data = await res.json();

      if (data.ok) {
        if (response) {
          response.textContent = '* Message sent! It fills you with DETERMINATION. ♥';
          response.classList.add('visible');
        }
        form.reset();
      } else {
        throw new Error(data.description || 'Telegram error');
      }
    } catch (err) {
      if (response) {
        response.textContent = `* Algo deu errado: ${err.message}`;
        response.classList.add('visible');
      }
    } finally {
      if (btn) { btn.innerHTML = 'SEND <span class="soul-mini">♥</span>'; btn.disabled = false; }
    }
  });
}

// HERO PARALLAX

function buildHeroParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  function makeMountainSVG(peaks, fillColor, strokeColor, w = 1200, h = 220) {
    const path = `M0,${h} ` + peaks.map(([x, y]) => `L${x},${y}`).join(' ') + ` L${w},${h} Z`;
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;width:100%;height:100%;display:block;">
      <path d="${path}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5"/>
    </svg>`;
  }

  const farPeaks = [
    [0,180],[60,155],[120,170],[200,140],[280,160],[360,130],[440,148],[520,125],
    [600,142],[680,120],[760,138],[840,115],[920,132],[1000,118],[1080,135],[1200,180]
  ];
  const midPeaks = [
    [0,220],[80,165],[160,185],[250,148],[340,170],[430,135],[510,158],[600,128],
    [690,150],[780,122],[860,142],[950,112],[1040,138],[1120,155],[1200,220]
  ];
  const nearPeaks = [
    [0,220],[70,175],[150,195],[240,155],[330,178],[410,142],[500,165],[590,135],
    [680,160],[770,128],[850,152],[940,118],[1030,145],[1110,168],[1200,220]
  ];

  const layers = [
    { id: 'par-mtn-far',  svg: makeMountainSVG(farPeaks,  'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.08)') },
    { id: 'par-mtn-mid',  svg: makeMountainSVG(midPeaks,  'rgba(255,255,255,0.07)', 'rgba(255,255,255,0.13)') },
    { id: 'par-mtn-near', svg: makeMountainSVG(nearPeaks, 'rgba(255,255,255,0.10)', 'rgba(255,255,255,0.18)') },
  ];

  layers.forEach(({ id, svg }) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = svg;
  });

  function makeCloudSVG(w, h) {
    const bw = Math.round(w / 3);
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
      style="image-rendering:pixelated;display:block;" width="${w}" height="${h}">
      <rect x="${bw}"     y="${Math.round(h*0.55)}" width="${Math.round(w*0.55)}" height="${Math.round(h*0.38)}" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
      <rect x="${Math.round(bw*0.6)}" y="${Math.round(h*0.38)}" width="${Math.round(w*0.38)}" height="${Math.round(h*0.42)}" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
      <rect x="${Math.round(bw*1.5)}" y="${Math.round(h*0.22)}" width="${Math.round(w*0.35)}" height="${Math.round(h*0.48)}" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
      <rect x="${Math.round(bw*2.2)}" y="${Math.round(h*0.38)}" width="${Math.round(w*0.3)}"  height="${Math.round(h*0.42)}" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
    </svg>`;
  }

  const cloudLayer = document.getElementById('par-clouds');
  if (!cloudLayer) return;

  const cloudDefs = [
    [5,  15, 90, 36, 52, 0 ],
    [22, 8,  70, 28, 68, 8 ],
    [40, 20, 110,44, 44, 4 ],
    [60, 10, 80, 32, 60, 14],
    [78, 18, 65, 26, 56, 2 ],
    [90, 6,  95, 38, 72, 20],
    [12, 28, 55, 22, 80, 30],
    [55, 30, 75, 30, 48, 10],
  ];

  const style = document.createElement('style');
  style.textContent = `
    @keyframes cloudDrift {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-120vw); }
    }
  `;
  document.head.appendChild(style);

  cloudDefs.forEach(([x, top, w, h, dur, delay]) => {
    const cloud = document.createElement('div');
    cloud.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${top}%;
      width: ${w}px;
      height: ${h}px;
      animation: cloudDrift ${dur}s linear ${delay}s infinite;
      pointer-events: none;
      will-change: transform;
    `;
    cloud.innerHTML = makeCloudSVG(w, h);
    cloudLayer.appendChild(cloud);
  });

  const parEls = [
    { el: document.getElementById('par-mtn-far'),  speed: 0.06 },
    { el: document.getElementById('par-mtn-mid'),  speed: 0.13 },
    { el: document.getElementById('par-mtn-near'), speed: 0.22 },
    { el: cloudLayer,                               speed: 0.04 },
  ];

  function updateHeroParallax() {
    const scrollY = window.scrollY;
    const heroH   = hero.offsetHeight;
    if (scrollY > heroH * 1.2) return;
    parEls.forEach(({ el, speed }) => {
      if (!el) return;
      const shift = scrollY * speed;
      el.style.transform = `translateY(${shift}px)`;
    });
  }

  window.addEventListener('scroll', updateHeroParallax, { passive: true });
  updateHeroParallax();
}

// ABOUT SCENE — pixel trees + bouncing rabbits

function spawnDinoScene() {
  const groundLayer = document.getElementById('about-ground-layer');
  const doodleLayer = document.getElementById('doodle-layer');

  if (groundLayer) {
    const treeSVGs = {
      tall: (h) => `<svg viewBox="0 0 22 ${h}" width="22" height="${h}" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;">
        <rect x="9" y="${h-8}" width="4" height="8" fill="rgba(0,0,0,0.1)"/>
        <polygon points="11,4 3,${Math.round(h*0.55)} 19,${Math.round(h*0.55)}" fill="rgba(0,0,0,0.09)" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>
        <polygon points="11,14 2,${Math.round(h*0.75)} 20,${Math.round(h*0.75)}" fill="rgba(0,0,0,0.08)" stroke="rgba(0,0,0,0.11)" stroke-width="1"/>
        <polygon points="11,24 1,${h-8} 21,${h-8}" fill="rgba(0,0,0,0.07)" stroke="rgba(0,0,0,0.10)" stroke-width="1"/>
      </svg>`,
      short: (h) => `<svg viewBox="0 0 16 ${h}" width="16" height="${h}" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;">
        <rect x="6" y="${h-6}" width="4" height="6" fill="rgba(0,0,0,0.09)"/>
        <polygon points="8,4 2,${Math.round(h*0.5)} 14,${Math.round(h*0.5)}" fill="rgba(0,0,0,0.08)" stroke="rgba(0,0,0,0.11)" stroke-width="1"/>
        <polygon points="8,14 1,${h-6} 15,${h-6}" fill="rgba(0,0,0,0.07)" stroke="rgba(0,0,0,0.10)" stroke-width="1"/>
      </svg>`,
    };

    const treeDefs = [
      [2,  'tall',  1.1, 0   ],
      [7,  'short', 0.8, 0.4 ],
      [13, 'tall',  0.9, 0.8 ],
      [20, 'short', 1.0, 1.2 ],
      [28, 'tall',  1.2, 0.2 ],
      [36, 'short', 0.7, 1.0 ],
      [44, 'tall',  1.0, 0.6 ],
      [52, 'short', 0.9, 1.4 ],
      [60, 'tall',  1.1, 0.3 ],
      [68, 'short', 0.8, 0.9 ],
      [75, 'tall',  0.9, 1.6 ],
      [82, 'short', 1.0, 0.5 ],
      [89, 'tall',  1.2, 1.1 ],
      [95, 'short', 0.7, 0.7 ],
      [99, 'tall',  0.8, 1.8 ],
    ];

    treeDefs.forEach(([x, type, scale, swayDelay], i) => {
      const h = type === 'tall' ? 80 : 55;
      const tree = document.createElement('div');
      tree.style.cssText = `
        position: absolute;
        bottom: 0;
        left: ${x}%;
        transform-origin: bottom center;
        transform: scale(${scale});
        animation:
          treeEntry 0.7s cubic-bezier(0.16,1,0.3,1) ${0.04 * i + 0.1}s both,
          treeSway  4s ease-in-out ${swayDelay}s infinite;
        pointer-events: none;
      `;
      tree.innerHTML = treeSVGs[type](h);
      groundLayer.appendChild(tree);
    });

    const gline = document.createElement('div');
    gline.style.cssText = `
      position:absolute; bottom:0; left:0; right:0; height:1px;
      background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1) 15%, rgba(0,0,0,0.1) 85%, transparent);
    `;
    groundLayer.appendChild(gline);
  }

  if (doodleLayer) {
    const rabbitSVG = `<svg viewBox="0 0 16 14" width="16" height="14" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;">
      <rect x="3" y="0" width="2" height="5" fill="rgba(0,0,0,0.09)" rx="1"/>
      <rect x="7" y="0" width="2" height="5" fill="rgba(0,0,0,0.09)" rx="1"/>
      <rect x="2" y="4" width="8" height="6" fill="rgba(0,0,0,0.09)" rx="2"/>
      <rect x="8" y="5" width="1" height="1" fill="rgba(0,0,0,0.2)"/>
      <rect x="1" y="8" width="10" height="5" fill="rgba(0,0,0,0.08)" rx="2"/>
      <rect x="0" y="9" width="2" height="2" fill="rgba(0,0,0,0.07)" rx="1"/>
      <rect x="3" y="12" width="3" height="2" fill="rgba(0,0,0,0.09)" rx="1"/>
      <rect x="7" y="12" width="3" height="2" fill="rgba(0,0,0,0.09)" rx="1"/>
    </svg>`;

    const rabbitDefs = [
      [10, 7,  0,   55, 0.55],
      [40, 6,  12,  68, 0.48],
      [70, 8,  6,   72, 0.60],
      [25, 6,  20,  60, 0.52],
      [60, 7,  30,  80, 0.58],
    ];

    const rstyle = document.createElement('style');
    rstyle.textContent = `
      @keyframes rabbitHop {
        0%,100% { transform: translateY(0) scaleX(1); }
        22%     { transform: translateY(-12px) scaleX(1.05); }
        38%     { transform: translateY(0) scaleX(0.94); }
        55%     { transform: translateY(-7px) scaleX(1.03); }
        70%     { transform: translateY(0) scaleX(0.97); }
      }
      @keyframes rabbitWalk {
        from { left: -40px; }
        to   { left: 110%; }
      }
    `;
    document.head.appendChild(rstyle);

    rabbitDefs.forEach(([startX, bottom, walkDelay, walkDur, hopDur]) => {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: absolute;
        bottom: ${bottom}%;
        left: ${startX}%;
        animation: rabbitWalk ${walkDur}s linear ${walkDelay}s infinite;
        pointer-events: none;
      `;
      const inner = document.createElement('div');
      inner.style.cssText = `
        animation: rabbitHop ${hopDur}s ease-in-out infinite;
      `;
      inner.innerHTML = rabbitSVG;
      wrapper.appendChild(inner);
      doodleLayer.appendChild(wrapper);
    });
  }
}


// INIT

document.addEventListener('DOMContentLoaded', () => {
  new SoulCursor();
  new ScrollReveal().observe();
  new ParallaxEngine();
  new StarField(document.getElementById('stars-layer'));
  new TerrainGenerator(document.querySelector('.terrain-strip'));
  buildHeroParallax();

  buildInventory();
  buildProjectsGrid();

  observeSectionTransitions();
  observeSkills();
  initAboutTypewriter();
  initContactForm();
  spawnDinoScene();

  new StackScroll();
  new ChiptuneAudio();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  initFullscreenBtn();

  const style = document.createElement('style');
  style.textContent = `
    @keyframes shootStar {
      from { transform: rotate(-25deg) translateX(0); opacity: 1; }
      to   { transform: rotate(-25deg) translateX(-200px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);


function initFullscreenBtn() {
  const btn = document.getElementById('fullscreen-btn');
  if (!btn) return;

  const expandIcon   = document.getElementById('fs-expand-icon');
  const compressIcon = document.getElementById('fs-compress-icon');

  function updateIcons() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    btn.classList.toggle('fs-active', isFs);
    if (expandIcon)   expandIcon.style.display   = isFs ? 'none' : '';
    if (compressIcon) compressIcon.style.display = isFs ? ''     : 'none';
  }

  btn.addEventListener('click', () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)
        .call(document.documentElement);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  });

  document.addEventListener('fullscreenchange',       updateIcons);
  document.addEventListener('webkitfullscreenchange', updateIcons);

  document.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    const near = dist < 140;
    btn.classList.toggle('cursor-near', near && dist >= 32);
    if (dist < 60) {
      const dx = (e.clientX - cx) / 60 * 4;
      const dy = (e.clientY - cy) / 60 * 4;
      btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    } else {
      btn.style.transform = '';
    }
  });
}

  console.log('%c★ PORTFOLIO.EXE ★', 'color:#FF0000;font-family:monospace;font-size:18px;font-weight:bold;');
  console.log('%c* It fills you with DETERMINATION.', 'color:#FFD700;font-family:monospace;font-size:12px;');
});

// STACK SCROLL EFFECT

class StackScroll {
  constructor() {
    this.sections = Array.from(document.querySelectorAll('section'));
    if (this.sections.length < 2) return;

    this.navHeight  = 68;
    this.scaleMin   = 0.88;
    this.mobile     = window.matchMedia('(max-width: 960px)').matches;

    if (!this.mobile) this.setupSticky();
    window.addEventListener('scroll', () => this.update(), { passive: true });
    window.addEventListener('resize', () => {
      this.mobile = window.matchMedia('(max-width: 960px)').matches;
    });
    this.update();
  }

  setupSticky() {
    this.sections.forEach(s => {
      s.style.position = 'sticky';
      s.style.top      = `${this.navHeight}px`;
    });
  }

  update() {
    if (this.mobile) return;

    const scrollY = window.scrollY;
    const vh      = window.innerHeight;

    this.sections.forEach((section, i) => {
      const nextSection = this.sections[i + 1];
      if (!nextSection) {
        section.style.transform    = '';
        section.style.borderRadius = '';
        section.style.filter       = '';
        return;
      }

      const nextOffsetTop = this.getOffsetTop(nextSection);
      const rangeStart = nextOffsetTop - vh;
      const rangeEnd   = nextOffsetTop - this.navHeight;

      const raw      = (scrollY - rangeStart) / (rangeEnd - rangeStart);
      const progress = Math.max(0, Math.min(1, raw));

      if (progress > 0) {
        const eased      = this.easeOut(progress);
        const scale      = 1 - (1 - this.scaleMin) * eased;
        const radius     = 20 * eased;
        const brightness = 1 - 0.3 * eased;

        section.style.transform       = `scale(${scale.toFixed(4)})`;
        section.style.transformOrigin = 'top center';
        section.style.borderRadius    = `${radius.toFixed(2)}px`;
        section.style.filter          = `brightness(${brightness.toFixed(3)})`;
        section.style.willChange      = 'transform, filter, border-radius';
        section.style.overflow        = 'hidden';
      } else {
        section.style.transform    = '';
        section.style.borderRadius = '';
        section.style.filter       = '';
        section.style.willChange   = '';
      }
    });
  }

  getOffsetTop(el) {
    let top = 0;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    return top;
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 2.5);
  }
}