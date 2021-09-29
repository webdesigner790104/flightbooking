const express = require('express');
const routing = express.Router();
const create = require('../model/dbsetup');
const flightBookingServ = require('../service/users');
const FlightBooking = require('../model/flightbooking');

// setup db mongoose db
routing.get('/setupDb', (req, res, next) => {
    create.setupDb().then((data) => {
        res.send(data)
    }).catch((err) => {
        next(err)
    })
})

routing.get('/evaluate', (req, res, next) => {
    console.log("Request came!!");
    flightBookingServ.evaluate()
        .then((data) => {
            console.log("Completed success!!");
            res.send(data)
        }).catch((err) => {
            console.log("Completed err!!");
            next(err)
        })
})

routing.get('/getFlightIds', (req, res, next) => {
    flightBookingServ.getAllFlightIds().then(ids => {
        res.json(ids);
    }).catch(err => next(err));
})

//Insert and update
routing.post('/bookFlight', (req, res, next) => {
    const flightBooking = new FlightBooking(req.body);
    flightBookingServ.bookFlight(flightBooking).then((bookingId) => {
        res.json({ "message": "Flight booking is successful with booking Id :" + bookingId });
    }).catch((err) => next(err))
})

// to view all the booking details for all flights
routing.get('/getAllBookings', (req, res, next) => {
    flightBookingServ.getAllBookings().then((bookings) => {
        res.json(bookings);
    }).catch((err) => next(err))
})

//  to view all the bookings by a customer in a particular flight
routing.get('/customerBookings/:customerId/:flightId', (req, res, next) => {
    let customerId = req.params.customerId;
    let flightId = req.params.flightId;
    flightBookingServ.customerBookingsByFlight(customerId, flightId).then((bookings) => {
        res.json(bookings);
    }).catch((err) => next(err))
})

// to view all the bookings in a flight
routing.get('/bookingsByFlight/:flightId', (req, res, next) => {
    let flightId = req.params.flightId;
    flightBookingServ.getbookingsByFlightId(flightId).then((bookings) => {
        res.json(bookings);
    }).catch((err) => next(err))
})


// update the noofTickets for already booked flight ticket
routing.put('/updateBooking/:bookingId', (req, res, next) => {
    let bookingId = parseInt(req.params.bookingId);
    let noOfTickets = parseInt(req.body.noOfTickets);
    flightBookingServ.updateBooking(bookingId, noOfTickets).then((flight) => {
        res.json({ "message": "Booking successfully updated in " + flight.flightId });
    }).catch((err) => next(err))
})

routing.delete('/deleteBooking/:bookingId', (req, res, next) => {
    let bookingId = parseInt(req.params.bookingId);
    flightBookingServ.deleteBooking(bookingId).then(bId => {
        res.json({ "message": "Successfully deleted booking with Id: " + bId })
    }).catch((err) => next(err))
})


module.exports = routing;