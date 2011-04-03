import models.City;
import models.Flight;
import models.Passenger;
import models.Weather;
import org.junit.Before;
import org.junit.Test;
import play.modules.objectify.Datastore;
import play.modules.objectify.ObjectifyFixtures;
import play.modules.objectify.Utils;
import play.test.UnitTest;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @author David Cheong
 * @since 14/10/2010
 */
public class FixturesTest extends UnitTest {

    @Before
    public void setup() {
        ObjectifyFixtures.deleteAll();
    }

    @Test
    public void should_load_testdata_yml() throws Exception {

        ObjectifyFixtures.load("testdata.yml");

        Flight flight = Datastore.query(Flight.class).get();
        assertNotNull("Flight is null", flight);
        assertEquals("Flight pilot is not correct", "Bob", flight.pilot);
        assertEquals("Flight origin is not correct", City.AUCKLAND, flight.origin);
        assertEquals("Flight note text is not correct", "This is a note", flight.note.text);
        assertTrue("Flight note internal flag is not correct", flight.note.internal);

        List<Passenger> passengers = Utils.asList(Datastore.query(Passenger.class).order("lastName"));
        assertNotNull("Passengers is null", passengers);
        assertEquals("Passengers count is not correct", 2, passengers.size());
        assertEquals("Passenger 1 is not correct", "1", passengers.get(0).lastName);
        assertEquals("Passenger 1 is not correct", "2", passengers.get(1).lastName);

        Weather weather = Datastore.query(Weather.class).get();
        assertNotNull("Weather is null", weather);
        assertNotNull("Weather date is null", weather.date);
        assertEquals("Weather date is null", "2010-01-01", formatDate(weather.date));
        assertNotNull("Weather affected flights is null", weather.affectedFlights);
        assertEquals("Weather affected flights count is null", 1, weather.affectedFlights.size());
        assertEquals("Weather affected flight is not correct", flight.key(), weather.affectedFlights.get(0));

    }

    public String formatDate(Date date) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        return format.format(date);
    }

}
