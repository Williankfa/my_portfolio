'use strict';
  let currentLang = 'en';
  const LANG_DATA = {
    en: { SKILLS: ['HTML & CSS','JavaScript','Python','Git','VS Code','Algorithms','Data Structures','Clean Code','Agile','Scrum'],
          EXPS:   ['Frontend','Logic','Version Ctrl','Problem Solving','Clean Code','Agile'] },
    pt: { SKILLS: ['HTML e CSS','JavaScript','Python','Git','VS Code','Algoritmos','Estrut. Dados','Clean Code','Ágil','Scrum'],
          EXPS:   ['Front-end','Lógica','Controle Vers.','Resolução Prob.','Clean Code','Ágil'] }
  };
  window.setLang = function(lang) {
    currentLang = lang;
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-pt').classList.toggle('active', lang === 'pt');
    document.querySelectorAll('[data-en]').forEach(el => {
      const txt = el.getAttribute(`data-${lang}`);
      if (!txt) return;
      if (el.classList.contains('hero-subtitle')) { el.innerHTML = txt.replace(/_$/, '') + '<span class="blink">_</span>'; return; }
      if (el.classList.contains('submit-btn')) { el.innerHTML = txt + ' <span class="soul-mini">♥</span>'; return; }
      if (el.tagName === 'H2' && el.closest('.contact-left')) {
        const words = txt.split(' '); const mid = Math.ceil(words.length / 3);
        el.innerHTML = words.slice(0, mid).join(' ') + '<br/>' + words.slice(mid, mid*2).join(' ') + '<br/>' + words.slice(mid*2).join(' ');
        return;
      }
      if (el.tagName === 'H2' && el.closest('#about')) {
        const words = txt.split(' ');
        el.innerHTML = words.slice(0,1).join(' ') + '<br/>' + words.slice(1,3).join(' ') + '<br/>' + words.slice(3).join(' ');
        return;
      }
      el.textContent = txt;
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
      el.placeholder = el.getAttribute(`data-${lang}-placeholder`) || el.placeholder;
    });
    const dialogueEl = document.getElementById('dialogue-text-content');
    if (dialogueEl) {
      const newText = dialogueEl.getAttribute(`data-${lang}`);
      if (newText && window.Typewriter) {
        dialogueEl.dataset.text = newText; dialogueEl.textContent = '';
        if (window._currentDialogueTw) window._currentDialogueTw.stop();
        const tw = new window.Typewriter(dialogueEl, newText, 28);
        window._currentDialogueTw = tw; tw.start();
      }
    }
    const invNames = document.querySelectorAll('.inv-name');
    const langSkills = LANG_DATA[lang].SKILLS;
    invNames.forEach((el, i) => { if (langSkills[i]) el.textContent = langSkills[i]; });
    const expLabels = document.querySelectorAll('.exp-bar-label > span:first-child');
    const langExps = LANG_DATA[lang].EXPS;
    expLabels.forEach((el, i) => { if (langExps[i]) el.textContent = langExps[i]; });
  };