package extensions;

import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import play.modules.objectify.ObjectifyService;
import play.templates.JavaExtensions;

/**
 * Java extensions in templates.
 *
 * @author David Cheong
 * @since 23/04/2010
 */
public class ObjectifyKeyExtensions extends JavaExtensions {

    public static String _key(Enum val) {
        return val.name();
    }

    public static String _key(Key<?> key) {
        return str(key);
    }

    public static String str(Key<?> key) {
        return ObjectifyService.keyStr(key);
    }

    public static <T> T get(Key<T> key) throws EntityNotFoundException {
        return ObjectifyService.get(key);
    }
    
    public static <T> T fetch(Key<T> key) {
        return ObjectifyService.find(key, false);
    }

}
