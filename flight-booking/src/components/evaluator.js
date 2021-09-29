import React, { Component } from 'react'
import "../App.css";
import axios from 'axios';

class Evaluator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbMessage: null,
            testData: "",
            errorMessage:""
        }
    }

    setUpDb = () => {
        this.setState({ dbMessage: null })
        axios.get("http://localhost:1050/setupDb").then(response => {
            this.setState({ dbMessage: response.data })
        }).catch(error => {
            if(error.response){
                return error.response.data.message
            }else{
                return "server error"
            }
        })
    }

    displayMyReport = () => {
        let reportJSON = this.state.testData;
        let displayArray = []; let id = 1; let styling = {}; let symbol = "";
        if (reportJSON) {
            for (let test of reportJSON.testResult[0].assertionReport) {
                let addtext = "";
                if (test.status === "passed") {
                    styling = { "color": "green" }
                    symbol = <span>&#10003;</span>
                    addtext = ""
                } else if (test.status === "failed") {
                    addtext = "Check if "
                    styling = { "color": "red" }
                    symbol = <span>&#9747;</span>
                }
                let element = (<tr key={id} style={styling}>
                    <td key={test.status} align="center"><h3>{symbol}</h3></td>
                    <td key={test.testName}><h6>{addtext + test.testName}</h6></td>
                </tr>)
                displayArray.push(element);
                id++;
            }
            return displayArray;
        } else {
            console.log("something broke!!")
            // this.setState({ evaluationStatus: "Please start the evaluation server first" })
        }
    }

    fetchReport = () => {
        return axios.get("http://localhost:1050/evaluate")
            .then((response) => {  return response.data })
            .catch(err => { this.setState({ testData: null }); return this.state.testData });
    }

    evaluate = () => {
        this.setState({ testData: null });
        return this.fetchReport().then((data) => {
            return this.setState({ testData: data });
        }).catch((err) => {
            return null
        })
    }

    render() {
        return (
            <div>
                {/* Message at the top after db setup */}
                {this.state.dbMessage ? (
                    <div className="col-md-5 offset-3">
                        <div className="alert alert-info alert-dismissible" id="alert">
                            <button type="button" className="close" data-dismiss="alert">&times;</button>
                            <strong>{this.state.dbMessage}</strong>
                        </div>
                    </div>
                ) : null}

                {/* Displays the button at the bottom right corner */}
                <div className="adminActions">
                    <input type="checkbox" name="adminToggle" className="adminToggle" />
                    <a className="adminButton" href="#!"><img src={require("../assets/test.png")} alt="admin button comes here" height="40px" width="55px" /></a>
                    <div className="adminButtons">
                        <a title="Setup DB" href="#!" onClick={this.setUpDb}><img src={require("../assets/db.png")} alt="setup button comes here" height="27px" width="30px" /></a>
                        <a title="Evaluate" href="#!" data-toggle="modal" data-target="#myModal" onClick={this.evaluate}><img src={require("../assets/search.png")}
                            alt="evaluator button comes here" height="27px" width="30px" /></a>
                    </div>
                </div>

                <div id="myModal" className="modal fade" role="dialog">
                    <div className="modal-dialog modal-lg">

                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Code analyser</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body bg">
                                <div className="row" id="load">
                                    <div className="col-md-9 offset-1 text-center">
                                        {
                                            this.state.testData ? (
                                                <div>
                                                    <table className="table table-bordered" id="result" width="100px">
                                                        <thead>
                                                            <tr>
                                                                <th colSpan={2}>
                                                                    <h3>Your Structural Report</h3>
                                                                </th>
                                                            </tr>
                                                            <tr>
                                                                <th><h5>STATUS</h5></th>
                                                                <th><h5>TEST NAME</h5></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.displayMyReport()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                    <div>
                                                        <div className="form-group">
                                                            <img src={require("../assets/gears.gif")} alt="Loading..." />
                                                        </div>
                                                        <div className="form-group">
                                                            <h4 id="loading" className="text-center">Verifying code please wait .....</h4>
                                                        </div>
                                                    </div>
                                                )
                                        }
                                    </div>
                                </div >
                            </div >
                        </div >

                    </div>
                </div>
            </div>

        )
    }
}


export default Evaluator;