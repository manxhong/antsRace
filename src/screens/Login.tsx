import React, {useState, useEffect, useCallback} from 'react';

import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {PADDING, MARGIN, IS_LOGIN} from '../constants';
import {useAsyncStorage} from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';

import {FormFields} from '../types';
import colors from '../constants/colors';

const Login: React.FC = () => {
  const navigation = useNavigation();

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [validationError, setValidationError] = useState<FormFields>({
    userName: '',
    password: '',
  });

  const {getItem, setItem} = useAsyncStorage(IS_LOGIN);

  useEffect(() => {
    navigateToHome();
  }, []);

  const onFocus = useCallback(
    field => {
      setValidationError({...validationError, [field]: ''});
    },
    [validationError, setValidationError],
  );

  const onBlur = useCallback(
    field => {
      let error = '';
      if (field === 'userName' && !userName) {
        error = 'Please fill Username';
      } else if (field === 'password' && password.length < 6) {
        error = 'Password must contain at least 6 characters';
      }
      setValidationError({...validationError, [field]: error});
    },
    [userName, password, validationError, setValidationError],
  );

  const navigateToHome = async () => {
    const flag = await getItem();
    if (flag === 'done') {
      navigation.replace('Main');
    }
  };

  const handleLoginPress = async () => {
    await setItem('done');
    navigation.replace('Main');
  };

  const disabled = !userName || password.length < 6;

  const buttonColor = {
    backgroundColor: disabled ? colors.disabled : colors.lime,
  };

  return (
    <View>
      <Text style={styles.errorTextStyle}>{validationError.userName}</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setUserName(text.trim())}
        onFocus={() => onFocus('userName')}
        onBlur={() => onBlur('userName')}
        value={userName}
        placeholder="Username"
        autoCapitalize="none"
      />
      <Text style={styles.errorTextStyle}>{validationError.password}</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setPassword(text.trim())}
        onFocus={() => onFocus('password')}
        onBlur={() => onBlur('password')}
        value={password}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.buttonStyle, {...buttonColor}]}
        disabled={disabled}
        onPress={handleLoginPress}
        activeOpacity={0.8}>
        <Text style={styles.buttonTextStyle}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: MARGIN,
    padding: PADDING,
    borderWidth: 1,
  },
  buttonStyle: {
    alignItems: 'center',
    height: 40,
    margin: MARGIN,
    borderRadius: 8,
  },
  buttonTextStyle: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorTextStyle: {
    marginTop: MARGIN,
    marginLeft: MARGIN,
    fontSize: 12,
    color: colors.red,
  },
});

export default Login;
