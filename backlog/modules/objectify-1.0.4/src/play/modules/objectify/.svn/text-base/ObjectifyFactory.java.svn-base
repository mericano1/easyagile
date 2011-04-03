package play.modules.objectify;

import com.google.appengine.api.datastore.KeyFactory;
import com.googlecode.objectify.Key;
import play.Play;

/**
 * A convenient subclass of {@link com.googlecode.objectify.ObjectifyFactory} with better handling of
 * keys and working with Play's dynamic classloaders.
 *
 * @author David Cheong
 * @since 21/04/2010
 */
public class ObjectifyFactory extends com.googlecode.objectify.ObjectifyFactory {

    /**
     * Returns the kind for a given class name.
     *
     * @param className the class name
     * @return the kidn
     */
    @Override
    public String getKind(String className) {
        return super.getKind(loadClass(className));
    }

    /**
     * Loads a class using Play's dynamic classloader.
     *
     * @param clazz the class
     * @param <T> the type
     * @return the loaded class
     */
    public static <T> Class<T> loadClass(Class<T> clazz) {
        return loadClass(clazz.getName());
    }

    /**
     * Loads a class using Play's dynamic classloader.
     *
     * @param name the class name
     * @param <T> the type
     * @return the loaded class
     */
    @SuppressWarnings({"unchecked"})
    public static <T> Class<T> loadClass(String name) {
        try {
            return (Class<T>) Play.classloader.loadClass(name);
        }
        catch (ClassNotFoundException e) {
            throw new RuntimeException("Unable to load class: " + name, e);
        }
    }

    /**
     * Returns a {@link Key} given an input which is a String, <code>Key</code>,
     * {@link com.google.appengine.api.datastore.Key}, a native Java array of entities or
     * an entity instance.
     *
     * @param keyOrEntity the input which can be of several types
     * @param <T> the key type
     * @return the key instance
     */
    public <T> Key<T> getKey(Object keyOrEntity) {
        if (keyOrEntity instanceof String) {
            return rawKeyToTypedKey(KeyFactory.stringToKey((String) keyOrEntity));
        }
        else if (keyOrEntity.getClass().isArray()) {
            return getKey((Object[]) keyOrEntity);
        }
        return super.getKey(keyOrEntity);
    }

    /**
     * Returns a key from a pair of objects representing the entity hierarchy which satisfies the
     * first part of the pair being a kind and the second part of the pair being a
     * {@link String} or {@link Long}.
     *
     * @param pairs the pairs
     * @param <T> the key type
     * @return the key
     */
    @SuppressWarnings({"unchecked"})
    public <T> Key<T> getKey(Object... pairs) {
        Key<?> current = null;
        if (pairs != null) {
            int len = pairs.length;
            if (len % 2 == 1) {
                throw new IllegalArgumentException("Argument not pairs, length: " + len);
            }
            for (int i = 0; i < len; i += 2) {
                Class<?> kind = (Class<?>) pairs[i];
                Object idOrName = pairs[i + 1];
                if (kind == null) {
                    throw new IllegalArgumentException("Key kind must not be null");
                }
                if (idOrName instanceof Long) {
                    current = new Key(current, kind, (Long) idOrName);
                }
                else if (idOrName instanceof String) {
                    current = new Key(current, kind, (String) idOrName);
                }
                else if (idOrName == null) {
                    throw new IllegalArgumentException("Key id must not be null");
                }
                else {
                    throw new IllegalArgumentException("Key id must be either Long or String");
                }
            }
        }
        return (Key<T>) current;
    }

    /**
     * Returns a string representation of a key given an input key or entity.
     *
     * @param keyOrEntity the key or entity
     * @return the key as a string
     */
    public String getKeyStr(Object keyOrEntity) {
        try {
            return keyOrEntity == null ? null : KeyFactory.keyToString(getRawKey(keyOrEntity));
        }
        catch (Exception e) {
            return null;
        }
    }

    /**
     * Returns the raw {@link com.google.appengine.api.datastore.Key} given an input key or entity.
     *
     * @param keyOrEntity the key or entity
     * @return the raw key
     */
    public com.google.appengine.api.datastore.Key getRawKey(Object keyOrEntity) {
        if (keyOrEntity instanceof String) {
            return KeyFactory.stringToKey((String) keyOrEntity);
        }
        return super.getRawKey(keyOrEntity);
    }

}
