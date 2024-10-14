import {StyleSheet} from 'react-native';

export const Colors = {
  background: '#1A1A2E', // Azul muy oscuro
  primary: '#16213E', // Azul oscuro
  secondary: '#0F3460', // Azul medio
  accent: '#E94560', // Rojo oscuro
  text: '#FFFFFF', // Blanco para el texto
  inputBackground: '#2C394B', // Gris azulado oscuro para inputs
  buttonActive: '#4A0E4E', // Púrpura oscuro para botón activo
  buttonInactive: '#2E0A2F', // Púrpura más oscuro para botón inactivo
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  text: {
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    color: Colors.text,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: Colors.accent,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
