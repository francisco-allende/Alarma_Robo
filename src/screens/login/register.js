import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import useAuthenticationApi from '../../api/authentication';
import showToast from '../../functions/showToast';
import {Colors, GlobalStyles} from '../../assets/styles/global-styles';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {registerUser} = useAuthenticationApi(
    email,
    password,
    setIsLoading,
    navigation,
  );

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      showToast('error', 'Por favor, complete todos los campos.', 3000);
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'Las contraseñas no coinciden.', 3000);
      return;
    }
    await registerUser();
  };

  return (
    <View style={[styles.container, {backgroundColor: Colors.secondary}]}>
      <ImageBackground
        source={require('../../assets/img/login-background.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>
          <View style={styles.formContainer}>
            <Text style={[GlobalStyles.text, styles.title]}>Crear Cuenta</Text>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faEnvelope} style={styles.inputIcon} />
              <TextInput
                style={[GlobalStyles.input, styles.input]}
                placeholder="Correo electrónico"
                placeholderTextColor={Colors.text}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} style={styles.inputIcon} />
              <TextInput
                style={[GlobalStyles.input, styles.input]}
                placeholder="Contraseña"
                placeholderTextColor={Colors.text}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} style={styles.inputIcon} />
              <TextInput
                style={[GlobalStyles.input, styles.input]}
                placeholder="Confirmar Contraseña"
                placeholderTextColor={Colors.text}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[GlobalStyles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}>
              <Text style={GlobalStyles.buttonText}>
                {isLoading ? 'Cargando...' : 'Registrarse'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.loginLink}>
              <Text style={[GlobalStyles.text, styles.loginText]}>
                ¿Ya tienes una cuenta? Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    opacity: 0.7, // Ajusta este valor para cambiar la visibilidad de la imagen
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Un fondo semi-transparente para el formulario
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    color: Colors.text,
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  eyeIcon: {
    color: Colors.text,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default RegisterScreen;
