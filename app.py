from flask import Flask, render_template, request, jsonify
from itertools import combinations

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/optimize', methods=['POST'])
def optimize():
    data = request.get_json()
    stocks = sorted(map(int, data['stocks']))
    requirements_raw = data['requirements']
    leftover_limit = int(data['leftoverLimit'])

    requirements = []
    for req in requirements_raw.split(','):
        length, qty = req.lower().split('x')
        for _ in range(int(qty)):
            requirements.append(int(length))

    results = []

    while requirements:
        best_fit = []
        best_total = 0

        for r in range(1, len(requirements) + 1):
            for combo in combinations(requirements, r):
                total = sum(combo)
                for stock in stocks:
                    if total <= stock and total > best_total:
                        best_fit = combo
                        best_total = total

        if not best_fit:
            break

        for cut in best_fit:
            requirements.remove(cut)

        chosen_stock = next((s for s in stocks if s >= best_total), max(stocks))
        leftover = chosen_stock - best_total

        results.append({
            'stock': chosen_stock,
            'cuts': list(best_fit),
            'leftover': leftover,
            'reusable': leftover >= leftover_limit
        })

    return jsonify(results)

if __name__ == '__main__':
    print("Starting Flask App...")
    app.run(debug=True)
