import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

const TextInputScreen = () => {
  const [text, setText] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getImageSource = (condition) => {
    switch (condition) {
      case 'clear_day':
        return require('./assets/images/clear_day.png');
      case 'rain':
        return require('./assets/images/rain.png');
      case 'clear_night':
        return require('./assets/images/clear_night.png');
      case 'cloud':
        return require('./assets/images/cloud.png');
      case 'cloudly_day':
        return require('./assets/images/cloudly_day.png');
      case 'cloudly_night':
        return require('./assets/images/cloudly_night.png');
      case 'fog':
        return require('./assets/images/fog.png');
      case 'hail':
        return require('./assets/images/hail.png');
      case 'none_day':
        return require('./assets/images/none_day.png');
      case 'none_night':
        return require('./assets/images/none_night.png');
      case 'snow':
        return require('./assets/images/snow.png');
      case 'storm':
        return require('./assets/images/storm.png');
      default:
        return require('./assets/images/none_day.png');
    }
  };

  const fetchWeather = async () => {
    if (text.trim() === '') return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.hgbrasil.com/weather?key=SUA-CHAVE&city_name=${text}`);
      const data = await response.json();

      if (data && data.results) {
        setWeather(data.results);
      } else {
        setError('City not found.');
      }
    } catch (error) {
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>Digite o nome da cidade</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da cidade..."
          placeholderTextColor="#888"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Ver temperatura</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loading} />}

        {error && <Text style={styles.error}>{error}</Text>}

        {weather && (
          <View style={styles.weatherContainer}>
            <Text style={styles.cityText}>{weather.city}</Text>
            <Text style={styles.tempText}>{weather.temp}°C</Text>
            <Image source={getImageSource(weather.condition_slug)} style={styles.image} />
            <Text style={styles.weatherText}>{weather.description}</Text>
          </View>
        )}
        {weather && weather.forecast && (
          <View style={styles.forecastContainer}>
            <Text style={styles.title}>Próximos dias</Text>
            {weather.forecast.map((prev, index) => {
              if (index === 0) {
                return null;
              }

              return (
                <View key={index} style={styles.forecastItem}>
                  <Text style={styles.weatherText}>{prev.date}</Text>
                  <Text style={styles.weatherText}>
                    <Text style={{ fontWeight: 'bold' }}>Máxima: </Text>
                    <Text>{prev.max}ºC</Text>
                  </Text>
                  <Text style={styles.weatherText}>
                    <Text style={{ fontWeight: 'bold' }}>Mínima: </Text>
                    <Text>{prev.min}ºC</Text>
                  </Text>
                  <View style={styles.conditionPrev}>
                    <Image source={getImageSource(prev.condition)} style={styles.prevImage} />
                    <Text style={styles.weatherText}>{prev.description}</Text>
                  </View>
                  <View style={styles.conditionPrev}>
                    <Image source={getImageSource('rain')} style={styles.prevImage} />
                    <Text style={styles.weatherText}>{prev.rain_probability}% chance de chuva</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  weatherContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cityText: {
    fontSize: 24,
  },
  tempText: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
  },
  prevImage: {
    width: 25,
    height: 25,
  },
  conditionPrev: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  forecastContainer: {
    marginTop: 20,
    width: '100%',
  },
  forecastItem: {
    marginBottom: 20,
  },
  weatherText: {
    fontSize: 18,
    color: '#333',
  },
  content: {
    width: '100%',
    maxWidth: 600,
  },
});

export default TextInputScreen;
