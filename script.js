/* ====== CONFIGURE AQUI ====== */
var GITHUB_USER = "gabrielmota792";   // seu usuário do GitHub
var WIP_TOPIC = "em-andamento";    // topic que marca "em desenvolvimento"
/* ============================ */

/* ---------- Ilustrações dos cartões (desenhos em SVG) ---------- */
var S = '<svg viewBox="0 0 100 90" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
var BASE = '<path d="M6 72h88l-8 10H14z" stroke="#8b4dff" stroke-width="2" fill="rgba(139,77,255,.15)"/>';

var ART = {
  // gráfico crescendo
  chart: S + '<rect x="14" y="8" width="72" height="56" rx="6" stroke="#8b4dff" stroke-width="2" fill="rgba(139,77,255,.10)"/>'
    + '<rect x="26" y="40" width="9" height="16" rx="2" fill="#8b4dff"/><rect x="44" y="30" width="9" height="26" rx="2" fill="#a878ff"/><rect x="62" y="20" width="9" height="36" rx="2" fill="#c4a0ff"/>'
    + '<polyline points="22,36 40,24 52,28 74,12" stroke="#c4a0ff" stroke-width="3"/><polyline points="66,12 74,12 74,20" stroke="#c4a0ff" stroke-width="3"/>' + BASE + '</svg>',
  // notebook com código
  laptop: S + '<rect x="14" y="8" width="72" height="56" rx="6" stroke="#8b4dff" stroke-width="2" fill="rgba(139,77,255,.10)"/>'
    + '<path d="M24 22h22M30 32h32M30 42h18M24 52h26" stroke="#c4a0ff" stroke-width="3"/><path d="M52 22h14M54 42h16" stroke="#6fe3d4" stroke-width="3"/>' + BASE + '</svg>',
  // pessoas (usuários)
  users: S + '<circle cx="50" cy="26" r="11" stroke="#c4a0ff" stroke-width="5"/><path d="M30 64c0-12 9-19 20-19s20 7 20 19" stroke="#c4a0ff" stroke-width="5"/>'
    + '<circle cx="22" cy="36" r="8" stroke="#8b4dff" stroke-width="4"/><path d="M6 64c0-9 6-14 14-14" stroke="#8b4dff" stroke-width="4"/>'
    + '<circle cx="78" cy="36" r="8" stroke="#8b4dff" stroke-width="4"/><path d="M94 64c0-9-6-14-14-14" stroke="#8b4dff" stroke-width="4"/></svg>',
  // símbolo de código
  code: S + '<polyline points="34,24 12,45 34,66" stroke="#c4a0ff" stroke-width="7"/><polyline points="66,24 88,45 66,66" stroke="#c4a0ff" stroke-width="7"/><line x1="56" y1="14" x2="44" y2="76" stroke="#8b4dff" stroke-width="7"/></svg>'
};
var ART_KEYS = ["laptop", "chart", "users", "code"];

// Escolhe a ilustração: pelo campo "art" ou por palavras do nome do projeto
function pickArt(r, i) {
  var n = (r.name || "").toLowerCase();
  if (r.art) return r.art;
  if (/financ|dinheiro|gasto|dash/.test(n)) return "chart";
  if (/api|user|usuar|login|auth/.test(n)) return "users";
  if (/tarefa|task|todo|sistema/.test(n)) return "laptop";
  return ART_KEYS[i % ART_KEYS.length];
}

/* ---------- Projetos de exemplo (aparecem até o GitHub carregar) ---------- */
var repos = [
  {name:"App Finanças", description:"Aplicação de gestão de finanças pessoais, com foco em organização e controle financeiro.", html_url:"#", wip:true, art:"chart"},
  {name:"Sistema de Tarefas", description:"Sistema web para gerenciamento de tarefas, com autenticação e banco de dados.", html_url:"#", wip:false, art:"laptop"},
  {name:"API de Usuários", description:"API RESTful para gerenciamento de usuários, com operações completas (CRUD).", html_url:"#", wip:false, art:"users"}
];

var grid = document.getElementById("grid"), note = document.getElementById("note");
var ghUrl = "https://github.com/" + GITHUB_USER;
document.getElementById("all").href = ghUrl;
document.getElementById("gh").href = ghUrl;

function esc(s) { var d = document.createElement("div"); d.textContent = s || ""; return d.innerHTML; }

/* ---------- Desenha os cartões ---------- */
function render() {
  grid.innerHTML = repos.slice(0, 6).map(function (r, i) {
    return '<a class="proj" href="' + esc(r.html_url) + '" target="_blank" rel="noopener">'
      + '<div class="pi">' + ART[pickArt(r, i)] + '</div>'
      + '<div class="info"><h3>' + esc(r.name) + '</h3>'
      + '<span class="st' + (r.wip ? ' w' : '') + '">' + (r.wip ? 'Em desenvolvimento' : 'Concluído') + '</span>'
      + '<p>' + esc(r.description || "Sem descrição ainda.") + '</p>'
      + '<em>Saiba mais →</em></div></a>';
  }).join("");
}
render();

/* ---------- Busca os repositórios reais no GitHub ---------- */
if (GITHUB_USER !== "SEU-USUARIO") {
  fetch("https://api.github.com/users/" + GITHUB_USER + "/repos?sort=updated&per_page=30")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!Array.isArray(data)) return;
      var real = data.filter(function (r) { return !r.fork; }).map(function (r) {
        r.wip = (r.topics || []).indexOf(WIP_TOPIC) > -1;
        return r;
      });
      if (real.length) { repos = real; note.textContent = ""; render(); }
    })
    .catch(function () {});
}
