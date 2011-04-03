import com.googlecode.objectify.Key;
import models.City;
import models.Flight;
import models.Passenger;

/**
 * @author David Cheong
 * @since 12/10/2010
 */
public class TestModelBuilder {

    public static final String OWNER_1 = "test_1@somewhere.com";
    public static final String OWNER_2 = "test_2@somewhere.com";

    public static Flight createSimpleFlight(String pilot, City origin, City destination) {
        Flight flight = new Flight();
        flight.pilot = pilot;
        flight.origin = origin;
        flight.destination = destination;
        flight.price = 200;
        flight.owner = OWNER_1;
        return flight;
    }

    public static Passenger createSimplePassenger(String firstName, Key<Flight> flight) {
        Passenger passenger = new Passenger();
        passenger.firstName = firstName;
        passenger.lastName = "Passenger";
        passenger.flight = flight;
        passenger.owner = OWNER_1;
        return passenger;
    }

}
