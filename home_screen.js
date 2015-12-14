'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
  Image
} = React;

if (Platform.OS === 'ios')
  var Utils = require('./utils.ios.js')
else
  var Utils = require('./utils.android.js')

var GiftedListView = require('react-native-gifted-listview');
var GiftedSpinner = require('react-native-gifted-spinner');

let Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var HomeScreen = React.createClass({
  /**
   * Will be called when refreshing
   * Should be replaced by your own logic
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    var sections = {};

    fetch('http://aqueousband.com/tour.json')
      .then((response) => response.json())
      .then((responseJSON) => {
        sections["Upcoming shows"] = responseJSON
        callback(sections, {
          allLoaded: true
        });
      })
    .catch((error) => {
      console.warn(error);
    });
  },


  /**
   * When a row is touched
   * @param {object} show Show data
   */
  _onPress(show) {
    for(var url of [show.event_url, show.venue.info_url, show.url]) {
      if(url !== "") {
        Utils.openURL(url);
        break;
      }
    }
  },
  
  /**
   * Render a row
   * @param {object} show Show data
   */
  _renderRowView(show) {
    var performedAt = new Date(show.performed_at)
    1
    var month = Months[performedAt.getMonth()];
    var day = performedAt.getDate();
    var venueText = show.venue.name + " in " + show.venue.location;

    return (
      <TouchableHighlight
        style={rowStyles.outer}
        underlayColor='#c8c7cc33'
        onPress={() => this._onPress(show)}
      >
        <View style={rowStyles.inner}>
          <View style={rowStyles.header}>
            <Image source={{uri: show.venue.map_left_url}} style={rowStyles.headerImage} resizeMode="stretch">
              <View style={rowStyles.dateSpacer} />
              <Text style={rowStyles.dateDayText}>{day}</Text>
              <Text style={rowStyles.dateMonthText}>{month}</Text>
            </Image>
            <Image source={{uri: show.venue.map_center_url}} style={rowStyles.headerImage} resizeMode="stretch"/>
            <Image source={{uri: show.venue.map_right_url}} style={rowStyles.headerImage} resizeMode="stretch"/>
          </View>
          <Text style={rowStyles.footer}>{venueText}</Text>
        </View>
      </TouchableHighlight>
    );
  },

  /**
   * Render a row
   * @param {object} rowData Row data
   */
  _renderSectionHeaderView(sectionData, sectionID) {
    return (
      <View style={customStyles.header}>
        <Text>
          {sectionID}
        </Text>
      </View>
    );
  },
  
  /**
   * Render the refreshable view when waiting for refresh
   * On Android, the view should be touchable to trigger the refreshCallback
   * @param {function} refreshCallback The function to call to refresh the listview
   */
  _renderRefreshableWaitingView(refreshCallback) {
    if (Platform.OS !== 'android') {
      return (
        <View style={customStyles.refreshableView}>
          <Text style={customStyles.actionsLabel}>
            ↓
          </Text>
        </View>
      );
    } else {
      return (
        <TouchableHighlight 
          underlayColor='#c8c7cc'
          onPress={refreshCallback}
          style={customStyles.refreshableView}
        >
          <Text style={customStyles.actionsLabel}>
            ↻
          </Text>
        </TouchableHighlight>
      );
    }
  },

  /**
   * Render the refreshable view when the pull to refresh has been activated
   * @platform ios
   */
  _renderRefreshableWillRefreshView() {
    return (
      <View style={customStyles.refreshableView}>
        <Text style={customStyles.actionsLabel}>
          ↻
        </Text>
      </View>
    );
  },

  /**
   * Render the refreshable view when fetching
   */
  _renderRefreshableFetchingView() {
    return (
      <View style={customStyles.refreshableView}>
        <GiftedSpinner />
      </View>
    );
  },
  
  /**
   * Render the pagination view when waiting for touch
   * @param {function} paginateCallback The function to call to load more rows
   */
  _renderPaginationWaitingView(paginateCallback) {
    return (
      <TouchableHighlight 
        underlayColor='#c8c7cc'
        onPress={paginateCallback}
        style={customStyles.paginationView}
      >
        <Text style={customStyles.actionsLabel}>
          +
        </Text>
      </TouchableHighlight>
    );
  },
  
  /**
   * Render the pagination view when fetching
   */
  _renderPaginationFetchigView() {
    return (
      <View style={customStyles.paginationView}>
        <GiftedSpinner />
      </View>
    );
  },
  
  /**
   * Render the pagination view when end of list is reached
   */
  _renderPaginationAllLoadedView() {
    return (
      <View style={customStyles.paginationView}>
        <Text style={customStyles.actionsLabel}>
          ~
        </Text>
      </View>
    );
  },
  
  /**
   * Render a view when there is no row to display at the first fetch
   * @param {function} refreshCallback The function to call to refresh the listview
   */
  _renderEmptyView(refreshCallback) {
    return (
      <View style={customStyles.defaultView}>
        <Text style={customStyles.defaultViewTitle}>
          Sorry, there is no content to display
        </Text>

        <TouchableHighlight 
          underlayColor='#c8c7cc'
          onPress={refreshCallback}
        >
          <Text>
            ↻
          </Text>
        </TouchableHighlight>
      </View>
    );
  },

  /**
   * Render a separator between rows
   */
  _renderSeparatorView() {
    return (
      <View style={customStyles.separator} />
    );
  },
 
  render() {
    return (
      <View style={screenStyles.container}>
        <GiftedListView
          rowView={this._renderRowView}

          onFetch={this._onFetch}
          initialListSize={12} // the maximum number of rows displayable without scrolling (height of the listview / height of row)

          firstLoader={true} // display a loader for the first fetching

          pagination={true} // enable infinite scrolling using touch to load more
          paginationFetchigView={this._renderPaginationFetchigView}
          paginationAllLoadedView={this._renderPaginationAllLoadedView}
          paginationWaitingView={this._renderPaginationWaitingView}

          refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
          refreshableViewHeight={50} // correct height is mandatory
          refreshableDistance={40} // the distance to trigger the pull-to-refresh - better to have it lower than refreshableViewHeight
          refreshableFetchingView={this._renderRefreshableFetchingView}
          refreshableWillRefreshView={this._renderRefreshableWillRefreshView}
          refreshableWaitingView={this._renderRefreshableWaitingView}

          emptyView={this._renderEmptyView}

          renderSeparator={this._renderSeparatorView}

          withSections={true} // enable sections
          sectionHeaderView={this._renderSectionHeaderView}
        />
      </View>
    );
  }
});

var rowStyles = {
  outer: {
    height: 175,
  },

  inner: {
    flexDirection: 'column',
    height: 175,
  },

  header: {
    flexDirection: 'row',
    flex: 1,
  },

  headerImage: {
    flex: 1
  },

  date: {
    flex: 0.20,
  },

  dateSpacer: {
    flex: 1
  },

  dateDayText: {
    width: 50,
    textAlign: 'center',
    fontSize: 26,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: '#ffffff',
    opacity: 0.7
  },

  dateMonthText: {
    width: 50,
    textAlign: 'center',
    fontSize: 18,
    marginLeft: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: '#ffffff',
    opacity: 0.7
  },

  footer: {
    fontSize: 15,
    margin: 10,
  }
}

var customStyles = {
  separator: {
    height: 1,
    backgroundColor: '#CCC'
  },
  refreshableView: {
    height: 50,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsLabel: {
    fontSize: 20,
  },
  paginationView: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  defaultView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  defaultViewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  header: {
    backgroundColor: '#EEE',
    padding: 10,
  }
};

var screenStyles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 64,
  },
};

module.exports = HomeScreen;
