'use strict';

var React = require('react-native');

var {
  Image,
  Navigator,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} = React;

class NavButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#FBBC35"
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute.title}
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return (
      <TouchableOpacity
        underlayColor="#FBBC35"
        onPress={() => navigator.push(newRandomRoute())}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          ⚙
        </Text>
      </TouchableOpacity>
    );
  },

  Title: function(route, navigator, index, navState) {
    if (route.title == "Home") {
      return (
        <Image source={require("./resources/biglogo_white.png")} style={styles.navLogo} resizeMode="contain" />
      );
    } else {
      return (
        <Text style={[styles.navBarText, styles.navBarTitleText]}>
          {route.title}
        </Text>
      );
    }
  },
};

var Aqueous = React.createClass({
  render: function() {
    return (
      <Navigator
        configureScene={(route) => Navigator.SceneConfigs.FloatFromBottom}
        style={styles.appContainer}
        initialRoute={{title: "Home"}}
        renderScene={(route, navigator) => (
          <ScrollView style={styles.scene}>
            <Text style={styles.messageText}>{route.content}</Text>
            <NavButton
              onPress={() => {
                console.log("LOL")
              }}
              text="ROFL!"
            />
          </ScrollView>
        )}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
      />
    );
  },
});


var styles = StyleSheet.create({
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  navBar: {
    backgroundColor: '#3B8E94',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#fff',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: "#fff",
  },
  navLogo: {
    marginTop: 5,
    height: 30
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
});

module.exports = Aqueous;
