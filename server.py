"""Servidor opcional de EducSex y puente seguro para Google Gemini."""
import os
from flask import Flask, jsonify, request, send_from_directory
from dotenv import load_dotenv
import requests

load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=None)

@app.get('/')
def home():
    return send_from_directory(BASE_DIR, 'index.html')

@app.get('/<path:path>')
def static_files(path):
    # No exponer archivos de configuración ni el propio servidor.
    if path.startswith('.') or path in {'server.py', 'requirements.txt'} or path.startswith('__pycache__/'):
        return ('No encontrado', 404)
    return send_from_directory(BASE_DIR, path)

@app.post('/api/chat')
def chat():
    payload = request.get_json(silent=True) or {}
    message = str(payload.get('message', '')).strip()
    if not message:
        return jsonify(error='Escribe una pregunta.'), 400
    if len(message) > 1200:
        return jsonify(error='La pregunta es demasiado larga.'), 400

    api_key = os.getenv('GEMINI_API_KEY', '').strip()
    if not api_key:
        return jsonify(error='Gemini no está configurado. Añade GEMINI_API_KEY al archivo .env.'), 503

    history = payload.get('history', [])
    contents = []
    if isinstance(history, list):
        for item in history[-8:]:
            if not isinstance(item, dict):
                continue
            role = 'model' if item.get('role') == 'assistant' else 'user'
            content = str(item.get('content', '')).strip()[:1200]
            if content and role in ('user', 'model'):
                contents.append({'role': role, 'parts': [{'text': content}]})
    contents.append({'role': 'user', 'parts': [{'text': message}]})

    model = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash').strip()
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
    prompt = (
        'Eres CecyAyudando, un asistente educativo de salud sexual y reproductiva para jóvenes de México. '
        'Tu prioridad es RESPONDER LA PREGUNTA EXACTA del usuario en la primera frase; nunca contestes con una lista genérica de temas si preguntó algo concreto. '
        'Responde en español mexicano claro, cálido, inclusivo, sin juzgar, con encabezados y viñetas cuando ayuden. '
        'Si preguntan por métodos anticonceptivos, compara métodos específicos (condón, implante, DIU de cobre y hormonal, pastillas, inyección, parche/anillo y anticoncepción de emergencia), explica cómo funcionan, eficacia relativa en uso habitual cuando sea fiable, duración o rutina, efectos secundarios frecuentes y si protegen contra ITS. Aclara que solo el condón reduce también el riesgo de muchas ITS y que puede combinarse con otro método. '
        'Si preguntan por un método específico, dedica la respuesta a ese método, no cambies de tema. Si preguntan qué hacer tras sexo sin protección o fallo del condón, explica con urgencia calmada que deben consultar cuanto antes sobre anticoncepción de emergencia; algunas opciones pueden usarse hasta 5 días y dependen de la opción. No hagas afirmaciones absolutas si varían por producto. '
        'Estructura las respuestas de forma útil: respuesta directa, cómo funciona/qué opciones hay, puntos importantes y siguiente paso. Ajusta la longitud a la pregunta; para una comparación amplia, sé detallado. '
        'Usa información médica general ampliamente aceptada; no inventes cifras, estudios, clínicas, direcciones, teléfonos ni fuentes. Si no sabes algo, dilo. No diagnostiques ni prescribas; recomienda personal sanitario para elegir un método según antecedentes y medicamentos. '
        'Para síntomas graves, exposición urgente, violencia, coerción o peligro inmediato, recomienda atención médica o servicios de emergencia. No pidas datos identificables, no prometas confidencialidad absoluta y recuerda que el mensaje se procesa mediante el servicio de IA. '
        'No uses lenguaje moralista, no asumas género, orientación sexual, actividad sexual ni edad exacta. Distingue claramente información general de consejo médico personalizado.'
    )
    try:
        result = requests.post(
            url,
            params={'key': api_key},
            json={'system_instruction': {'parts': [{'text': prompt}]}, 'contents': contents,
                   'generationConfig': {'temperature': 0.65, 'maxOutputTokens': 700}},
            timeout=35,
        )
        if result.status_code >= 400:
            app.logger.warning('Gemini respondió con estado %s', result.status_code)
            return jsonify(error='Gemini no pudo responder en este momento. Inténtalo más tarde.'), 502
        data = result.json()
        candidates = data.get('candidates') or []
        parts = candidates[0].get('content', {}).get('parts', []) if candidates else []
        reply = ''.join(part.get('text', '') for part in parts if isinstance(part, dict))
        if not reply.strip():
            app.logger.warning('Gemini no devolvió texto. finishReason=%s', candidates[0].get('finishReason') if candidates else 'sin candidatos')
            return jsonify(error='La IA no pudo generar una respuesta para esa pregunta. Reformúlala o inténtalo de nuevo.'), 502
        return jsonify(reply=reply.strip())
    except requests.RequestException:
        app.logger.exception('Error conectando con Gemini')
        return jsonify(error='No se pudo conectar con Gemini. Revisa tu conexión e inténtalo de nuevo.'), 502

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int(os.getenv('PORT', '5000')), debug=False)
