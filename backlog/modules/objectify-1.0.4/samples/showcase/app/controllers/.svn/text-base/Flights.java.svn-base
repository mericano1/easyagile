package controllers;

import com.googlecode.objectify.Query;
import models.City;
import models.Flight;
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
public class Flights extends Controller {

    @Before
    public static void setup() {
        renderArgs.put("cities", City.values());
    }

    public static void index() {
        Query<Flight> flights = Flight.findAllByOwner();
        render(flights);
    }

    public static void create() {
        Flight flight = new Flight();
        render("Flights/edit.html", flight);
    }

    public static void edit(Long id) {
        Flight flight = Flight.findById(id);
        render(flight);
    }

    public static void save(@Valid Flight flight) {
        //checkAuthenticity();
        if (Validation.hasErrors()) {
            render("@edit", flight);
        }
        else {
            flash.put("msg", "Flight saved successfully");
            flight.save();
            index();
        }
    }

    public static void delete(Long id) {
        //checkAuthenticity();
        Flight.deleteById(id);
        index();
    }

}
