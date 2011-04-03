package models;

import com.google.appengine.api.datastore.QueryResultIterable;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;
import com.googlecode.objectify.annotation.Parent;
import controllers.Application;
import play.data.validation.Required;
import play.db.Model;
import play.modules.objectify.*;
import play.mvc.Scope;

import javax.persistence.Id;

/**
 * @author David Cheong
 * @since 3/04/2010
 */
@ManagedBy(Passenger.Loader.class)
public class Passenger extends ObjectifyModel<Passenger> {

    @Id public Long id;
    @Required public String firstName;
    @Required public String lastName;
    @Required @Parent public Key<Flight> flight;
    public String owner;

    public static Passenger findById(Long flightId, Long id) {
        Key<Passenger> key = Datastore.key(Flight.class, flightId, Passenger.class, id);
        return Datastore.find(key, true);
    }

    public static Query<Passenger> findAllByOwner() {
        return Datastore
                .query(Passenger.class)
                .filter("owner", Application.getUserEmail())
                .order("lastName");
    }

    public static Query<Passenger> findByFlightId(Long flightId) {
        if (flightId != null) {
            return Datastore.query(Passenger.class)
                    .ancestor(Datastore.key(Flight.class, flightId))
                    .order("lastName");
        }
        else {
            return findAllByOwner();
        }
    }

    public Key<Passenger> save() {
        owner = Application.getUserEmail();
        return Datastore.put(this);
    }

    @Override
    public void _save() {
        save();
    }

    public static void deleteByFlightId(Long flightId) {
        QueryResultIterable<Key<Passenger>> passengers = Datastore.query(Passenger.class)
                .ancestor(Datastore.key(Flight.class, flightId))
                .fetchKeys();
        Datastore.delete(passengers);
    }

    public void delete() {
        Datastore.delete(this);
    }

    @Override
    public String toString() {
        return firstName + " " + lastName;
    }

    public class Loader extends ObjectifyModelLoader {

        @Override
        protected Query<? extends Model> prepareFetchQuery(String keywords, String orderBy, String orderDirection) {
            if (keywords != null && keywords.length() > 0 && orderBy != null && orderBy.length() > 0) {
                orderBy = null;
                Scope.Flash.current().error("In this example, sorting is disabled when searching with a criteria");
            }
            return super.prepareFetchQuery(keywords, orderBy, orderDirection)
                    .filter("owner", Application.getUserEmail());
        }

        @Override
        protected Query prepareListModelQuery(String fieldName, Class fieldType) {
            return super.prepareListModelQuery(fieldName, fieldType)
                    .filter("owner", Application.getUserEmail());
        }

    }

}