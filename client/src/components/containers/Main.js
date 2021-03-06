import React, { Component } from "react";
import Home from "../screens/Home";
import NavbarMenu from "../interface/NavbarMenu";
import {
  addEvent,
  loadEvents,
  loadRegions,
  loadUsers
} from "../../redux/actions";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Events from "../screens/Events";
import axios from "axios";
import jsonpAdapter from "axios-jsonp";
import SingleEvent from "../interface/list/SingleEvent";
import Login from "../screens/Login";

class Main extends Component {
  fetchAreas = () => {
    const { loadRegionsList } = this.props;
    axios({
      url: "https://eventhood.worldtecno.com/api.php?db=territori",
      adapter: jsonpAdapter,
      callbackParamName: "axiosJsonpCallback"
    })
      .then(res => res.data.features.map(el => el.properties.AMBITO))
      .then(res => loadRegionsList(res));
  };

  fetchUsers = () => {
    const { loadUserList } = this.props;
    axios({
      url: "https://eventhood.worldtecno.com/api.php?db=utenti",
      adapter: jsonpAdapter,
      callbackParamName: "axiosJsonpCallback"
    }).then(res => loadUserList(res.data.users));
  };

  fetchEvents = () => {
    const { loadEventsList } = this.props;
    axios({
      url: "https://eventhood.worldtecno.com/api.php?db=eventi",
      adapter: jsonpAdapter,
      callbackParamName: "axiosJsonpCallback"
    })
      .then(res => res.data.events)
      .then(res => loadEventsList(res));
  };
  componentDidMount() {
    this.fetchAreas();
    this.fetchEvents();
    this.fetchUsers();
  }

  render() {
    return (
      <Router>
        {this.props.actualRegion && <NavbarMenu />}
        <Route path="/" exact component={Home} />
        <Route path="/eventi/" component={Events} />
        <Route
          path="/evento/:id"
          render={props => <SingleEvent {...props} />}
        />
        <Route path="/login" component={Login} />
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events,
  user: state.user,
  actualRegion: state.actualRegion
});

const dispatchStateToProps = dispatch => ({
  addEventToList: event => dispatch(addEvent(event)),
  loadEventsList: events => dispatch(loadEvents(events)),
  loadRegionsList: query => dispatch(loadRegions(query)),
  loadUserList: list => dispatch(loadUsers(list))
});

export default connect(
  mapStateToProps,
  dispatchStateToProps
)(Main);
