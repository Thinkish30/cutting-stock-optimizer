function sendData() {
  const stocks = document.getElementById('stocks').value;
  const requirements = document.getElementById('requirements').value;
  const leftover = document.getElementById('leftover').value;
  const mode = document.getElementById('mode').value;

  fetch('/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stocks: stocks.split(','),
      requirements: requirements,
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
