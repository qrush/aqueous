'use strict';

var React = require('react-native');
var {
  LinkingIOS
} = React;

var Utils = {
  openURL: function(url) {
    LinkingIOS.openURL(url);
  }
};

module.exports = Utils;
