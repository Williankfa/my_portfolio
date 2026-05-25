from flask import Flask, render_template, jsonify, request
import os
import resend

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/contact', methods=['POST'])
def contact():
    data    = request.get_json()
    name    = data.get('name', '').strip()
    message = data.get('message', '').strip()

    if not name or not message:
        return jsonify({'status': 'error', 'message': '* Preencha todos os campos!'}), 400

    api_key = os.environ.get('RESEND_API_KEY')

    if api_key:
        try:
            resend.api_key = api_key
            resend.Emails.send({
                "from":    "Portfolio <onboarding@resend.dev>",
                "to":      ["williankfa@gmail.com"],
                "subject": f"[Portfolio] Nova mensagem de {name}",
                "text":    f"Nome: {name}\n\nMensagem:\n{message}"
            })
        except Exception as e:
            print(f'[EMAIL ERROR] {e}')
            return jsonify({'status': 'error', 'message': '* Erro ao enviar. Tente pelo WhatsApp!'}), 500

    print(f'[CONTACT] {name}: {message}')
    return jsonify({
        'status': 'ok',
        'message': f'* Mensagem recebida, {name}! Em breve responderei.'
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
    app.run()