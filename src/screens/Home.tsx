import React, {useEffect, useRef} from 'react';

import {
  Animated,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {times} from 'lodash';

import axios from 'axios';

import {useAsyncStorage} from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';

import {PADDING, MARGIN} from '../constants';

import {
  GET_ANTS_QUERY,
  GRAPHQL_API,
  ANT_COUNT,
  ANT_SIZE,
  IS_LOGIN,
} from '../constants';
import images from '../constants/images';

import ListItem from '../components/ListItem';

import {useSelector, useDispatch} from 'react-redux';

import actions from '../redux/ant/actions';
import {AntStateType} from '../redux/ant/types';
import colors from '../constants/colors';

import {Image, View, Text, FlatList} from 'react-native';

import {sortAnts} from '../utlis';

import {AntsProps} from '../types';

const START_POSITION = ANT_COUNT * -ANT_SIZE;

const width = Dimensions.get('window').width;

const Home: React.FC = () => {
  const navigation = useNavigation();
  const {setItem} = useAsyncStorage(IS_LOGIN);
  const dispatch = useDispatch();

  const antState: AntStateType = useSelector(state => state.ant);

  const animatedX = useRef(new Animated.Value(0)).current;

  const {ants = [], startCalculation} = antState;

  const allCalcualted = ants.every(item => !!item.winningRate);

  const sortedAnts: AntsProps[] = sortAnts(ants);

  const fetchData = async () => {
    const queryResult = await axios.post(GRAPHQL_API, {
      query: GET_ANTS_QUERY,
    });
    const result = queryResult.data.data;
    const ants = result.ants;
    dispatch(actions.setAntsInfo(ants));
  };

  useEffect(() => {
    fetchData();
    Animated.loop(
      Animated.timing(animatedX, {
        duration: 10000,
        toValue: 1,
        useNativeDriver: false,
      }),
    ).start();
  }, []);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [sortedAnts]);

  const handleLogout = async () => {
    await setItem('');
    navigation.replace('Auth');
  };

  const getProgressStatus = () => {
    if (!startCalculation) {
      return {
        status: 'NOT YET RUN',
        buttonText: 'Start Calculate',
        color: colors.black,
      };
    }
    if (allCalcualted) {
      return {
        status: 'ALL CALCULATED',
        buttonText: 'Calculated',
        color: colors.lime,
      };
    }
    return {
      status: 'IN PROGRESS',
      buttonText: 'Calculating',
      color: colors.salmon,
    };
  };

  const renderItem = ({item, index}: {item: AntsProps; index: number}) => {
    return <ListItem key={item.name} index={index} ant={item} />;
  };

  const disabled = !ants.length || startCalculation;

  const buttonColor = {
    backgroundColor: disabled ? colors.disabled : colors.salmon,
  };

  const {buttonText, status, color: statusColor} = getProgressStatus();

  const xVal = animatedX.interpolate({
    inputRange: [0, 1],
    outputRange: [START_POSITION, width],
  });

  const animatedStyle = {
    transform: [
      {
        translateX: xVal,
      },
    ],
  };

  return (
    <View style={styles.mainWrapper}>
      {!!ants.length && (
        <Text style={[styles.statusStyle, {color: statusColor}]}>{status}</Text>
      )}
      <FlatList
        data={sortedAnts}
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={
          <View style={styles.acitvityIndicatorWrapper}>
            <ActivityIndicator size="large" color={colors.salmon} />
          </View>
        }
        renderItem={renderItem}
        keyExtractor={item => item.name}
      />
      {!!ants.length && (
        <TouchableOpacity
          style={[styles.buttonStyle, {...buttonColor}]}
          disabled={disabled}
          onPress={() => {
            dispatch(actions.startCalculation(true));
          }}
          activeOpacity={0.8}>
          <Text style={styles.buttonTextStyle}>{buttonText}</Text>
        </TouchableOpacity>
      )}
      <Text onPress={handleLogout} style={styles.outlineTextStyle}>
        Logout
      </Text>
      <View style={styles.rowWrapper}>
        {times(ANT_COUNT, (i: number) => (
          <Animated.View key={i} style={[styles.imageStyle, animatedStyle]}>
            <Image
              source={images.ant}
              style={[styles.imageStyle]}
              resizeMode="contain"
            />
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  acitvityIndicatorWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  rowWrapper: {
    flexDirection: 'row',
  },
  outlineButtonStyle: {
    height: 20,
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
  },
  outlineTextStyle: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.red,
  },
  buttonStyle: {
    alignItems: 'center',
    height: 40,
    margin: MARGIN,
    borderRadius: 8,
  },
  buttonTextStyle: {
    paddingVertical: PADDING,
    fontSize: 16,
    color: '#FFFFFF',
  },
  statusStyle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: PADDING,
  },
  imageStyle: {
    position: 'relative',
    left: 0,
    width: ANT_SIZE,
    height: ANT_SIZE,
  },
});

export default Home;
