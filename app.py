from flask import Flask, render_template, request, jsonify
from backend.llm import llm_prompt

app = Flask(__name__, template_folder='frontend/templates', static_folder='frontend/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    user_prompt = data.get('prompt', '')
    if not user_prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    response = llm_prompt(user_prompt)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
