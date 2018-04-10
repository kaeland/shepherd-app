import React from 'react';
import {
  Grid, Message, Button,
  Segment, Container, Header,
  Form
} from 'semantic-ui-react';
import database from '../../firebase/firebase';


export default class AddDriverPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      seatsAvailable: ''
    };

    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onSeatsAvailable = this.onSeatsAvailable.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onFirstNameChange(e) {
    const firstName = e.target.value;
    this.setState(() => ({ firstName }));
  }

  onLastNameChange(e) {
    const lastName = e.target.value;
    this.setState(() => ({ lastName }));
  }

  onSeatsAvailable(e) {
    const seatsAvailable = e.target.value;
    this.setState(() => ({ seatsAvailable }));
  }

  handleSubmit(e) {
    e.preventDefault();
    const church_id = this.props.match.params.church_id;
    const driversRefString = `churches/${church_id}/drivers`;
    const driversRef = database.ref(driversRefString);
    const driver = {
      firstName: this.state.firstName.trim(),
      lastName: this.state.lastName.trim(),
      seatsAvailable: this.state.seatsAvailable.trim()
    };
    driversRef.push(driver);
    this.setState(() => ({
      firstName: '',
      lastName: '',
      seatsAvailable: ''
    }));
    this.props.history.push(`/drivers/${church_id}`);
    if (e) {
      console.log(e);
    }
    console.log(this.props.match.params.church_id, 'submitted');
  }

  render() {
    console.log('state:', this.state, 'props:', this.props, 'AddDriverPage');
    // console.log(this.props.match.params.church_id);
    console.log(this);

    return (
      <Grid>

        {/* Row */}
        <Grid.Row centered={true}>
          <Grid.Column width={14}>
            <Message color="blue">
              <p>Add a driver below...</p>
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

              <Form.Field>
                <label>Seats Available</label>
                <input placeholder="Seats Available" type="text" value={this.state.seatsAvailable} onChange={this.onSeatsAvailable} />
              </Form.Field>

              <Button type="submit" primary>Add</Button>
            </Form>
          </Grid.Column>
        </Grid.Row>

      </Grid>
    );
  }
}