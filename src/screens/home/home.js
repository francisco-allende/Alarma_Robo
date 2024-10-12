import React, {useState, useContext, useEffect} from 'react';
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
  const [lastOrientation, setLastOrientation] = useState('horizontal');
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);

    const subscription = accelerometer.subscribe(({x, y, z}) => {
      let newOrientation;
      if (Math.abs(y) > 8) {
        newOrientation = 'vertical';
      } else if (Math.abs(x) > 8) {
        newOrientation = x > 0 ? 'right' : 'left';
      } else {
        newOrientation = 'horizontal';
      }

      if (newOrientation !== orientation) {
        setLastOrientation(orientation);
        setOrientation(newOrientation);
        if (!isArmed && !isInitialRender) {
          setIsArmed(true);
        }
      }
    });

    // Establecer isInitialRender a false después de un breve retraso
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 1000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [orientation, isArmed, isInitialRender]);

  useEffect(() => {
    if (isArmed && orientation !== lastOrientation && !isInitialRender) {
      handleOrientationChange(orientation);
    }
  }, [orientation, isArmed, lastOrientation, isInitialRender]);

  const handleOrientationChange = newOrientation => {
    switch (newOrientation) {
      case 'left':
        playSound('left.mp3');
        break;
      case 'right':
        playSound('right.mp3');
        break;
      case 'vertical':
        playSound('vertical.mp3');
        Torch.switchState(true);
        setTimeout(() => Torch.switchState(false), 5000);
        break;
      case 'horizontal':
        playSound('horizontal.mp3');
        Vibration.vibrate(5000);
        break;
    }
  };

  const playSound = soundFile => {
    const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      sound.play(() => sound.release());
    });
  };

  const toggleAlarm = () => {
    if (isArmed) {
      // Desactivar la alarma
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
                // Asumiendo que tienes acceso a la contraseña del usuario
                setIsArmed(false);
              } else {
                // Contraseña incorrecta
                playSound('wrong_password.mp3');
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
      // Activar la alarma
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
