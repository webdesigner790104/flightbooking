import React, { Component } from "react";
import axios from "axios";
import updateBooking from './updateBooking'
import {   Redirect } from 'react-router-dom';

const url = "http://localhost:1050/getAllBookings/";
const url1 = "http://localhost:1050/deleteBooking/";

class GetBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingData: [],
      bookingId: "",
      updateStatus: false,
      errorMessage: "",
      successMessage: ""
    };
  }
componentDidMount()
{
  this.fetchBooking()
}

  updateBooking = (event) => {
    /* update the updateStatus and bookingId state with appropriate values */
  let {value}=event.target;
    this.setState({updateStatus:true})
    this.setState({bookingId:value})
  
  
  
  }

  fetchBooking = () => {
    /* 
      Send an AXIOS GET request to the url http://localhost:1050/getAllBookings/ to fetch all the bookings 
      and handle the success and error cases appropriately 
    */
   axios.get(url).then((response)=>
   {
     this.setState({bookingData:response.data})
     console.log(response.data)
   }).catch((error)=>
   {
     if(error.response)
     this.setState({successMessage:" ",errorMessage:error.response.data.message})
     else
     this.setState({successMessage:" ",errorMessage:"Could not fetch booking data"})
   })
  }

  deleteBooking = (event) => {
    /*
      Send an AXIOS DELETE request to the url http://localhost:1050/deleteBooking/ to delete the selected booking
      and handle the success and error cases appropriately 
    */
   let {value}=event.target
console.log(value)
   axios.delete(url1+value).then((response)=>{
     this.setState({successMessage:response.data.message,errorMessage:""})
     this.fetchBooking()
   }).catch((error)=>
   {
    if(error.response)
    this.setState({successMessage:" ",errorMessage:error.response.data.message})
   })
  }

  render() {
    const { bookingData } = this.state;
if(this.state.updateStatus)
return <Redirect to={"/updateBooking/"+this.state.bookingId} push></Redirect>

    return (
      <div className="GetBooking">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <br />
            <div className="card">
              <div className="card-header bg-custom">
                <h3 align="center">Booking Details</h3>
              </div>
              <div className="card-body">
                {/* code here to get the view as shown in QP for GetBooking component */}
                {/* Display booking data in tabular form */}
                {/* Display error message if the server is not running */}
                {/* code appropriately to redirect on click of update button */}
              
                
                  <span>{this.state.errorMessage}</span>
              
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Customer Id</th>
                        <th>Booking Id</th>
                        <th>Total Tickets</th>
                        <th>Total Cost</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                           {this.state.bookingData.map((ele)=>
                            {
                              return <tr>
                                <td>{ele.customerId}</td>
                                <td>{ele.bookingId}</td>
                                <td>{ele.noOfTickets}</td>
                                <td>{ele.bookingCost}</td>
                                <button className="btn btn-success" style={{marginRight:"10px",marginLeft:"6px"}} onClick={this.updateBooking} value={ele.bookingId}>Update</button>
                                <button className="btn btn-danger" onClick={this.deleteBooking} value={ele.bookingId} >Cancel</button>
                              </tr>
                            })}
                    </tbody>
                    <span style={{color:"red"}}>{this.state.errorMessage}</span>
                    <span style={{color:"green"}}>{this.state.successMessage}</span>
                  </table>
                  
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GetBooking;
