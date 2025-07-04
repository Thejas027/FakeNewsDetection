from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import nltk
import re
import string
import joblib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Global variables for model and preprocessing
model_pipeline = None
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    """
    Preprocess text for fake news detection
    """
    if not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove user mentions and hashtags
    text = re.sub(r'@\w+|#\w+', '', text)
    
    # Remove punctuation and digits
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d+', '', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords and short words
    tokens = [word for word in tokens if word not in stop_words and len(word) > 2]
    
    return ' '.join(tokens)

def create_mock_model():
    """
    Create a mock model for demonstration purposes
    In production, this would load a real trained model
    """
    # Create sample training data
    sample_texts = [
        "The president announced new policies today in a formal statement",
        "Scientists have discovered a new treatment for the disease",
        "Breaking: Shocking revelation that will change everything forever",
        "You won't believe what happened next - doctors hate this trick",
        "Local weather services report heavy rainfall expected this weekend",
        "Urgent: Celebrity scandal rocks the entertainment industry",
        "Research shows promising results in clinical trials",
        "Unbelievable: This one weird trick will make you rich overnight"
    ]
    
    # Labels: 0 = FAKE, 1 = REAL
    sample_labels = [1, 1, 0, 0, 1, 0, 1, 0]
    
    # Preprocess the sample texts
    processed_texts = [preprocess_text(text) for text in sample_texts]
    
    # Create pipeline with TF-IDF and Logistic Regression
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
        ('classifier', LogisticRegression(random_state=42))
    ])
    
    # Train the pipeline
    pipeline.fit(processed_texts, sample_labels)
    
    return pipeline

def load_or_create_model():
    """
    Load existing model or create a new one
    """
    model_path = 'fake_news_model.joblib'
    
    if os.path.exists(model_path):
        try:
            return joblib.load(model_path)
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Creating new mock model...")
    
    # Create and save mock model
    model = create_mock_model()
    try:
        joblib.dump(model, model_path)
        print("Mock model created and saved")
    except Exception as e:
        print(f"Error saving model: {e}")
    
    return model

# Initialize model
print("Loading ML model...")
model_pipeline = load_or_create_model()
print("Model loaded successfully!")

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Fake News Detection ML Service',
        'status': 'running',
        'model': 'Mock Logistic Regression Pipeline',
        'version': '1.0.0',
        'endpoints': {
            'predict': '/predict (POST)',
            'health': '/health (GET)'
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': model_pipeline is not None,
        'service': 'ML Prediction Service'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'error': 'Missing text field',
                'message': 'Please provide text to analyze'
            }), 400
        
        text = data['text']
        
        # Validate input
        if not text or not text.strip():
            return jsonify({
                'error': 'Empty text',
                'message': 'Text cannot be empty'
            }), 400
        
        if len(text.strip()) < 10:
            return jsonify({
                'error': 'Text too short',
                'message': 'Text must be at least 10 characters long'
            }), 400
        
        # Preprocess text
        processed_text = preprocess_text(text)
        
        if not processed_text:
            return jsonify({
                'error': 'Invalid text',
                'message': 'Text contains no meaningful content after preprocessing'
            }), 400
        
        # Make prediction
        if model_pipeline is None:
            raise Exception("Model not loaded")
        
        prediction = model_pipeline.predict([processed_text])[0]
        probability = model_pipeline.predict_proba([processed_text])[0]
        
        # Get confidence score
        confidence = max(probability) * 100
        
        # Prepare result
        result = {
            'prediction': 'REAL' if prediction == 1 else 'FAKE',
            'confidence': round(confidence, 2),
            'probabilities': {
                'fake': round(probability[0] * 100, 2),
                'real': round(probability[1] * 100, 2)
            },
            'timestamp': datetime.now().isoformat(),
            'text_length': len(text),
            'processed_length': len(processed_text),
            'model': 'Logistic Regression with TF-IDF'
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e) if app.debug else 'Internal server error'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'message': 'The requested endpoint does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': 'Something went wrong on our end'
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
