import React, { Component } from 'react';

export const AccountContext = React.createContext({});

class AccountProvider extends Component {
  state = {
    account: {
      email: '',
      api_key: '',
      id: '',
    },
  };

  setAccountContext = accountDetails => {
    this.setState({account: accountDetails});
  };

    render() {
      return (
        <AccountContext.Provider value={{account: this.state.account}}>
            {this.props.children}
        </AccountContext.Provider>
      );
    }
  }
  
export default AccountProvider;