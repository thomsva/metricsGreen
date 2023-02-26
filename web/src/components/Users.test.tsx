import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import USERS from '../graphQl/queries/USERS';
import UserList from './Users';

const fakeUser1 = {
  id: 1,
  username: 'Don',
  email: 'don@scdp.com',
  role: 'USER'
};
const fakeUser2 = {
  id: 2,
  username: 'Peggy',
  email: 'peggy@scdp.com',
  role: 'ADMIN'
};

const mocks = [
  {
    request: {
      query: USERS
    },
    result: {
      data: {
        users: [fakeUser1, fakeUser2]
      }
    }
  }
];

const errorMocks = [
  {
    request: {
      query: USERS
    },
    result: {
      errors: [new GraphQLError('errmsg')]
    }
  }
];

const container = document.createElement('div');
document.body.appendChild(container);
describe('the component', () => {
  it('renders the correct elements', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserList />
      </MockedProvider>
    );
    expect(await screen.findByTestId('username1')).toBeDefined();
    expect(await screen.findByTestId('email1')).toBeDefined();
    expect(await screen.findByTestId('role1')).toBeDefined();
    expect(await screen.findByTestId('username2')).toBeDefined();
    expect(await screen.findByTestId('email2')).toBeDefined();
    expect(await screen.findByTestId('role2')).toBeDefined();
  });

  it('renders the correct content', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserList />
      </MockedProvider>
    );
    expect(await screen.findByText(fakeUser1.username)).toBeDefined();
    expect(await screen.findByText(fakeUser1.email)).toBeDefined();
    expect(await screen.findByText(fakeUser1.role)).toBeDefined();
    expect(await screen.findByText(fakeUser2.username)).toBeDefined();
    expect(await screen.findByText(fakeUser2.email)).toBeDefined();
    expect(await screen.findByText(fakeUser2.role)).toBeDefined();
  });

  it('handles GrapgQL errors correctly', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <UserList />
      </MockedProvider>
    );
    expect(await screen.findAllByTestId('usersDataError')).toBeDefined();
    expect(await screen.findByText('errmsg')).toBeDefined();
  });
});
