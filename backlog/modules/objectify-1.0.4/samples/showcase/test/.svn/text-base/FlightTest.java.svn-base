import models.City;
import models.Flight;
import org.junit.Before;
import org.junit.Test;
import play.modules.objectify.Datastore;
import play.modules.objectify.ObjectifyFixtures;
import play.test.UnitTest;

/**
 * @author David Cheong
 * @since 12/10/2010
 */
public class FlightTest extends UnitTest {

    @Before
    public void setup() {
        ObjectifyFixtures.deleteAll();
    }
    
    @Test
    public void should_insert_flight() {
        Flight flight = put();
        assertNotNull("Flight id is null", flight.id);
    }

    @Test
    public void should_find_flight_by_id() {
        Flight flight = put();
        Flight retrievedFlight = Datastore.find(flight.key());
        assertNotNull("Flight is null", retrievedFlight);
        assertNotNull("Flight id is null", retrievedFlight.id);
        assertEquals("Flight id not correct", flight.id, retrievedFlight.id);
        assertEquals("Flight origin not correct", flight.origin, retrievedFlight.origin);
        assertEquals("Flight destination not correct", flight.destination, retrievedFlight.destination);
        assertNotNull("Flight note is null", flight.note);
    }

    @Test
    public void should_find_flight_by_pilot() {
        Flight flight = put();
        Flight retrievedFlight = Datastore
                .query(Flight.class)
                .filter("pilot", "Dave")
                .get();
        assertNotNull("Flight is null", retrievedFlight);
        assertEquals("Flight id not correct", flight.id, retrievedFlight.id);
    }

    @Test
    public void should_delete_flight() {
        put();
        Flight retrievedFlight = Datastore
                .query(Flight.class)
                .filter("pilot", "Dave")
                .get();
        assertNotNull("Flight is null", retrievedFlight);
        Datastore.delete(retrievedFlight);
        retrievedFlight = Datastore
                .query(Flight.class)
                .filter("pilot", "Dave")
                .get();
        assertNull("Flight is not null", retrievedFlight);
    }

    private Flight put() {
        Flight flight = TestModelBuilder.createSimpleFlight("Dave", City.AUCKLAND, City.LONDON);
        Datastore.put(flight);
        return flight;
    }

}
