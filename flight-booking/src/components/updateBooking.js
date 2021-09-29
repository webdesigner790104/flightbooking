import React, { Component } from "react";
import axios from "axios";

const url = "http://localhost:1050/updatebooking/";

class UpdateBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                bookingId: "",
                noOfTickets: ""
            },
            formErrorMessage: {
                bookingId: "",
                noOfTickets: ""
            },
            formValid: {
                bookingId: true,
                noOfTickets: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            id: this.props.match.params.bookingId
        };
    }


    updateBooking = () => {
        /* 
          Make a axios PUT request to http://localhost:1050/updatebooking/ to update the number of tickets 
          for the selected bookingId and handle the success and error cases appropriately 
        */
    }

    handleSubmit = (event) => {
        /* prevent page reload and invoke updateBooking() method */
    }

    handleChange = (event) => {
        /* 
          invoke whenever any change happens any of the input fields
          and update form state with the value. Also, Inoke validateField() method to validate the entered value
        */
       
    }

    validateField = (fieldName, value) => {
        /* Perform Validations and assign error messages, Also, set the value of buttonActive after validation of the field */
    }

    render() {
        return (
            <React.Fragment>
                <div className="UpdateBooking">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <br />
                            <div className="card">
                                <div className="card-header bg-custom">
                                    <h4>Update Flight Booking for id: {this.state.id}</h4>
                                </div>
                                <div className="card-body">
                                    {/* code appropriately to render the form as shown in QP */}
                                    {/* display the success and error messages appropriately */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UpdateBooking;

import React, { Component } from "react";
import axios from "axios";
import {  Redirect } from 'react-router-dom';
const url = "http://localhost:1050/updatebooking/";

class UpdateBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                bookingId: "",
                noOfTickets: ""
            },
            formErrorMessage: {
                bookingId: "",
                noOfTickets: ""
            },
            formValid: {
                bookingId: true,
                noOfTickets: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            id: this.props.match.params.bookingId
        };
    }


    updateBooking = () => {
        /* 
          Make a axios PUT request to http://localhost:1050/updatebooking/ to update the number of tickets 
          for the selected bookingId and handle the success and error cases appropriately 
        */
       var json={
           noOfTickets:this.state.form.noOfTickets
       } 
       axios.put(url+this.props.match.params.bookingId,json).then((response)=>{
        this.setState({successMessage:response.data.message,errorMessage:""})
       }).catch((errorMessage)=>
       {
        if(errorMessage.response)
        {
          this.setState({errorMessage:errorMessage.response.data.message,successMessage:""})
        }
       })
    }

    handleSubmit = (event) => {
        /* prevent page reload and invoke updateBooking() method */
        event.preventDefault()
        this.updateBooking()

    }

    handleChange = (event) => {
        /* 
          invoke whenever any change happens any of the input fields
          and update form state with the value. Also, Inoke validateField() method to validate the entered value
        */
       let {name,value}=event.target
       let formval=this.state.form
       formval[name]=value
       this.setState({form:formval})
       this.validateField(name,value)
    }

    validateField = (fieldName, value) => {
        /* Perform Validations and assign error messages, Also, set the value of buttonActive after validation of the field */
        let err=""
    let error=this.state.formErrorMessage
    let error1=this.state.formValid
        if(fieldName==="noOfTickets")
        {
            if(value.length===0)
            {
                err="Field required"
            }
         else if(!(value>=1 && value<10))
              {
                  err="No of tickets should be greater than 0 and less than 10"
              }
              error.noOfTickets=err
              this.setState({formErrorMessage:error})
              error1.noOfTickets=err?false:true
              
        }
        error1.buttonActive=error1.noOfTickets&&error1.bookingId
        this.setState({formValid:error1})
    }
componentDidMount()
{
    var k=this.state.id
    var k1=this.state.form
    k1["bookingId"]=k
    this.setState({form:k1})
}
    render() {
        return (
            <React.Fragment>
                <div className="UpdateBooking">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <br />
                            <div className="card">
                                <div className="card-header bg-custom">
                                    <h4>Update Flight Booking for id: {this.state.id}</h4>
                                </div>
                                <div className="card-body">
                                    {/* code appropriately to render the form as shown in QP */}
                                    {/* display the success and error messages appropriately */}
                                    <form>

                                        <div className="form-group"> 
                                        <label>bookingId</label>
                                          <input className="form-control" value={this.state.form.bookingId} disabled={true} name="bookingId" onChange={this.handleChange}/>
                                        
                                        </div>
                                        <div className="form-group">
                                         <label>Number of Tickets</label>
                                         <input className="form-control" name="noOfTickets" value={this.state.form.noOfTickets} placeholder="min-1 max-10"  onChange={this.handleChange}/>
                                         <span style={{color:"Red"}}>{this.state.formErrorMessage.noOfTickets}</span>
                                        </div>
                                        <div className="form-group">
                                            <button type="button" className="btn btn-primary" disabled={!(this.state.formValid.buttonActive)} onClick={this.handleSubmit}>Update Booking</button>
                                        </div>
                                    </form>
                                    <span style={{color:"red"}}>{this.state.errorMessage}</span>
                                    <span style={{color:"green"}}>{this.state.successMessage}</span>
                                </div>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UpdateBooking;