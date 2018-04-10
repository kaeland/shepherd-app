import React from 'react';
import { Divider, Grid, Message } from 'semantic-ui-react';

export const NotFoundPage = () => {
  return (
    <Grid>
      <Grid.Row centered>
        <Grid.Column width={14}>
          <Message info >
            <Message.Header style={{ display: 'flex', justifyContent: 'center' }}>404 Page Not Found</Message.Header>
            <Message.Content style={{ display: 'flex', justifyContent: 'center' }}>
              <p>Woops! Try the back button to navigate to another page. </p>
            </Message.Content>
          </Message>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}