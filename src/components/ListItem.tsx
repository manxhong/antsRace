import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {AntsProps} from '../types';
import {PADDING, MARGIN} from '../constants';
import colors, {ColorType} from '../constants/colors';
import images from '../constants/images';
import actions from '../redux/ant/actions';

import {generateAntWinLikelihoodCalculator} from '../utlis';
import {useSelector, useDispatch} from 'react-redux';

type Props = {
  ant: AntsProps;
  index: number;
};

type RowProps = {
  title: string;
  value: string | number;
  color?: ColorType;
};

const RowItem = React.memo((props: RowProps) => {
  const {title, value, color} = props;

  const colorStyle = {color};
  return (
    <View style={styles.rowWrapper}>
      <Text>{`${title}: `}</Text>
      <Text style={[styles.boldText, {...colorStyle}]}>{value}</Text>
    </View>
  );
});

const ListItem = React.memo((props: Props) => {
  const dispatch = useDispatch();
  const antState = useSelector(state => state.ant);

  const {ant, index} = props;

  const {startCalculation} = antState;

  const likelihoodCalculator = generateAntWinLikelihoodCalculator();

  const callback = (likelihoodOfAntWinning: number) => {
    const update = {winningRate: likelihoodOfAntWinning};
    dispatch(actions.updateAntInfo({index, ant: update}));
  };

  useEffect(() => {
    if (startCalculation) likelihoodCalculator(callback);
  }, [startCalculation]);

  const {name, weight, length, color, winningRate} = ant;

  const lowerCaseColor = color.toLowerCase();

  const colorCode = colors?.[lowerCaseColor] || '';

  const tintColor = {tintColor: colorCode};

  const winningPercentage = winningRate
    ? `${Math.round(winningRate * 100)}%`
    : '';

  const getAntStatus = () => {
    if (!startCalculation) {
      return {
        status: 'Not yet run',
        color: colors.black,
      };
    }
    if (!!winningRate) {
      return {
        status: 'Calculated',
        color: colors.lime,
      };
    }
    return {
      status: 'In progress',
      color: colors.salmon,
    };
  };

  const {status, color: statusColor} = getAntStatus();

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.leftWrapper}>
        <Text style={styles.boldText}>{name}</Text>
        <Image
          source={images.ant}
          style={[styles.imageStyle, {...tintColor}]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.rightWrapper}>
        <View>
          <RowItem title="Status" value={status} color={statusColor} />
          <RowItem
            title="Win Rate"
            value={winningPercentage}
            color={colors.red}
          />
        </View>
        <View>
          <RowItem title="Weight" value={weight} />
          <RowItem title="Length" value={length} />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  mainWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: PADDING,
    marginBottom: MARGIN,
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightWrapper: {
    flex: 1,
  },
  leftWrapper: {
    flex: 2,
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ListItem;
