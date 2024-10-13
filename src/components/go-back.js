import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {
  AppButton,
  AppColors,
  AppFontSize,
} from '../assets/styles/default-styles';

export default function GoBackScreen({isActive}) {
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.header,
        {backgroundColor: isActive ? '#FF4136' : '#2ECC40'},
      ]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          size={21}
          style={AppButton.goBack}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    color: AppColors.white,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12,
  },
});
