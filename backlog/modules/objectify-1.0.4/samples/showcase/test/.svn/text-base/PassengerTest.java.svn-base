import models.City;
import models.Flight;
import models.Passenger;
import org.junit.Before;
import org.junit.Test;
import play.modules.objectify.Datastore;
import play.modules.objectify.ObjectifyFixtures;
import play.test.UnitTest;

/**
 * @author David Cheong
 * @since 12/10/2010
 */
public class PassengerTest extends UnitTest {

    @Before
    public void setup() {
        ObjectifyFixtures.deleteAll();
    }

    @Test
    public void should_insert_passenger() {
        Passenger passenger = put();
        assertNotNull("Passenger id is null", passenger.id);
    }

    @Test
    public void should_find_passenger_by_id() {
        Passenger passenger = put();
        Passenger retrievedPassenger = Datastore.find(passenger.key());
        assertNotNull("Passenger is null", retrievedPassenger);
        assertNotNull("Passenger id is null", retrievedPassenger.id);
        assertEquals("Passenger id not correct", passenger.id, retrievedPassenger.id);
        assertEquals("Passenger first name not correct", "Joe", retrievedPassenger.firstName);
    }

    @Test
    public void should_find_passenger_by_firstName() {
        Passenger passenger = put();
        Passenger retrievedPassenger = Datastore
                .query(Passenger.class)
                .filter("firstName", "Joe")
                .get();
        assertNotNull("Passenger is null", retrievedPassenger);
        assertNotNull("Passenger id is null", retrievedPassenger.id);
        assertEquals("Passenger id not correct", passenger.id, retrievedPassenger.id);
    }

    @Test
    public void should_find_passenger_by_flight() {
        Passenger passenger = put();
        Passenger retrievedPassenger = Datastore
                .query(Passenger.class)
                .ancestor(passenger.flight)
                .get();
        assertNotNull("Passenger is null", retrievedPassenger);
        assertNotNull("Passenger id is null", retrievedPassenger.id);
        assertEquals("Passenger id not correct", passenger.id, retrievedPassenger.id);
    }

    @Test
    public void should_delete_passenger() {
        put();
        Passenger retrievedPassenger = Datastore
                .query(Passenger.class)
                .filter("firstName", "Joe")
                .get();
        assertNotNull("Passenger is null", retrievedPassenger);
        Datastore.delete(retrievedPassenger);
        retrievedPassenger = Datastore
                .query(Passenger.class)
                .filter("firstName", "Joe")
                .get();
        assertNull("Passenger is not null", retrievedPassenger);
    }

    private Passenger put() {
        Flight flight = TestModelBuilder.createSimpleFlight("Dave", City.AUCKLAND, City.LONDON);
        Datastore.put(flight);
        Passenger passenger = TestModelBuilder.createSimplePassenger("Joe", flight.key());
        Datastore.put(passenger);
        return passenger;
    }


}
