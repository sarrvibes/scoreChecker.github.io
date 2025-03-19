import os
import json
from flask import Flask, render_template, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")

# Load student data
def load_student_data():
    try:
        with open('data/scores.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Initialize with some sample data if file doesn't exist
        sample_data = {
            "1234567": {"name": "John Doe", "score": 95},
            "7654321": {"name": "Jane Smith", "score": 88},
            "1111111": {"name": "Alice Johnson", "score": 92}
        }
        os.makedirs('data', exist_ok=True)
        with open('data/scores.json', 'w') as f:
            json.dump(sample_data, f)
        return sample_data

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check_score', methods=['POST'])
def check_score():
    npm = request.form.get('npm', '').strip()
    name = request.form.get('name', '').strip().lower()
    
    if not npm or not name:
        return jsonify({
            'success': False,
            'message': 'Please fill in all fields'
        })

    students = load_student_data()
    
    if npm in students:
        student = students[npm]
        if student['name'].lower() == name:
            return jsonify({
                'success': True,
                'name': student['name'],
                'score': student['score']
            })
    
    return jsonify({
        'success': False,
        'message': 'Student not found or information incorrect'
    })