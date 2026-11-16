const probability = document.querySelector('#prob');
const impact = document.querySelector('#impact');
const result = document.querySelector('#result');
const grid = document.querySelector('#matrix-body');
const cells = new Map();

function level(score) {
  if (score <= 4) return { name: 'Bajo', style: 'low' };
  if (score <= 9) return { name: 'Moderado', style: 'moderate' };
  if (score <= 16) return { name: 'Alto', style: 'high' };
  return { name: 'Crítico', style: 'critical' };
}

function choose(probabilityValue, impactValue) {
  probability.value = probabilityValue;
  impact.value = impactValue;
  updateMatrix();
}

function updateMatrix() {
  const p = Number(probability.value);
  const i = Number(impact.value);
  const score = p * i;
  const risk = level(score);

  for (const [key, button] of cells) {
    button.setAttribute('aria-pressed', String(key === `${p}-${i}`));
  }

  const headline = document.createElement('strong');
  headline.textContent = `${score}/25 · ${risk.name}`;
  const formula = document.createElement('span');
  formula.textContent = `Probabilidad ${p} × impacto ${i}`;
  result.className = `result ${risk.style}`;
  result.replaceChildren(headline, formula);
}

for (let p = 5; p >= 1; p -= 1) {
  const row = grid.insertRow();
  const header = document.createElement('th');
  header.scope = 'row';
  header.textContent = p;
  row.append(header);

  for (let i = 1; i <= 5; i += 1) {
    const score = p * i;
    const risk = level(score);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = score;
    button.className = risk.style;
    button.setAttribute('aria-label', `Probabilidad ${p}, impacto ${i}, resultado ${score}, ${risk.name}`);
    button.addEventListener('click', () => choose(p, i));
    row.insertCell().append(button);
    cells.set(`${p}-${i}`, button);
  }
}

probability.addEventListener('change', updateMatrix);
impact.addEventListener('change', updateMatrix);
document.querySelector('[data-scenario="initial"]').addEventListener('click', () => choose(4, 4));
document.querySelector('[data-scenario="residual"]').addEventListener('click', () => choose(2, 3));
updateMatrix();

