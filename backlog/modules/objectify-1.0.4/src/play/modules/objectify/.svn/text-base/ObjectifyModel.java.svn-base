package play.modules.objectify;

import com.googlecode.objectify.Key;
import play.db.Model;

import java.lang.reflect.Field;

/**
 * The base model for all managed entities, with some convenience methods to simplify application code. Of
 * particular importance is only subclasses of <code>ObjectifyModel</code> is handled by {@link play.modules.objectify.ObjectifyBinder}.
 *
 * @author David Cheong
 * @since 22/04/2010
 * @see play.modules.objectify.ObjectifyBinder
 */
@SuppressWarnings({"unchecked", "UnusedDeclaration"})
public abstract class ObjectifyModel<T extends ObjectifyModel> implements Model {

    /**
     * Returns the {@link Key} associated with this entity instance.
     *
     * @return the key
     */
    public Key<T> getKey() {
        return ObjectifyService.getKey(this);
    }

    /**
     * An alias of {@link #getKey()}.
     *
     * @return the key
     */
    public Key<T> key() {
        return ObjectifyService.key(this);
    }

    /**
     * Returns the string representation of the {@link Key} associated with this entity instance.
     *
     * @return the key string
     */
    public String getKeyStr() {
        return ObjectifyService.getKeyStr(this);
    }

    /**
     * An alias of {@link #getKeyStr()}.
     *
     * @return the key string
     */
    public String keyStr() {
        return ObjectifyService.keyStr(this);
    }

    /**
     * An alias of {@link #getKeyStr()}.
     *
     * @return the key string
     */
    public String str() {
        return ObjectifyService.keyStr(this);
    }

    /**
     * Returns the key field.
     *
     * @return the key field
     */
    public Field getKeyField() {
        return Utils.getKeyField(this.getClass());
    }

    /**
     * Returns the key type.
     *
     * @return the key type
     */
    public Class getKeyType() {
        return Utils.getKeyType(this.getClass());
    }

    /**
     * Internal save method.
     */
    public void _save() {
        Datastore.put(this);
    }

    /**
     * Internal delete method.
     */
    public void _delete() {
        Datastore.delete(this);
    }

    /**
     * Internal get key method.
     *
     * @return the key
     */
    public Object _key() {
        return getKeyStr();
    }

    /**
     * Extension of the standard {@link Model.Factory}.
     */
    public interface Factory extends Model.Factory {

        /**
         * Specifies the class to manage.
         *
         * @param modelClass the model class
         */
        void init(Class<? extends Model> modelClass);

    }

}
