import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  View
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250; //ms

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  }

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe(1);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe(-1);
        } else {
          this.resetPosition();
        }
      }
    });

    this.position = position;
    this.state = { panResponder, index: 0 };
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-30deg', '0deg', '30deg']
    });

    return {
      ...this.position.getLayout(),
      transform: [{ rotate }]
    };
  }

  forceSwipe(direction) {
    Animated.timing(this.position, {
      toValue: { x: 2 * SCREEN_WIDTH * direction, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.completeSwipe(direction));
  }

  completeSwipe(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];

    direction === 0 ? onSwipeRight(item) : onSwipeLeft(item);
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, i) => {
      if (i < this.state.index) { return null; }

      if (i === this.state.index) {
        return (
          <Animated.View
            key={item.id}
            style={[this.getCardStyle(), styles.cardStyle]}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }

      return (
        <View key={item.id} style={styles.cardStyle}>
          {this.props.renderCard(item)}
        </View>
      );
    }).reverse();
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
};

export default Deck;
