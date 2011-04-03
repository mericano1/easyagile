package controllers;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;
import models.Flight;
import models.Passenger;
import play.data.validation.Valid;
import play.data.validation.Validation;
import play.mvc.Before;
import play.mvc.Controller;
import play.mvc.With;

/**
 * @author David Cheong
 * @since 3/04/2010
 */
@With(Secure.class)
public class Passengers extends Controller {

    @Before
    public static void setup() {
        renderArgs.put("flights", Flight.findAllByOwner());
    }

    public static void index(Long flightId) {
        Flight flight = Flight.findById(flightId, false);
        Query<Passenger> passengers = Passenger.findByFlightId(flightId);
        render("Passengers/index.html", flight, passengers);
    }

    public static void create(Long flightId) {
        Passenger passenger = new Passenger();
        if (flightId != null) {
            passenger.flight = new Key<Flight>(Flight.class, flightId);
        }
        render("Passengers/edit.html", passenger);
    }

    public static void edit(Long flightId, Long id) {
        Passenger passenger = Passenger.findById(flightId, id);
        if (passenger == null) {
            passenger = new Passenger();
        }
        render(passenger);
    }

    public static void save(@Valid Passenger passenger) {
        //checkAuthenticity();
        if (Validation.hasErrors()) {
            render("@edit", passenger);
        }
        else {
            flash.put("msg", "Passenger saved successfully");
            passenger.save();
            index(passenger.flight.getId());
        }
    }

    public static void delete(Long flightId, Long id) {
        //checkAuthenticity();
        Passenger passenger = Passenger.findById(flightId, id);
        if (passenger != null) {
            passenger.delete();
            index(passenger.flight.getId());
        }
    }

}