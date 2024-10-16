import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
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
import {Colors, GlobalStyles} from '../../assets/styles/global-styles';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const {userPassword} = route.params;
  const [isArmed, setIsArmed] = useState(false);
  const [orientation, setOrientation] = useState('horizontal');
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const currentSound = useRef(null);
  const orientationTimeout = useRef(null);
  const lastVerticalTime = useRef(0);

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
          newOrientation = 'horizontal';
        } else {
          newOrientation = orientation;
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
    }, 500);
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

  const toggleAlarm = useCallback(() => {
    console.log('toggleAlarm called, isArmed:', isArmed);
    if (isArmed) {
      console.log('Setting modalVisible to true');
      setModalVisible(true);
    } else {
      console.log('Setting isArmed to true');
      setIsArmed(true);
    }
  }, [isArmed]);

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
    <View style={GlobalStyles.container}>
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
        <Text style={[GlobalStyles.text, styles.buttonText]}>
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
    fontWeight: 'bold',
    marginTop: 20,
  },
  armed: {
    backgroundColor: Colors.accent,
  },
  disarmed: {
    backgroundColor: Colors.secondary,
  },
});

export default HomeScreen;
