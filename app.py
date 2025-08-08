from flask import Flask, render_template, request, jsonify
import itertools

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/optimize', methods=['POST'])
def optimize():
    data = request.get_json()
    stock_lengths = sorted(map(int, data['stocks']))
    requirements_raw = data['requirements']

    # Expand requirements like 24x4 to [24, 24, 24, 24]
    requirements = []
    for req in requirements_raw.split(','):
        length, qty = req.lower().split('x')
        requirements += [int(length)] * int(qty)

    requirements.sort(reverse=True)
    results = []

    while requirements:
        best_combo = []
        best_total = 0
        best_stock = None
        best_waste = float('inf')

        for stock in stock_lengths:
            for r in range(1, len(requirements) + 1):
                for combo in itertools.combinations(requirements, r):
                    total = sum(combo)
                    if total <= stock and (stock - total) < best_waste:
                        best_combo = combo
                        best_total = total
                        best_stock = stock
                        best_waste = stock - total
                    if best_waste == 0:
                        break
                if best_waste == 0:
                    break

        if best_combo:
            for cut in best_combo:
                requirements.remove(cut)

            results.append({
                'stock': best_stock,
                'cuts': list(best_combo),
                'leftover': best_stock - best_total
            })
        else:
            break

    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
