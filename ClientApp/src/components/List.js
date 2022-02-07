import React, { useState } from 'react';
import './List.css';

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            employees: [],
            modifying: false,
            actionsVisible: true,
            modEmployee: { employeeName: '', employeeValue: '' },
            inputEmployee: { employeeName: '', employeeValue: '' }
        };

        this.employeeFieldRef = React.createRef();
        this.inputChanged = this.inputChanged.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    cancelModify() {
        const state = this.state;
        state.modifying = false;
        state.modEmployee = { employeeName: '', employeeValue: '' };
        state.inputEmployee = { employeeName: '', employeeValue: '' };
        this.setState({ state });
    }

    loadData() {
        fetch("http://localhost:5000/employees")
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    dataLoaded: true,
                    employees: data,
                    modifying: false,
                    actionsVisible: true,
                    modEmployee: { employeeName: '', employeeValue: '' },
                    inputEmployee: { employeeName: '', employeeValue: '' }
                })
            })
            .catch(console.log)
    }

    loadListQuery1() {
        fetch("http://localhost:5000/list/query1")
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    dataLoaded: true,
                    employees: data,
                    modifying: false,
                    actionsVisible: true,
                    modEmployee: { employeeName: '', employeeValue: '' },
                    inputEmployee: { employeeName: '', employeeValue: '' }
                })
            })
            .catch(console.log)
    }

    loadListQuery2() {
        fetch("http://localhost:5000/list/query2")
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    dataLoaded: true,
                    employees: data,
                    modifying: false,
                    actionsVisible: false,
                    modEmployee: { employeeName: '', employeeValue: '' },
                    inputEmployee: { employeeName: '', employeeValue: '' }
                })
            })
            .catch(console.log)
    }

    sendData = (e) => {
        e.preventDefault();

        if (this.state.modifying) {
            this.modifyEmployee(this.state.modEmployee);
        } else {
            this.createEmployee(this.state.modEmployee);
        }
    }

    createEmployee() {
        const employeeNewData = { name: this.state.inputEmployee.employeeName, value: this.state.inputEmployee.employeeValue }

        fetch("http://localhost:5000/employees/create", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeNewData)
        })
            .then(response => response.json())
            .then((data) => {
                if (data.StatusCode === 200) {
                    console.log("Employee " + employeeNewData.name + " was created!");
                    this.resetState();
                } else {
                    console.log("ERROR: " + data.Value.Message);
                }
            })
            .catch(console.log)
    }

    modifyEmployee() {
        const employeeToEdit = this.state.modEmployee;
        const employeeNewData = { name: this.state.inputEmployee.employeeName, value: this.state.inputEmployee.employeeValue }

        fetch("http://localhost:5000/employees/modify?name=" + employeeToEdit.employeeName + "&value=" + employeeToEdit.employeeValue, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeNewData)
        })
            .then(response => response.json())
            .then((data) => {
                if (data.StatusCode === 200) {
                    console.log("Employee " + employeeToEdit.employeeName + " was modified!");
                    this.resetState();
                } else {
                    console.log("ERROR: " + data.Value.Message);
                }
            })
            .catch(console.log)
    }

    inputChanged = (e) => {
        const state = this.state;
        state.inputEmployee[e.target.name] = e.target.value;
        this.setState({ state });
    }

    actionModify(employee) {
        const state = this.state;
        state.modEmployee = { employeeName: employee.name, employeeValue: employee.value };
        state.inputEmployee = { employeeName: employee.name, employeeValue: employee.value };
        state.modifying = true;

        this.setState({ state });
        this.employeeFieldRef.current.scrollIntoView();
    }


    actionDelete(employee) {
        fetch("http://localhost:5000/employees/delete?name=" + employee.name + "&value=" + employee.value, { method: "DELETE" })
            .then(response => response.json())
            .then((data) => {
                if (data.StatusCode === 200) {
                    console.log("Employee " + employee.name + " was deleted!");
                    this.resetState();
                } else {
                    console.log("ERROR: " + data.Value.Message);
                }
            })
            .catch(console.log)
    }

    resetState() {
        const state = this.state;
        state.dataLoaded = false;
        state.employees = [];
        state.modEmployee = { employeeName: '', employeeValue: '' };
        state.modifying = false;
        this.setState({ state });
        this.loadData();
    }

    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        💡 SQL Tasks
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <button type="button" className="btn-task btn btn-primary" onClick={() => this.loadListQuery1()}>Execute Query</button>
                            Increment the field Value by 1 where the field Name begins with ‘E’ and by 10 where Name begins with ‘G’ and all others by 100.
                        </li>
                        <li className="list-group-item">
                            <button type="button" className="btn-task btn btn-primary" onClick={() => this.loadListQuery2()}>Execute Query</button>
                            List the sum of all Values for all Names that begin with A, B or C but only present the data where the summed values are greater than or equal to 11171.</li>
                    </ul>
                </div>
                <div ref={this.employeeFieldRef} className="div-container">
                    <form onSubmit={this.sendData}>
                        {this.state.actionsVisible &&
                            <div className="form-group">
                                <h5 className='d-inline'>
                                    {this.state.modifying ?
                                        <span>Modifying Employee {this.state.modEmployee.employeeName}</span>
                                        :
                                        <span>Create Employee</span>
                                    }
                                </h5>
                                {this.state.modifying &&
                                    <button type="button" id='button-cancel-modify' className="btn btn-sm btn-secondary" onClick={() => this.cancelModify()}>Discard changes</button>
                                }


                                <div className="row">
                                    <div className="col-12 col-md-5 spaced-bottom">
                                        <label htmlFor="input">Name</label>
                                        <input type="text" className="form-control" name="employeeName" id="employeeName"
                                            placeholder="" value={this.state.inputEmployee.employeeName} onChange={this.inputChanged} />
                                    </div>
                                    <div className="col-12 col-md-5 spaced-bottom">
                                        <label htmlFor="input2">Value</label>
                                        <input type="text" className="form-control" name="employeeValue" id="employeeValue"
                                            placeholder="" value={this.state.inputEmployee.employeeValue} onChange={this.inputChanged} />
                                    </div>
                                    <div className="col-12 col-md spaced-bottom w-100 d-flex align-items-end">
                                        <button id="button-submit" type="submit" className="btn btn-success w-100">Submit</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </form>

                    {!this.state.dataLoaded ? <div>Loading employees...</div> :
                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Value</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.employees.map(
                                        (employee, index) => (
                                            <tr key={index}>
                                                <td>{employee.name}</td>
                                                <td>{employee.value}</td>
                                                <td>
                                                    <button type="button" className="btn btn-secondary btn-sm" disabled={!this.state.actionsVisible}
                                                        onClick={() => this.actionModify(employee)}>Modify</button>
                                                    <button type="button" className="btn btn-danger btn-sm" disabled={!this.state.actionsVisible}
                                                        onClick={() => this.actionDelete(employee)}>Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>);
    }
}

export default List;