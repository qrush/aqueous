'use strict';

var React = require('react-native');
var {
} = React;

var WebIntent = require('react-native-webintent');


var Utils = {
  openURL: function(url) {
    console.log("Opening " + url);
    WebIntent.open(url);
  }
};

module.exports = Utils;
