import React, { Component } from "react";
import axios from "axios";

const url = "http://localhost:1050/bookFlight/"; 
const url1 = "http://localhost:1050/getFlightIds/";

class CreateBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        customerId: "",
        flightId: "",
        noOfTickets: ""
      },
      formerrorMessageMessage: {
        customerIdError: "",
        flightIdError: "",
        noOfTicketsError: ""
      },
      formValid: {
        customerId: false,
        flightId: false,
        noOfTickets: false,
        buttonActive: false
      },
      flightIds:[],
      errorMessageMessage: "",
      successMessage: "",
      
    };
    
  }

  submitBooking = () => {
    /* 
      Make a POST request to http://localhost:1050/bookFlight/ with form data 
      and handle success and errorMessage cases 
    */
   var json={
    customerId:this.state.form.customerId,
    flightId:this.state.form.flightId,
    noOfTickets:this.state.form.noOfTickets
   }
   axios.post(url,json).then((response)=>
   {
     this.setState({successMessage:response.data.message,errorMessageMessage:""})
   }).catch((errorMessage)=>
   {
    if(errorMessage.response)
    {
      this.setState({errorMessageMessage:errorMessage.response.data.message,successMessage:""})
    }
   })
  }

  fetchFlightIds = () => {
    /* 
      Make a axios GET request to http://localhost:1050/getFlightIds/ to fetch the flightId's array 
      from the server and handle the success and errorMessage cases appropriately 
    */
   axios.get(url1).then((response)=>
   {

    this.setState({flightIds:response.data})
   }).catch((errorMessage)=>
   {
     if(errorMessage.response)
     {
       this.setState({errorMessageMessage:errorMessage.response.data.message})
     }
     else
     {
      this.setState({errorMessageMessage:"Please start your Express server",successMessage:""})
     }
   })
  }
componentDidMount()
{
  this.fetchFlightIds()
}
  handleSubmit = event => {
    /* prevent page reload and invoke submitBooking() method */
  
    event.preventDefault();
    this.submitBooking()

  
  }

  handleChange = event => {
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
    /* Perform Validations and assign errorMessage messages, Also, set the value of buttonActive after validation of the field */
   let err=""
    let formerrorMessage=this.state.formerrorMessageMessage
    let formvalid=this.state.formValid
    if(fieldName==="customerId")
    {
          if(value.length==0)
          {
            err="Field Required"
          }
          else if(!(value.match(/^[A-Z][0-9]{4}/)))
          { 
            err ="Customer Id must start with an alphabet followed by 4 digits"
           }
           formvalid.customerId=err?false:true
           formerrorMessage.customerIdError=err
           this.setState({formerrorMessageMessage:formerrorMessage})
    }
    else if(fieldName==="flightId")
    {
  
        if(value==="--Select Flight--")
        {
          err="Select a Flight"
        }
        formvalid.flightId=err?false:true
        formerrorMessage.flightIdError=err
        this.setState({formerrorMessageMessage:formerrorMessage})
    }
    else
    {
        if(value.length===0)
        {
          err="field required"
        }
        else if(!(value>=1 && value<10))
        {
          err="No of tickets should be greater than 0 and less than 10"
        }
        formvalid.noOfTickets= err?false:true
        formerrorMessage.noOfTicketsError= err
        this.setState({formerrorMessageMessage:formerrorMessage})
    }
    formvalid.buttonActive=formvalid.noOfTickets&&formvalid.flightId&&formvalid.customerId
    this.setState({formValid:formvalid})
  }

  render() {
    return (
      <div className="CreateBooking ">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <br />
            <div className="card">
              <div className="card-header bg-custom">
                <h3>Flight Booking Form</h3>
              </div>
              <div className="card-body">
                {/* create form as per the view given in screenshots */}
                {/* Display success or errorMessage messages as given in QP */}
                <form >
                <div className="form-group">
                  
                   <label>Customer Id</label>
                   <input className="form-control" placeholder="e.g- P1001" name="customerId" value={this.state.form.customerId} onChange={this.handleChange}/>
                   <span style={{color:"red"}} name="customerIdError">{this.state.formerrorMessageMessage.customerIdError}</span>
                 </div>
                 <div className="form-group">
                   <label>Flight Id</label>
                   <select className="form-control"  name="flightId" value={this.state.form.flightId} onChange={this.handleChange}>
                     <option value='--Select Flight--'>--Select Flight-- </option>
                     if(!(this.state.flightIds.length===0))
                    {this.state.flightIds.map((val)=>{return(<option value={val}>{val}</option>)}) }
                    
                   </select>
                   <span style={{color:"red"}} name="flightIdError">{this.state.formerrorMessageMessage.flightIdError}</span>
                   </div>
                   <div className="form-group">
                     <label>Number of ticket</label>
                     <input className="form-control" placeholder="min-1 max-10" name="noOfTickets" value={this.state.form.noOfTickets} onChange={this.handleChange}/>
                     <span style={{color:"red"}} name="noOfTicketsError">{this.state.formerrorMessageMessage.noOfTicketsError}</span>
                   </div>
                   <div className="form-group">
                        <button type="button" onClick={this.handleSubmit} className="btn btn-primary" disabled={!(this.state.formValid.buttonActive)}>Book Flight</button>
                   </div>
                 </form>
               <span style={{color:"red"}} name="errorMessage">  {this.state.errorMessageMessage} </span>
              <span style={{color:"green"}} name="successMessage">   {this.state.successMessage} </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default CreateBooking;