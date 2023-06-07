import requests

# URL API Flask Anda
api_url = 'http://localhost:5000/'

# Contoh data input
input_data = {
    "feature": "contoh bahan"
}

# Fungsi untuk melakukan prediksi
def predict(feature):
    # Implementasi prediksi yang sesuai dengan model Anda
    prediction_allergies = "Prediksi alergi"
    prediction_diseases = "Prediksi penyakit"
    prediction_halal = "Prediksi halal"

    return prediction_allergies, prediction_diseases, prediction_halal

# Kirim permintaan POST ke API
response = requests.post(api_url, json=input_data)

# Periksa respons
if response.status_code == 200:
    data = response.json()

    # Memprediksi menggunakan model
    prediction_allergies, prediction_diseases, prediction_halal = predict(data['feature'])

    # Menyusun respons prediksi
    response_data = {
        "prediction_allergies": prediction_allergies,
        "prediction_diseases": prediction_diseases,
        "prediction_halal": prediction_halal
    }

    print(response_data)
else:
    print("Error:", response.text)
