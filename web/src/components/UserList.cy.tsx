import React from 'react'
import UserList from './UserList'

describe('<UserList />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UserList />)
  })
})