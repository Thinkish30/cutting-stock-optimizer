let selectedStocks = [];

function toggleStock(value) {
  const index = selectedStocks.indexOf(value);
  const buttons = document.querySelectorAll("#stock-buttons button");

  if (index === -1) {
    selectedStocks.push(value);
  } else {
    selectedStocks.splice(index, 1);
  }

  // Toggle button appearance
  buttons.forEach(btn => {
    if (parseInt(btn.textContent) === value) {
      btn.classList.toggle("selected");
    }
  });

  document.getElementById("stocks").value = selectedStocks.join(",");
}

function addCutRow() {
  const container = document.getElementById("cut-rows");
  const div = document.createElement("div");
  div.classList.add("cut-row");
  div.innerHTML = `
    <input class="cut-length" placeholder="Length (e.g. 24)" />
    <input class="cut-qty" placeholder="Quantity (e.g. 4)" />
  `;
  container.appendChild(div);
}

function sendData() {
  const stocks = selectedStocks;
  const leftover = document.getElementById('leftover').value;
  const mode = document.getElementById('mode').value;

  // Get all length-quantity pairs
  const lengths = document.querySelectorAll(".cut-length");
  const qtys = document.querySelectorAll(".cut-qty");
  let requirements = [];

  for (let i = 0; i < lengths.length; i++) {
    const len = lengths[i].value.trim();
    const qty = qtys[i].value.trim();
    if (len && qty) {
      requirements.push(`${len}x${qty}`);
    }
  }

  fetch('/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stocks: stocks,
      requirements: requirements.join(','),
      leftoverLimit: leftover,
      mode: mode
    })
  })
  .then(res => res.json())
  .then(data => showOutput(data));
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function showOutput(results) {
  const div = document.getElementById('output');
  div.innerHTML = '<h2>Cutting Plan</h2>';

  results.forEach((res, i) => {
    let cutsHTML = res.cuts.map(cut => {
      const widthPercent = (cut / res.stock) * 100;
      const color = getRandomColor();
      return `<div style="display:inline-block; width:${widthPercent}%; background-color:${color}; height:25px; text-align:center; font-size:12px; color:#fff">${cut}</div>`;
    }).join('');

    const leftoverWidth = (res.leftover / res.stock) * 100;
    const leftoverBar = `<div style="display:inline-block; width:${leftoverWidth}%; background-color:#ccc; height:25px; text-align:center; font-size:12px;">${res.leftover}</div>`;

    div.innerHTML += `
      <div class="stock-block">
        <p><strong>Stock #${i + 1}:</strong> ${res.stock}" | Leftover: ${res.leftover}" ${res.reusable ? '(Reusable)' : '(Waste)'}</p>
        <div class="cut-bar">${cutsHTML}${leftoverBar}</div>
      </div><br>`;
  });
}
