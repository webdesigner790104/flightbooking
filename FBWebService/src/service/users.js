const db = require('../model/users');
const validator = require('../utilities/validator');
const exec = require('child-process-promise').exec;
const fs = require('fs');
const path = require("path")
const parser = require("./parser");

let fBookingService = {}

fBookingService.evaluate = () => {
    evaluationPath = path.join(__dirname, "../../../flight-booking");
    console.log("Begin testing!!");
    return exec(`cd ${evaluationPath} && npm test`)
        .then((response) => {
            let content = fs.readFileSync("../../flight-booking/testReport.json", 'utf8');
            return parser.generateTestReport(content);
        }).catch((err) => {
            let content = fs.readFileSync("../../flight-booking/testReport.json", 'utf8');
            return parser.generateTestReport(content);
        })
}


fBookingService.getAllFlightIds = () => {
    return db.getAllFlightIds().then(idArray => {
        if (idArray == null) {
            let err = new Error("No flight available for booking");
            err.status = 404;
            throw err;
        } else {
            let fids = [];
            for (let id of idArray) {
                fids.push(id.flightId);
            }
            return fids;
        }
    })
}

fBookingService.bookFlight = (flightBooking) => {
    validator.validateFlightId(flightBooking.flightId);
    return db.checkCustomer(flightBooking.customerId).then((customer) => {
        if (customer == null) {
            let err = new Error("Customer not registered. Register to proceed");
            err.status = 404;
            throw err;
        } else {
            return db.checkAvailability(flightBooking.flightId).then((flight) => {
                if (flight == null) {
                    let err = new Error("Flight Unavailable");
                    err.status = 404;
                    throw err;
                } else if (flight.status == "Cancelled") {
                    let err = new Error("Sorry for the Inconvinience... " + flight.flightId + " is cancelled!!");
                    err.status = 404;
                    throw err;
                } else if (flight.availableSeats == 0) {
                    let err = new Error("Flight " + flight.flightId + " is already full!!");
                    err.status = 400;
                    throw err;
                } else if (flight.availableSeats < flightBooking.noOfTickets) {
                    let err = new Error("Flight almost Full... Only " + flight.availableSeats + " left!!");
                    err.status = 404;
                    throw err;
                } else {
                    flightBooking.bookingCost = flightBooking.noOfTickets * flight.fare;
                    if (customer.walletAmount < flightBooking.bookingCost) {
                        let amountNeeded = flightBooking.bookingCost - customer.walletAmount;
                        let err = new Error("Insufficient Wallet Amount. Add more Rs." + amountNeeded + " to continue booking");
                        err.status = 400;
                        throw err;
                    } else {
                        promise = db.bookFlight(flightBooking);
                        return promise;
                    }
                }
            }).then((bookingId) => {
                return bookingId;
            })
        }
    })
}

fBookingService.getAllBookings = () => {
    return db.getAllBookings().then((bookings) => {
        if (bookings === null) {
            let err = new Error("No Bookings is found in any flight");
            err.status = 404;
            throw err;
        } else {
            let bookingsArray = [];
            for (let booking of bookings) {
                bookingsArray.push(booking.bookings);
            }
            let finalArray = [].concat.apply([], bookingsArray);
            return finalArray;
        }
    })
}

fBookingService.customerBookingsByFlight = (customerId, flightId) => {
    return db.checkCustomer(customerId).then((customer) => {
        if (customer == null) {
            let err = new Error("Invalid CustomerId!! Enter a valid customerId to view Details");
            err.status = 404;
            throw err;
        } else {
            return db.checkAvailability(flightId).then((flight) => {
                if (flight == null) {
                    let err = new Error("Invalid FlightId!! Enter a valid FlightId to view Details");
                    err.status = 404;
                    throw err;
                } else {
                    return db.customerBookingsByFlight(customerId, flightId).then((bookingDetails) => {
                        if (bookingDetails == null) {
                            let err = new Error("No Bookings found for " + customerId + " in " + flightId);
                            err.status = 404;
                            throw err;
                        } else {
                            return bookingDetails;
                        }
                    })
                }
            })
        }
    })
}

fBookingService.getbookingsByFlightId = (flightId) => {
    return db.getbookingsByFlightId(flightId).then((bookings) => {
        if (bookings === null) {
            let err = new Error("No Bookings found in" + flightId);
            err.status = 404;
            throw err;
        } else {
            return bookings;
        }
    })
}

fBookingService.updateBooking = (bookingId, noOfTickets) => {
    return db.checkBooking(bookingId).then((booking) => {
        if (booking == null) {
            let err = new Error("No Bookings with bookingId " + bookingId);
            err.status = 404;
            throw err;
        } else if (booking.status == "Cancelled") {
            let err = new Error("Sorry for the Inconvinience... " + booking.flightId + " has been cancelled!!");
            err.status = 404;
            throw err;
        } else if (booking.availableSeats == 0) {
            let err = new Error("Flight is already Full. Can't Book more tickets");
            err.status = 400;
            throw err;
        } else if (booking.availableSeats < noOfTickets) {
            let err = new Error("Flight almost Full. Only " + booking.availableSeats + " seat left");
            err.status = 400;
            throw err;
        } else {
            for (let i of booking.bookings) {
                if (i.bookingId == bookingId) { custId = i.customerId; break; }
                else continue;
            }
            return db.checkCustomer(custId).then((customer) => {
                if (customer.walletAmount < booking.fare * noOfTickets) {
                    let amountNeeded = booking.fare * noOfTickets - customer.walletAmount;
                    let err = new Error("Insufficient Wallet Amount. Add more Rs." + amountNeeded + " to continue booking");
                    err.status = 400;
                    throw err;
                } else {
                    return db.updateBooking(bookingId, noOfTickets).then((flight) => {
                        if (flight) return flight;
                        else {
                            let err = new Error("update failed");
                            err.status = 500;
                            throw err;
                        }
                    })
                }
            })
        }
    })
}

fBookingService.deleteBooking = (bookingId) => {
    return db.deleteBooking(bookingId).then(bid => {
        if (bid == null) {
            let err = new Error("Could Not cancel the booking");
            err.status = 500;
            throw err;
        } else {
            return bid;
        }
    })
}

module.exports = fBookingService;