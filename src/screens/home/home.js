import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import {AuthContext} from '../../utils/auth.context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import Sound from 'react-native-sound';
import Torch from 'react-native-torch';
import GoBackScreen from '../../components/go-back';
import PasswordModal from './password-modal';
import {getUserPassword, getCurrentUserId} from '../../api/firestore';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [isArmed, setIsArmed] = useState(false);
  const [orientation, setOrientation] = useState('horizontal');
  const [isInitialRender, setIsInitialRender] = useState(true);
  const currentSound = useRef(null);
  const orientationTimeout = useRef(null);
  const lastVerticalTime = useRef(0);
  const [modalVisible, setModalVisible] = useState(false);
  const route = useRoute();
  const {userPassword} = route.params;

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    let subscription;

    const _subscribe = () => {
      subscription = accelerometer.subscribe(({x, y, z}) => {
        let newOrientation;
        const now = Date.now();

        if (Math.abs(y) > 7) {
          newOrientation = 'vertical';
          lastVerticalTime.current = now;
        } else if (Math.abs(x) > 3 && now - lastVerticalTime.current > 500) {
          newOrientation = x > 0 ? 'rightTilt' : 'leftTilt';
        } else if (Math.abs(z) > 8) {
          // Increased sensitivity for horizontal
          newOrientation = 'horizontal';
        } else {
          newOrientation = orientation; // Keep current orientation if no significant change
        }

        if (newOrientation !== orientation) {
          console.log(
            'Nueva orientación:',
            newOrientation,
            'X:',
            x,
            'Y:',
            y,
            'Z:',
            z,
          );
          if (!isInitialRender) {
            handleOrientationChange(newOrientation);
          }
          setOrientation(newOrientation);
          if (!isArmed && !isInitialRender) {
            setIsArmed(true);
          }
        }
      });
    };

    const _unsubscribe = () => {
      subscription && subscription.unsubscribe();
    };

    _subscribe();

    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 1000);

    return () => {
      _unsubscribe();
      clearTimeout(timer);
    };
  }, [orientation, isArmed, isInitialRender]);

  const handleOrientationChange = newOrientation => {
    if (orientationTimeout.current) {
      clearTimeout(orientationTimeout.current);
    }

    orientationTimeout.current = setTimeout(() => {
      if (currentSound.current) {
        currentSound.current.stop(() => {
          currentSound.current.release();
        });
      }

      let soundFile;
      switch (newOrientation) {
        case 'leftTilt':
          soundFile = require('../../assets/sounds/devolve.mp3');
          break;
        case 'rightTilt':
          soundFile = require('../../assets/sounds/choreando.mp3');
          break;
        case 'vertical':
          soundFile = require('../../assets/sounds/cop-car.mp3');
          Torch.switchState(true);
          setTimeout(() => Torch.switchState(false), 3000);
          break;
        case 'horizontal':
          soundFile = require('../../assets/sounds/epa.mp3');
          Vibration.vibrate(3000);
          break;
      }

      if (soundFile) {
        playSound(soundFile);
      }
    }, 500); // Adjusted to 500ms for a balance between responsiveness and stability
  };

  const playSound = soundFile => {
    const sound = new Sound(soundFile, error => {
      if (error) {
        console.log('Error al cargar el sonido:', error);
        return;
      }
      currentSound.current = sound;
      sound.play(success => {
        if (success) {
          console.log('Reproducción exitosa');
        } else {
          console.log('Error en la reproducción');
        }
        sound.release();
        currentSound.current = null;
      });
    });
  };

  const toggleAlarm = () => {
    if (isArmed) {
      setModalVisible(true);
      console.log(userPassword);
    } else {
      setIsArmed(true);
    }
  };

  const handlePasswordSubmit = enteredPassword => {
    if (enteredPassword === userPassword) {
      setIsArmed(false);
      setModalVisible(false);
    } else {
      playSound(require('../../assets/sounds/wrong_password.mp3'));
      Vibration.vibrate(5000);
      Torch.switchState(true);
      setTimeout(() => Torch.switchState(false), 5000);
    }
  };

  return (
    <View style={styles.container}>
      <GoBackScreen isActive={isArmed} />
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          isArmed ? styles.armed : styles.disarmed,
        ]}
        onPress={toggleAlarm}>
        <Image
          source={require('../../assets/img/icono.png')}
          style={styles.buttonImage}
        />
        <Text style={styles.buttonText}>
          {isArmed ? 'DESACTIVAR' : 'ACTIVAR'}
        </Text>
      </TouchableOpacity>
      <PasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handlePasswordSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A40',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,
  },
  armed: {
    backgroundColor: '#FF4136',
  },
  disarmed: {
    backgroundColor: '#2ECC40',
  },
});

export default HomeScreen;
