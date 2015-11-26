'use strict';

var React = require('react-native');
var {
  LinkingIOS,
  StatusBarIOS
} = React;

var SafariView = require('react-native-safari-view');

StatusBarIOS.setStyle('light-content')

var Utils = {
  openURL: function(url) {
    console.log("Opening " + url);
    SafariView.show({
      url: url
    });
  }
};

module.exports = Utils;
