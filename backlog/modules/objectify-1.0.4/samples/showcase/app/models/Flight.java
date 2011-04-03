package models;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;
import controllers.Application;
import play.data.validation.Required;
import play.db.Model;
import play.modules.objectify.*;
import play.mvc.Scope;

import javax.persistence.Embedded;
import javax.persistence.Id;
import java.util.List;

/**
 * @author David Cheong
 * @since 3/04/2010
 */
@ManagedBy(Flight.Loader.class)
public class Flight extends ObjectifyModel<Flight> {

    @Id public Long id;
    @Required public String pilot;
    public float price;
    @Required public City origin;
    @Required public City destination;
    public List<City> stopovers;
    @Embedded public Note note = new Note();
    public String owner;

    public static Flight findById(Long id) {
        return Datastore.find(Flight.class, id, true);
    }

    public static Flight findById(Long id, boolean newIfNull) {
        return Datastore.find(Flight.class, id, newIfNull);
    }

    public static Query<Flight> findAllByOwner() {
        return Datastore
                .query(Flight.class)
                .filter("owner", Application.getUserEmail ())
                .order("pilot");
    }

    public Key<Flight> save() {
        owner = Application.getUserEmail();
        return Datastore.put(this);
    }

    @Override
    public void _save() {
        save();
    }

    public static void deleteById(Long id) {
        Datastore.beginTxn();
        Passenger.deleteByFlightId(id);
        Datastore.delete(Flight.class, id);
        Datastore.commit();
    }

    public void delete() {
        Datastore.beginTxn();
        Passenger.deleteByFlightId(id);
        Datastore.delete(this);
        Datastore.commit();
    }

    @Override
    public void _delete() {
        delete();
    }

    @Override
    public String toString() {
        return (origin != null ? origin.label : "?") + " - " + (destination != null ? destination.label : "?") + " (" + pilot + ")";
    }

    public class Loader extends ObjectifyModelLoader {

        @Override
        public List<Model> fetch(int offset, int length, String orderBy, String orderDirection, List<String> properties, String keywords, String where) {
            if ("note".equals(orderBy)) {
                orderBy = "note.text";
            }
            if (keywords != null && keywords.length() > 0 && orderBy != null && orderBy.length() > 0) {
                orderBy = null;
                Scope.Flash.current().error("In this example, sorting is disabled when searching with a criteria");
            }
            return super.fetch(offset, length, orderBy, orderDirection, properties, keywords, where);    //To change body of overridden methods use File | Settings | File Templates.
        }

        @Override
        protected Query<? extends Model> prepareFetchQuery(String keywords, String orderBy, String orderDirection) {
            return super.prepareFetchQuery(keywords, orderBy, orderDirection)
                    .filter("owner", Application.getUserEmail());
        }

    }

}
