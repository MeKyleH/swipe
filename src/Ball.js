import React, { Component } from 'react';
import { Animated, View } from 'react-native';

class Ball extends Component {
  componentWillMount() {
    this.position = new Animated.ValueXY(0, 0);
    Animated.spring(this.position, {
      toValue: { x: 300, y: 750 }
    }).start();
  }

  render() {
    return (
      <Animated.View style={this.position.getLayout()}>
        <View style={styles.ballStyle} />
      </Animated.View>
    );
  }
}

const styles = {
  ballStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'green'
  }
};

export default Ball;
