import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navigation from './components/common/Navigation';
import createHistory from "history/createBrowserHistory"
import ChurchesPage from './components/pages/ChurchesPage';
import DriversPage from './components/pages/DriversPage';
import AddChurchPage from './components/pages/AddChurchPage';
import AddDriverPage from './components/pages/AddDriverPage';
import AddRiderPage from './components/pages/AddRiderPage';
import EditChurchPage from './components/pages/EditChurchPage';
import EditDriverPage from './components/pages/EditDriverPage';
import EditRiderPage from './components/pages/EditRiderPage';
import { NotFoundPage } from './components/pages/NotFoundPage';

const history = createHistory();

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={Navigation} />
          <Switch>
            <Route path="/" component={ChurchesPage} exact={true} />
            <Route path="/add/church" component={AddChurchPage} />
            <Route path="/drivers/:church_id/add" component={AddDriverPage} />
            <Route path="/drivers/:church_id/add_rider/:driver_id" component={AddRiderPage} />
            <Route path="/edit/church/:church_id" component={EditChurchPage} />
            <Route path="/drivers/:church_id/edit/:driver_id" component={EditDriverPage} />
            <Route path="/drivers/:church_id/edit_rider/:driver_id/:rider_id" component={EditRiderPage} />
            <Route path="/drivers/:church_id" component={DriversPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
