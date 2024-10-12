import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Alert,
} from 'react-native';
import {AuthContext} from '../../utils/auth.context';
import {useNavigation} from '@react-navigation/native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import Sound from 'react-native-sound';
import Torch from 'react-native-torch';
import GoBackScreen from '../../components/go-back';

const HomeScreen = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [isArmed, setIsArmed] = useState(false);
  const [orientation, setOrientation] = useState('horizontal');
  const [isInitialRender, setIsInitialRender] = useState(true);
  const currentSound = useRef(null);
  const orientationTimeout = useRef(null);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    let subscription;

    const _subscribe = () => {
      subscription = accelerometer.subscribe(({x, y, z}) => {
        let newOrientation;
        const absX = Math.abs(x);
        const absY = Math.abs(y);
        const absZ = Math.abs(z);

        if (absY > 9 && absX < 2 && absZ < 2) {
          newOrientation = 'vertical';
        } else if (absZ > 9 && absX < 2 && absY < 2) {
          newOrientation = 'horizontal';
        } else if (absX > 3) {
          newOrientation = x > 0 ? 'rightTilt' : 'leftTilt';
        } else {
          newOrientation = 'horizontal'; // Default to horizontal for stability
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
          setTimeout(() => Torch.switchState(false), 5000);
          break;
        case 'horizontal':
          soundFile = require('../../assets/sounds/epa.mp3');
          Vibration.vibrate(5000);
          break;
      }

      if (soundFile) {
        playSound(soundFile);
      }
    }, 200); // Reduced to 200ms for faster response
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
      Alert.prompt(
        'Desactivar Alarma',
        'Ingrese su contraseña para desactivar la alarma',
        [
          {
            text: 'Cancelar',
            onPress: () => console.log('Cancelado'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: password => {
              if (password === user.password) {
                setIsArmed(false);
              } else {
                playSound(require('../../assets/sounds/wrong_password.mp3'));
                Vibration.vibrate(5000);
                Torch.switchState(true);
                setTimeout(() => Torch.switchState(false), 5000);
              }
            },
          },
        ],
        'secure-text',
      );
    } else {
      setIsArmed(true);
    }
  };

  return (
    <View style={styles.container}>
      <GoBackScreen isActive={isArmed} />
      <TouchableOpacity
        style={[styles.button, {backgroundColor: isArmed ? 'red' : 'green'}]}
        onPress={toggleAlarm}>
        <Text style={styles.buttonText}>
          {isArmed ? 'Desactivar' : 'Activar'} Alarma
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
