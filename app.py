from flask import Flask, render_template, jsonify, request
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name', '')
    message = data.get('message', '')
    # In production, integrate with email service here
    print(f"[CONTACT] {name}: {message}")
    return jsonify({
        'status': 'ok',
        'message': f'* {name} sent a message! DETERMINATION increases.'
    })

@app.route('/api/status')
def status():
    return jsonify({
        'status': 'DETERMINED',
        'hp': 9999,
        'lv': 'LOVE',
        'message': 'It fills you with determination.'
    })

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(debug=debug_mode, port=5000, host='0.0.0.0')
