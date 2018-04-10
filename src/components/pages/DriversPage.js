import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid, Message, Button,
  Segment, Container, Header,
  Transition, Confirm
} from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import database from '../../firebase/firebase';
import _ from 'lodash';

class DriversPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      churchName: undefined,
      drivers: [],
      activeKey: '1',
      showRiders: undefined,
      showAll: false,
      open: false,
      firstName: undefined,
      driver_id: undefined
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  // Confirm Modal 
  show = (firstName, driver_id) => this.setState({ firstName: firstName, driver_id: driver_id, open: true })
  handleConfirm = () => this.onDelete()
  handleCancel = () => this.setState({ open: false, firstName: undefined })
  // --- //

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  onDelete() {
    const church_id = this.props.match.params.church_id;
    const driversRefString = `churches/${church_id}/drivers/${this.state.driver_id}`;
    const driversRef = database.ref(driversRefString);
    driversRef.remove();
    this.setState({ open: false, firstName: undefined });
  }


  componentDidMount() {
    const church_id = this.props.match.params.church_id;
    const driversRefString = `churches/${church_id}/drivers`;
    const churchNameRef = database.ref(`churches/${church_id}/name`);
    const driversRef = database.ref(driversRefString);
    driversRef.orderByChild('firstName').on('value', (snapshot) => {
      const drivers = [];
      snapshot.forEach((childSnapshot) => {
        drivers.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      this.setState(() => ({ drivers }));
    });
    churchNameRef.once('value').then((snapshot) => {
      const churchName = snapshot.val();
      this.setState(() => ({ churchName }));
    });
  }

  renderRiders(riders, church_id, driver_id) {
    if (riders) {
      return (
        <span>
          {
            riders.map(rider =>
              <Link to={`/drivers/${church_id}/edit_rider/${driver_id}/${rider.id}`}>
                <span>{rider.name}</span>
              </Link>
            ).reduce((prev, curr) => [prev, ' - ', curr])
          }
        </span>
      );
    }
    // const ridersArray = riders.map((rider) => {
    //   console.log(rider, 'Rider');
    //   return (
    //     rider.name
    //   );
    // });
    // return ridersArray.join(' - ');
    // return <Link>{riders[0].name}</Link>
  }

  renderDrivers() {
    const church_id = this.props.match.params.church_id;
    const { push } = this.props.history;
    const { width } = this.props.size;
    const driversList = this.state.drivers.map(({
      id, firstName, lastName, riders = undefined, seatsAvailable = undefined
    }, index) => {

      const ridersArray = []
      if (riders) {
        _.forEach(riders, (value, key) => {
          const rider = {};
          const fullName = value.firstName + ' ' + value.lastName;
          rider.name = fullName;
          rider.id = key;
          ridersArray.push(rider);
        });
      };

      console.log('Riders Array:', ridersArray);

      return (
        <div key={id} style={{ marginBottom: '15px' }}>
          <Segment.Group>
            <Segment clearing>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '18px', fontWeight: 500 }}>
                  <Button
                    style={{ backgroundColor: 'white', textDecoration: 'underline', padding: '0px', marginBottom: '10px' }}
                    onClick={
                      (e) => {
                        if (this.state.showRiders === undefined) {
                          this.setState({ showRiders: firstName })
                        } else if (this.state.showRiders) {
                          this.setState({ showRiders: undefined })
                        }
                      }
                    }
                  >
                    {firstName + ' ' + lastName}
                  </Button>
                </div>
                <Button.Group size="tiny" fluid={ width < 450 ? true : false }>
                  <Button positive onClick={(e) => push(`/drivers/${church_id}/add_rider/${id}`)}>Ride</Button>
                  <Button.Or />
                  <Button onClick={(e) => push(`/drivers/${church_id}/edit/${id}`)}>Edit</Button>
                  <Button.Or />
                  <Button color="red" onClick={(e) => this.show(firstName, id)}>Delete</Button>
                </Button.Group>
              </div>
            </Segment>
            {(this.state.showRiders === firstName || this.state.showAll === true) &&

              <Transition visible={(this.state.showRiders || this.state.showAll)} transitionOnMount unmountOnHide animation='slide down' duration={500}>
                <Segment>
                  <p>Seats Left: {seatsAvailable}</p>
                  <p>Riders: {_.isEmpty(ridersArray) ? "There are no riders" : this.renderRiders(ridersArray, church_id, id)}</p>
                </Segment>
              </Transition>

            }
          </Segment.Group>
        </div>
      );


    });
    return driversList;
  }

  render() {
    console.log('state:', this.state, 'props:', this.props, 'DriversPage');
    const { push } = this.props.history;
    const { church_id } = this.props.match.params;
    const { churchName = undefined } = this.state;
    return (
      <Grid>
      
        {/*Confirm deletion of a driver*/}
        <Confirm
          open={this.state.open}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content={`Are you sure you want to delete ${this.state.firstName}?`}
        />

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Message color="blue">
              {_.isEmpty(this.state.drivers)
                ? (
                  <p>
                    Whoa! It looks like there are no drivers headed to {churchName ? churchName : 'a church'} this week.
                    Add a new driver if you'd like.
                  </p>
                )
                : (
                  <p>Add to, or edit the list of drivers headed to {churchName ? churchName : 'a church'} this week.</p>
                )
              }
            </Message>
          </Grid.Column>
        </Grid.Row>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Button floated="right" onClick={() => this.setState({ showAll: !this.state.showAll })}>
              {this.state.showAll === false ? 'Show All Riders' : 'Unshow Riders'}
            </Button>
            <Button floated="right" primary onClick={(e) => push(`/drivers/${church_id}/add`)}>Add Driver</Button>
          </Grid.Column>
        </Grid.Row>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            {this.renderDrivers()}
          </Grid.Column>
        </Grid.Row>

      </Grid>
    );
  }

};

