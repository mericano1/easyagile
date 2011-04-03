package models;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;
import controllers.Application;
import play.data.validation.Required;
import play.db.Model;
import play.modules.objectify.Datastore;
import play.modules.objectify.ManagedBy;
import play.modules.objectify.ObjectifyModel;
import play.modules.objectify.ObjectifyModelLoader;
import play.mvc.Scope;

import javax.persistence.Embedded;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;
import java.util.List;

/**
 * @author David Cheong
 * @since 09/10/2010
 */
@ManagedBy(Weather.Loader.class)
public class Weather extends ObjectifyModel<Weather> {

    @Id @GeneratedValue public Long id;
    @Required public Date date;
    @Required public City city;
    @Required public String description;
    @Required public int temperature;
    public boolean safeToFly;
    @Embedded public Note note = new Note();
    public List<Key<Flight>> affectedFlights;
    public String owner;

    public Key<Weather> save() {
        owner = Application.getUserEmail();
        return Datastore.put(this);
    }

    @Override
    public void _save() {
        save();
    }

    public class Loader extends ObjectifyModelLoader {

        @Override
        protected Query<? extends Model> prepareFetchQuery(String keywords, String orderBy, String orderDirection) {
            if ("note".equals(orderBy)) {
                orderBy = "note.text";
            }
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
