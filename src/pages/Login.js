import React from 'react';
import '../css/Login.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import logo from '../trivia.png';
import * as actions from '../redux/actions';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      name: '',
      statusName: false,
      statusEmail: false,
      redirect: null,
    };

    this.readForm = this.readForm.bind(this);
    this.validEmail = this.validEmail.bind(this);
    this.validName = this.validName.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  readForm(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({
      [e.target.name]: value,
    }, () => this.validationAll());
  }

  // lógica adaptada de https://pt.stackoverflow.com/questions/1386/express%C3%A3o-regular-para-valida%C3%A7%C3%A3o-de-e-mail
  validEmail() {
    const { email } = this.state;
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/igm)) {
      this.setState({
        statusEmail: false,
      });
    } else {
      this.setState({
        statusEmail: true,
      });
    }
  }

  validName() {
    const { name } = this.state;
    const number = 1;
    if (name.length < number) {
      this.setState({
        statusName: false,
      });
    } else {
      this.setState({
        statusName: true,
      });
    }
  }

  validationAll() {
    this.validEmail();
    this.validName();
  }

  async startGame() {
    const { saveLogin, fetchToken } = this.props;
    const { email, name } = this.state;
    saveLogin(email, name);
    await fetchToken();
    this.setState({
      redirect: '/game',
    });
  }

  renderHeader() {
    return (
      <header className="login-header-container">
        <img src={ logo } className="login-logo" alt="logo" />
        <p className="login-text"> SUA VEZ </p>
      </header>
    );
  }

  renderLogin() {
    return (
      <>
        <div className="input">
          <input
            type="input"
            name="name"
            placeholder="Digite seu nome"
            data-testid="input-player-name"
            onChange={ this.readForm }
            required
          />
        </div>
        <div className="input">
          <input
            type="email"
            name="email"
            placeholder="Digite seu e-mail"
            data-testid="input-gravatar-email"
            onChange={ this.readForm }
            required
          />
        </div>
      </>
    );
  }

  render() {
    const { statusName, statusEmail, redirect } = this.state;
    if (redirect) {
      return (
        <Redirect to={ redirect } />
      );
    }
    return (
      <div className="total-page">
        <section className="login-container">
          {this.renderHeader()}
          {this.renderLogin()}
          <div className="input">
            <p className="butons-login-container">
              <button
                type="button"
                data-testid="btn-play"
                disabled={ !statusEmail || !statusName }
                onClick={ this.startGame }
              >
                Jogar
              </button>
            </p>
          </div>
        </section>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveLogin: (email, name) => dispatch(actions.saveLogin(email, name)),
  fetchToken: () => dispatch(actions.fetchToken()),
});

Login.propTypes = {
  saveLogin: PropTypes.func,
  fetchToken: PropTypes.func,
}.isRequired;

export default connect(null, mapDispatchToProps)(Login);
