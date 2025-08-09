Cutting Stock Optimizer (1D)
A simple web-based tool to optimize cutting plans for one-dimensional stock materials like aluminum pipes, wooden rods, or steel bars.
It helps minimize waste by finding the best way to cut stock lengths into required pieces using a Dynamic Programming approach.

🚀 Features
Select available stock lengths (in inches)

Enter required cut lengths and quantities

Generates an optimized cutting plan

Color-coded visual representation of cuts

Works on both desktop and mobile

🖥️ Tech Stack
Backend: Python (Flask)

Frontend: HTML, CSS, JavaScript

Algorithm: Dynamic Programming

⚙️ Installation & Running Locally
Clone the repository

bash
Copy
Edit
git clone https://github.com/YourUsername/cutting-stock-optimizer.git
cd cutting-stock-optimizer
Install dependencies

nginx
Copy
Edit
pip install -r requirements.txt
Run the app

nginx
Copy
Edit
python app.py
Open your browser and go to:

cpp
Copy
Edit
http://127.0.0.1:5000
🌍 Deployment (Render)
You can deploy this app to Render or any Python-compatible hosting platform.

Push your code to GitHub

Make sure you have a requirements.txt file:

nginx
Copy
Edit
flask
Create a Procfile in the root folder:

makefile
Copy
Edit
web: python app.py
On Render:

Create New → Web Service

Connect your GitHub repo

Environment: Python

Build Command: pip install -r requirements.txt

Start Command: python app.py

Deploy 🚀

📜 License
This project is open-source under the MIT License.

💡 Author
Developed by Vinod Choudhary
