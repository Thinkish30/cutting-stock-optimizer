from flask import Flask, render_template, request, jsonify
import itertools

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/optimize', methods=['POST'])
def optimize():
    data = request.get_json()
    stock_lengths = sorted(map(float, data['stocks']))  # float for decimal support
    requirements_raw = data['requirements']

    # Expand requirements like 24.5x4 to [24.5, 24.5, 24.5, 24.5]
    requirements = []
    for req in requirements_raw.split(','):
        length, qty = req.lower().split('x')
        requirements += [float(length)] * int(qty)

    requirements.sort(reverse=True)
    results = []

    # DP Optimized Mode Only
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
                    if abs(best_waste) < 1e-9:  # near zero waste
                        break
                if abs(best_waste) < 1e-9:
                    break

        if best_combo:
            for cut in best_combo:
                requirements.remove(cut)

            results.append({
                'stock': round(best_stock, 2),
                'cuts': [round(c, 2) for c in best_combo],
                'leftover': round(best_stock - best_total, 2)
            })
        else:
            break

    return jsonify(results)

if __name__ == '__main__':
    print("🚀 Flask server running...")
    app.run(debug=True, host="0.0.0.0")
