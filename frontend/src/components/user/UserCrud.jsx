import React, { Component } from "react";
import Main from "../template/Main";
import axios from "axios";

const headerProps = {
  icon: "users",
  title: "Usuários",
  subtitle: "Cadastro de usuários: Incluir, Listar, Alterar ou Excluir"
};

const baseURL = "http://localhost:3333/users";
const initialState = {
  user: { name: "", email: "" },
  list: []
};

export default class UserCrud extends Component {
  state = { ...initialState };

  componentWillMount() {
    axios(baseURL).then(resp => {
      this.setState({ list: resp.data });
    });
  }

  clear() {
    this.setState({ user: initialState.user });
  }

  save() {
    const user = this.state.user;
    const method = user.id ? "put" : "post";
    const url = user.id ? `${baseURL}/${user.id}` : baseURL;
    axios[method](url, user).then(resp => {
      // console.log(resp);
      const list = this.getUpdatedList(resp.data);
      this.setState({ user: initialState.user, list });
    });
  }

  getUpdatedList(user) {
    const list = this.state.list.filter(u => u.id !== user.id);
    // console.log(list);
    list.unshift(user);
    return list;
  }

  updateField(event) {
    const user = { ...this.state.user };
    user[event.target.name] = event.target.value;
    this.setState({ user });
  }

  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={this.state.user.name}
                onChange={e => this.updateField(e)}
                placeholder="Digite o nome"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="name">E-mail</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={this.state.user.email}
                onChange={e => this.updateField(e)}
                placeholder="email@example.com"
                autoComplete="off"
              />
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-primary" onClick={e => this.save(e)}>
                Salvar
              </button>

              <button
                className="btn btn-secondary ml-2"
                onClick={e => this.clear(e)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map(user => {
      return (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>
            <button className="btn btn-warning" onClick={() => this.load(user)}>
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn btn-danger ml-2"
              onClick={() => {
                if (
                  window.confirm(
                    `Deseja realmente excluir o usuário ${user.name}?`
                  )
                )
                  this.remove(user);
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  load(user) {
    this.setState({ user });
  }

  remove(user) {
    axios.delete(`${baseURL}/${user.id}`).then(resp => {
      const list = this.state.list.filter(u => u !== user);
      this.setState({ list });
    });
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}