export default sizeMe()(DriversPage);


// Older method for rendering Drivers: 
  // renderDrivers() {
  //   const drivers = this.state.drivers;
  //   const church_id = this.props.match.params.church_id;
  //   const driversList = drivers.map((driver, index) => {
  //     const riders = [];
  //     const keys = Object.keys(driver);
  //     // Determine if riders exist in the drivers object
  //     if (keys.includes('riders')) {
  //       _.forEach(driver.riders, (value, key) => {
  //         const rider = {};
  //         const fullName = value.firstName + ' ' + value.lastName;
  //         rider.name = fullName;
  //         rider.id = key;
  //         riders.push(rider);
  //       });
  //     };
  //     // Return a list of drivers from Google Firebase
  //     return (
  //         <Panel key={driver.id} eventKey={index}>
  //           <Panel.Heading>
  //             <Panel.Title toggle >
  //               <div className="driver_header_wrapper">
  //                 <p>{driver.firstName} {driver.lastName}</p>
  //                 <div>
  //                   <Link to={`/drivers/${church_id}/add_rider/${driver.id}`} className="driver_header_button">Ride</Link>
  //                   <Link to={`/drivers/${church_id}/edit/${driver.id}`} className="driver_header_button">Edit</Link>
  //                   <p onClick={(e) => this.onDelete(driver.id, e)} className="driver_header_button delete-button">Delete Driver</p>
  //                 </div>
  //               </div>
  //             </Panel.Title>
  //           </Panel.Heading>
  //           <Panel.Body collapsible>
  //             <p>Seats Left: {driver.seatsAvailable}</p>
  //             <p>Riders: {_.isEmpty(riders) ? "There are no riders" : this.renderRiders(riders, church_id, driver.id)}</p>
  //           </Panel.Body>
  //         </Panel>
  //     );
  //   });
  //   return driversList;
  // }