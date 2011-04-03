package play.modules.objectify;

import play.Play;
import play.classloading.ApplicationClasses;
import play.db.Model;
import play.test.Fixtures;

import java.util.ArrayList;
import java.util.List;

/**
 * A collection of utility methods that aid testing by resetting the datastore
 * to a given test context or fixture.
 *
 * @author David Cheong
 * @since 12/10/2010
 */
public class ObjectifyFixtures {

    /**
     * Deletes all entries for the model types specified.
     *
     * @param types the model types
     */
    public static void delete(Class<? extends Model>... types) {
        if (types != null) {
            for (Class<? extends Model> type : types) {
                Model.Manager.factoryFor(type).deleteAll();
            }
        }
    }

    /**
     * Deletes all entries for the model types specified.
     *
     * @param types the model types
     */
    @SuppressWarnings({"unchecked"})
    public static void delete(List<Class<? extends Model>> types) {
        if (types != null) {
            delete(types.toArray(new Class[types.size()]));
        }
    }

    /**
     * Deletes all entries from all models.
     */
    @SuppressWarnings("unchecked")
    public static void deleteAllModels() {
        List<Class<? extends Model>> classes = new ArrayList<Class<? extends Model>>();
        for (ApplicationClasses.ApplicationClass c : Play.classes.getAssignableClasses(Model.class)) {
            classes.add((Class<? extends Model>)c.javaClass);
        }
        delete(classes);
    }

    /**
     * Deletes all entries from all Objectify models.
     */
    @SuppressWarnings("unchecked")
    public static void deleteAllObjectifyModels() {
        List<Class<? extends Model>> classes = new ArrayList<Class<? extends Model>>();
        for (ApplicationClasses.ApplicationClass c : Play.classes.getAssignableClasses(ObjectifyModel.class)) {
            classes.add((Class<? extends Model>)c.javaClass);
        }
        delete(classes);
    }

    /**
     * Deletes all.
     */
    public static void deleteAll() {
        deleteAllModels();
    }

    /**
     * Loads fixtures from the given YAML file.
     *
     * @param name the YAML file
     */
    public static void load(String name) {
        Fixtures.load(name);
    }

}
