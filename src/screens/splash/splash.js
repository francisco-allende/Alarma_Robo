import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Colors, GlobalStyles} from '../../assets/styles/global-styles';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000); // 3 segundos de duración

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('./../../assets/img/icono.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>Alarma de Robo</Text>
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.info}>Francisco Allende</Text>
        <Text style={styles.info}>División A141-2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 50,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  bottomSection: {
    alignItems: 'center',
  },
  info: {
    fontSize: 24,
    color: Colors.text,
    marginBottom: 15,
  },
});

export default SplashScreen;
