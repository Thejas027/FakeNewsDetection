# 🕵️ Fake News Detective

A full-stack AI-powered fake news detection system built with React, Node.js, and Python Flask.

## 🚀 Project Structure

```
FakeNewsDetection/
├── client/          # React frontend (Port 3002)
├── server/          # Express.js backend (Port 5000)  
└── services/        # Python Flask ML service (Port 8000)
```

## ✨ Features

- **Modern React Frontend** with custom CSS styling
- **Beautiful UI** with gradient backgrounds and smooth animations
- **Real-time Analysis** with loading states and error handling
- **Express.js API Server** acting as middleware
- **Advanced ML Service** with scikit-learn and NLTK
- **Mock AI Model** for demonstration (ready for real model deployment)
- **Responsive Design** that works on all devices
- **Production Ready** with environment configurations

## 🛠️ Technologies Used

### Frontend (React)
- React 19.1.0 with JavaScript
- Custom CSS (no external CSS frameworks)
- Axios for API calls
- Responsive design with modern UI

### Backend (Express.js)
- Express.js with CORS support
- Environment variable configuration
- Proxy to ML service
- Error handling and logging

### ML Service (Python Flask)
- Flask 3.0.0 with CORS enabled
- scikit-learn 1.4.2 for machine learning
- NLTK for text preprocessing
- TF-IDF vectorization
- Logistic Regression model
- Text preprocessing pipeline
- **Production-ready** with Python 3.11+ compatibility

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

### 1. Start the Express Server
```bash
cd server
npm install
npm start
# Server runs on http://localhost:5000
```

### 2. Start the React Client
```bash
cd client
npm install
npm start
# Client runs on http://localhost:3002
```

### 3. Start the ML Service (Optional - for local testing)
```bash
cd services
pip install -r requirements.txt
python app.py
# ML service runs on http://localhost:8000
```

## 🌐 Live Application

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5000/api
- **ML Service**: http://localhost:8000

## 📊 Current Status

✅ **Working Components:**
- React frontend with custom CSS ✨
- Express.js backend server ✨
- Python Flask ML service ✨
- API integration between all services ✨
- Mock ML model for demonstration ✨
- Responsive design ✨
- Error handling ✨

---

**Built with ❤️ for a more informed world**
└── services/        # Python Flask ML service
```

## 🚀 Features

- **Modern React Frontend** with Tailwind CSS styling
- **Express.js API Backend** for handling requests
- **Python ML Service** with scikit-learn for predictions
- **Real-time Analysis** of news content
- **Beautiful UI/UX** with responsive design
- **Mock ML Model** for development (easily replaceable with real model)
- **Ready for Render Deployment** (ML service)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python 3.9+
- pip

## 🛠️ Local Development Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd FakeNewsDetection
```

### 2. Setup Client (React Frontend)
```bash
cd client
npm install
npm start
```
The React app will run on `http://localhost:3000`

### 3. Setup Server (Express Backend)
```bash
cd server
npm install
npm run dev
```
The API server will run on `http://localhost:5000`

### 4. Setup ML Service (Python Flask)
```bash
cd services
pip install -r requirements.txt
python app.py
```
The ML service will run on `http://localhost:8000`

## 🌐 API Endpoints

### Express Server (Port 5000)
- `GET /` - API information
- `GET /api/health` - Health check
- `POST /api/predict` - Fake news prediction

### ML Service (Port 8000)
- `GET /` - Service information
- `GET /health` - Health check
- `POST /predict` - ML model prediction

## 📱 Usage

1. **Start all services** (client, server, ML service)
2. **Open browser** to `http://localhost:3000`
3. **Enter news text** in the textarea
4. **Click "Analyze News"** to get prediction
5. **View results** with confidence score

## 🚀 Deployment

### Deploy ML Service to Render

1. **Create a new Web Service** on [Render](https://render.com)
2. **Connect your repository**
3. **Set build/deploy settings:**
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Root Directory:** `services`

4. **Deploy and get your service URL**

### Update Server Configuration

1. **Edit `server/.env`:**
```env
ML_SERVICE_URL=https://your-render-service.onrender.com
```

2. **Deploy server and client** to your preferred hosting platform

## 🔧 Configuration

### Environment Variables

**Server (.env):**
```env
NODE_ENV=development
PORT=5000
ML_SERVICE_URL=http://localhost:8000
```

**Client:**
- Tailwind CSS configuration in `tailwind.config.js`
- API URL configured in components

## 🎨 Frontend Features

- **Responsive Design** - Works on all devices
- **Beautiful UI** - Modern gradient design with Tailwind CSS
- **Real-time Analysis** - Instant feedback
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during processing
- **Character Counter** - Text validation
- **Results Display** - Clear visualization of predictions

## 🔍 ML Model

The current implementation includes a **mock ML model** for development:

- **Algorithm:** Logistic Regression with TF-IDF
- **Features:** Text preprocessing, stopword removal, n-grams
- **Training:** Sample data for demonstration
- **Accuracy:** Mock model for testing purposes

### Replacing with Real Model

To use a real trained model:

1. **Train your model** with real fake news dataset
2. **Save the model** using `joblib.dump()`
3. **Replace the mock model** in `services/app.py`
4. **Update preprocessing** if needed

## 🛡️ Security Features

- **Input validation** on all endpoints
- **CORS configuration** for secure cross-origin requests
- **Error handling** without exposing sensitive information
- **Text preprocessing** to handle malicious input

## 📊 Model Performance

Current mock model includes:
- **Text preprocessing** with NLTK
- **TF-IDF vectorization** with n-grams
- **Logistic regression** classification
- **Confidence scoring** for predictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🔮 Future Enhancements

- [ ] Real ML model with large dataset
- [ ] User authentication
- [ ] Historical analysis
- [ ] Batch processing
- [ ] Advanced NLP features
- [ ] Social media integration
- [ ] API rate limiting
- [ ] Caching layer

## 🆘 Troubleshooting

### Common Issues

1. **CORS errors**: Check server CORS configuration
2. **ML service not responding**: Verify Python dependencies
3. **Build errors**: Check Node.js and npm versions
4. **Tailwind not working**: Verify PostCSS configuration

### Debug Mode

Enable debug mode by setting:
```env
NODE_ENV=development
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository

---

**Built with ❤️ for a more informed world**
