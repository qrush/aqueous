'use strict';

var React = require('react-native');
var {
  LinkingIOS,
} = React;

var SafariView = require('react-native-safari-view');

var Utils = {
  openURL: function(url) {
    console.log("Opening " + url);
    SafariView.show({
      url: url
    });
  }
};

module.exports = Utils;
