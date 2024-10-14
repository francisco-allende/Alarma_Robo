import React, {useState, useContext} from 'react';
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
import {AuthContext} from '../../utils/auth.context';
import useAuthenticationApi from '../../api/authentication';
import showToast from '../../functions/showToast';
import auth from '@react-native-firebase/auth';
import {Colors, GlobalStyles} from '../../assets/styles/global-styles';

const LoginScreen = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {doLogin} = useAuthenticationApi(
    email,
    password,
    setIsLoading,
    navigation,
  );

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('error', 'Por favor, complete todos los campos.', 3000);
      return;
    }
    await doLogin();
    navigation.navigate('Home', {userPassword: password});
  };

  const easyLogin = async () => {
    try {
      setIsLoading(true);
      await auth().signInWithEmailAndPassword(
        'adminuno@yopmail.com',
        '12345678',
      );
      navigation.navigate('Home', {userPassword: '12345678'});
    } catch (error) {
      console.error('Error en inicio rápido:', error);
      showToast('error', 'Error en inicio rápido. Intente nuevamente.', 3000);
    } finally {
      setIsLoading(false);
    }
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
            <Text style={[GlobalStyles.text, styles.title]}>Bienvenido</Text>
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
            <TouchableOpacity
              style={[GlobalStyles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}>
              <Text style={GlobalStyles.buttonText}>
                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                GlobalStyles.button,
                styles.quickLoginButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={easyLogin}
              disabled={isLoading}>
              <Text style={GlobalStyles.buttonText}>Inicio Rápido</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.registerLink}>
              <Text style={[GlobalStyles.text, styles.registerText]}>
                ¿No tienes una cuenta? Regístrate
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
  quickLoginButton: {
    backgroundColor: Colors.secondary,
    marginTop: 10,
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;
