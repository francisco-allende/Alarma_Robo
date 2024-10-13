import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
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
  };

  const easyLogin = async () => {
    try {
      setIsLoading(true);
      await auth().signInWithEmailAndPassword(
        'adminuno@yopmail.com',
        '12345678',
      );
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error en inicio rápido:', error);
      showToast('error', 'Error en inicio rápido. Intente nuevamente.', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/img/login-background.png')}
      style={styles.backgroundImage}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Bienvenido</Text>
          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faEnvelope} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#B0B0B0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faLock} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#B0B0B0"
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
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.quickLoginButton,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={easyLogin}
            disabled={isLoading}>
            <Text style={styles.buttonText}>Inicio Rápido</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}>
            <Text style={styles.registerText}>
              ¿No tenes una cuenta? Registrate
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    color: '#FFFFFF',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    paddingVertical: 15,
    fontSize: 16,
  },
  eyeIcon: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#7F8C8D',
  },
  quickLoginButton: {
    backgroundColor: '#2ECC71',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;
