// withBackground.js
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const withBackground = (WrappedComponent) => {
  return (props) => (
    <View style={styles.container}>
      <WrappedComponent {...props} />
    </View>
  );
};

export default withBackground;
