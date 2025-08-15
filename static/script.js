let selectedStocks = [];

function toggleStock(value) {
  const index = selectedStocks.indexOf(value);
  const buttons = document.querySelectorAll("#stock-buttons button");

  if (index === -1) {
    selectedStocks.push(value);
  } else {
    selectedStocks.splice(index, 1);
  }

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
    <input class="cut-length" type="number" placeholder="Length (e.g. 24)" step="0.01"/>
    <input class="cut-qty" type="number" placeholder="Quantity (e.g. 4)" />
  `;
  container.appendChild(div);
}

function sendData() {
  const stocks = selectedStocks;

  const lengths = document.querySelectorAll(".cut-length");
  const qtys = document.querySelectorAll(".cut-qty");
  let requirements = [];

  for (let i = 0; i < lengths.length; i++) {
    const len = lengths[i].value.trim();
    const qty = qtys[i].value.trim();
    if (len && qty) {
      requirements.push(`${parseFloat(len)}x${parseInt(qty)}`);
    }
  }

  if (stocks.length === 0 || requirements.length === 0) {
    alert("Please select stocks and add cut sizes.");
    return;
  }

  fetch('/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stocks: stocks,
      requirements: requirements.join(',')
    })
  })
  .then(res => res.json())
  .then(data => showOutput(data))
  .catch(err => {
    console.error("Error:", err);
    alert("Something went wrong.");
  });
}

// Consistent color per size
const colorMap = {};
function getColorForSize(size) {
  if (colorMap[size]) return colorMap[size];
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  colorMap[size] = color;
  return color;
}

function showOutput(results) {
  const div = document.getElementById('output');
  div.innerHTML = '<h2>Cutting Plan</h2>';

  results.forEach((res, i) => {
    const cutsHTML = res.cuts.map(cut => {
      const widthPercent = (cut / res.stock) * 100;
      const color = getColorForSize(cut);
      return `<div class="cut-segment" style="width:${widthPercent}%; background-color:${color};">
                <span>${cut}in</span>
              </div>`;
    }).join('');

    const leftoverWidth = (res.leftover / res.stock) * 100;
    const leftoverBar = `<div class="cut-segment leftover" style="width:${leftoverWidth}%;">
                          <span>${res.leftover}in</span>
                         </div>`;

    div.innerHTML += `
      <div class="stock-block">
        <p><strong>Stock #${i + 1}:</strong> ${res.stock}" | Leftover: ${res.leftover}"</p>
        <div class="cut-bar">${cutsHTML}${leftoverBar}</div>
      </div><br>`;
  });
}
