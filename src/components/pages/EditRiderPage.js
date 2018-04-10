import React from 'react';
import {
  Grid, Message, Button,
  Segment, Container, Header,
  Form, Confirm
} from 'semantic-ui-react';
import database from '../../firebase/firebase';

class EditRiderPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      open: false
    };

    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Confirm Modal 
  show = () => this.setState({ open: true })
  handleConfirm = (e) => this.onDelete(e)
  handleCancel = () => this.setState({ open: false })
  // --- //

  onFirstNameChange(e) {
    const firstName = e.target.value;
    this.setState(() => ({ firstName }));
  }

  onLastNameChange(e) {
    const lastName = e.target.value;
    this.setState(() => ({ lastName }));
  }

  onDelete(e) {
    e.preventDefault();
    const church_id = this.props.match.params.church_id;
    const driver_id = this.props.match.params.driver_id;
    const rider_id = this.props.match.params.rider_id;
    const driversSeatsString = `churches/${church_id}/drivers/${driver_id}/seatsAvailable`;
    const driversSeatsRef = database.ref(driversSeatsString);
    const ridersRefString = `churches/${church_id}/drivers/${driver_id}/riders/${rider_id}`;
    const ridersRef = database.ref(ridersRefString);
    driversSeatsRef.transaction((currentSeatsAvailable) => {
      ridersRef.remove();
      return currentSeatsAvailable + 1;
    });
    this.props.history.push(`/drivers/${church_id}`);
  }

  handleSubmit(e) {
    e.preventDefault();
    const church_id = this.props.match.params.church_id;
    const driver_id = this.props.match.params.driver_id;
    const rider_id = this.props.match.params.rider_id;
    const ridersRefString = `churches/${church_id}/drivers/${driver_id}/riders/${rider_id}`;
    const ridersRef = database.ref(ridersRefString);
    const rider = {
      firstName: this.state.firstName.trim(),
      lastName: this.state.lastName.trim()
    };
    ridersRef.update(rider);
    this.props.history.push(`/drivers/${church_id}`);
  }


  componentDidMount() {
    // Try const { church_id, driver_id, rider_id } = this.props.match.params here:
    const church_id = this.props.match.params.church_id;
    const driver_id = this.props.match.params.driver_id;
    const rider_id = this.props.match.params.rider_id;
    console.log(church_id, driver_id, rider_id);
    const ridersRefString = `churches/${church_id}/drivers/${driver_id}/riders/${rider_id}`;
    const ridersRef = database.ref(ridersRefString);
    ridersRef.once('value', (snapshot) => {
      // Try const { firstName, lastName } = snapshot.val() here:
      console.log(snapshot.val());
      const rider = snapshot.val();
      this.setState(() => ({
        firstName: rider.firstName,
        lastName: rider.lastName
      }));
    });
  }

  render() {


    return (
      <Grid>
      
        {/*Confirm deletion of the rider*/}
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
              <p>Edit a rider below...</p>
            </Message>
          </Grid.Column>
        </Grid.Row>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Form onSubmit={this.handleSubmit}>

              <Form.Field>
                <label>First Name</label>
                <input placeholder="First Name" type="text" value={this.state.firstName} onChange={this.onFirstNameChange} />
              </Form.Field>

              <Form.Field>
                <label>Last Name</label>
                <input placeholder="Last Name" type="text" value={this.state.lastName} onChange={this.onLastNameChange} />
              </Form.Field>

              <Button type="submit" primary>Add</Button>
              <Button type="button" color="red" onClick={this.show}>Delete Rider</Button>
            </Form>
          </Grid.Column>
        </Grid.Row>

      </Grid>
    );
  }
}

export default EditRiderPage;