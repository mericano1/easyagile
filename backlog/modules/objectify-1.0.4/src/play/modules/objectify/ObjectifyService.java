package play.modules.objectify;

import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Transaction;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.Query;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * A simple service to handle all Objectify operations, working in tandem with {@link ObjectifyFactory} and
 * {@link Objectify}. Whilst this class has some similarities to the the service provided by Objectify, it does 
 * not use it or if constrained by it in any way. Note that this class does not attempt to abstract away
 * either Objectify or the Datastore, only to provide convenience utility methods to aid application development.
 *
 * @author David Cheong
 * @since 20/04/2010
 */
public class ObjectifyService {

    protected static ObjectifyFactory factory = new ObjectifyFactory();

    protected static List<Objectify> stack = new ArrayList<Objectify>();

    /**
     * Loads a class using Play's dynamic classloader.
     *
     * @param clazz the class
     * @param <T> the type
     * @return the loaded class
     */
    @SuppressWarnings({"unchecked"})
    public static <T> T instantiate(Class<T> clazz) {
        return (T) instantiate(clazz.getName());
    }

    /**
     * Loads a class using Play's dynamic classloader.
     *
     * @param className the class name
     * @param <T> the type
     * @return the loaded class
     */
    @SuppressWarnings({"unchecked"})
    public static <T> T instantiate(String className) {
        try {
            return (T) ObjectifyFactory.loadClass(className).newInstance();
        }
        catch (InstantiationException e) {
            throw new RuntimeException("Unable to create new instance of " + className, e);
        }
        catch (IllegalAccessException e) {
            throw new RuntimeException("Unable to create new instance of " + className, e);
        }
    }

    /**
     * See {@link Objectify#get(Iterable)}.
     * 
     * @param keys the keys
     * @param <T> the type
     * @return the entity instances
     */
    public static <T> Map<Key<T>, T> get(Iterable<? extends Key<? extends T>> keys) {
        return objectify().get(keys);
    }

    /**
     * See {@link Objectify#get(com.googlecode.objectify.Key)}.
     * 
     * @param key the key
     * @param <T> the type
     * @return the entity instance
     * @throws EntityNotFoundException if not found
     */
    public static <T> T get(Key<? extends T> key) throws EntityNotFoundException {
        return objectify().get(key);
    }

    /**
     * See {@link Objectify#get(Class, long)}.
     * 
     * @param className the class name
     * @param id the id
     * @param <T> the type
     * @return the entity instance
     * @throws EntityNotFoundException if not found
     */
    @SuppressWarnings({"unchecked"})
    public static <T> T get(String className, Long id) throws EntityNotFoundException {
        return (T) get(loadClass(className), id);
    }

    /**
     * See {@link Objectify#get(Class, String)}.
     * 
     * @param className the class name
     * @param name the name
     * @param <T> the type
     * @return the entity instance
     * @throws EntityNotFoundException if not found
     */
    @SuppressWarnings({"unchecked"})
    public static <T> T get(String className, String name) throws EntityNotFoundException {
        return (T) get(loadClass(className), name);
    }

    /**
     * See {@link Objectify#get(Class, long)}.
     * 
     * @param clazz the class
     * @param id the id
     * @param <T> the type
     * @return the entity instance
     * @throws EntityNotFoundException if not found
     */
    public static <T> T get(Class<? extends T> clazz, Long id) throws EntityNotFoundException {
        return objectify().get(clazz, id);
    }

    /**
     * See {@link Objectify#get(Class, String)}.
     * 
     * @param clazz the class
     * @param name the name
     * @param <T> the type
     * @return the entity instance
     * @throws EntityNotFoundException if not found
     */
    public static <T> T get(Class<? extends T> clazz, String name) throws EntityNotFoundException {
        return objectify().get(clazz, name);
    }

    /**
     * See {@link Objectify#get(Class, Iterable)}.
     * 
     * @param clazz the class
     * @param idsOrNames the ids or names
     * @param <S> the id or name type
     * @param <T> the type
     * @return the entity instances
     */
    public static <S, T> Map<S, T> get(Class<? extends T> clazz, Iterable<S> idsOrNames) {
        return objectify().get(clazz, idsOrNames);
    }

    /**
     * Finds an entity given a key.
     * 
     * @param key the key
     * @param <T> the type
     * @return the entity instance
     */
    @SuppressWarnings({"unchecked"})
    public static <T> T find(Key<? extends T> key) {
        return find(key, false);
    }

    /**
     * Finds an entity given a key, creating a blank instance if required.
     *
     * @param key the key
     * @param newIfNull new instance if not null
     * @param <T> the type
     * @return the entity instance
     */
    @SuppressWarnings({"unchecked"})
    public static <T> T find(Key<? extends T> key, boolean newIfNull) {
        T instance = null;
        if (key == null) {
            throw new IllegalArgumentException("Key may not be null");
        }
        if (key.getId() != 0) {
            instance = objectify().find(key);
        }
        if (instance == null && newIfNull) {
            instance = (T) instantiate(key.getKindClassName());
        }
        return instance;
    }

    /**
     * Finds an entity given enough information to construct a key.
     * 
     * @param className the class
     * @param id the id
     * @param <T> the type
     * @return the entity instance
     */
    @SuppressWarnings({"unchecked"})
    public static <T> T find(String className, Long id) {
        return (T) find(className, id, false);
    }

    /**
     * Finds an entity given enough information to construct a key, creating a blank instance if required.
     *
     * @param className the class
     * @param id the id
     * @param newIfNull new instance if not null
     * @param <T> the type
     * @return the entity instance
     */
    @SuppressWarnings({"unchecked"})
    public static <T> T find(String className, Long id, boolean newIfNull) {
        return (T) find(loadClass(className), id, newIfNull);
    }

    /**
     * Finds an entity given enough information to construct a key.
     * 
     * @param className the class name
     * @param name the name
     * @param <T> the type
     * @return the entity instance
     */
    @SuppressWarnings({"unchecked"})
    public static <T> T find(String className, String name) {
        return (T) find(className, name, false);
    }

    /**
     * Finds an entity given enough information to construct a key, creating a blank instance if required.
     *
     * @param className the class name
     * @param name the name
     * @param newIfNull new instance if not null
     * @param <T> the type
     * @return the entity instance
     */
    @SuppressWarnings({"unchecked"})
    public static <T> T find(String className, String name, boolean newIfNull) {
        return (T) find(loadClass(className), name, newIfNull);
    }

    /**
     * Finds an entity given enough information to construct a key.
     * 
     * @param clazz the class
     * @param id the id
     * @param newIfNull new instance if not null
     * @param <T> the type
     * @return the entity instance
     */
    public static <T> T find(Class<? extends T> clazz, Long id) {
        return find(clazz, id, false);
    }

    /**
     * Finds an entity given enough information to construct a key, creating a blank instance if required.
     *
     * @param clazz the class
     * @param id the id
     * @param newIfNull new instance if not null
     * @param <T> the type
     * @return the entity instance
     */
    public static <T> T find(Class<? extends T> clazz, Long id, boolean newIfNull) {
        T instance = null;
        if (id != null && id != 0) {
            instance = objectify().find(clazz, id);
        }
        if (instance == null && newIfNull) {
            instance = instantiate(clazz);
        }
        return instance;
    }

    /**
     * Finds an entity given enough information to construct a key.
     * 
     * @param clazz the class
     * @param name the name
     * @param <T> the type
     * @return the entity instance
     */
    public static <T> T find(Class<? extends T> clazz, String name) {
        return find(clazz, name, false);
    }

    /**
     * Finds an entity given enough information to construct a key, creating a blank instance if required.
     *
     * @param clazz the class
     * @param name the name
     * @param newIfNull new instance if not null
     * @param <T> the type
     * @return the entity instance
     */
    public static <T> T find(Class<? extends T> clazz, String name, boolean newIfNull) {
        T instance = null;
        if (name != null && name.length() != 0) {
            instance = objectify().find(clazz, name);
        }
        if (instance == null && newIfNull) {
            instance = instantiate(clazz);
        }
        return instance;
    }

    /**
     * See {@link Objectify#put(Object)}.
     * 
     * @param obj the entity instance
     * @param <T> the type
     * @return the saved instance
     */
    public static <T> Key<T> put(T obj) {
        return objectify().put(obj);
    }

    /**
     * See {@link Objectify#put(Iterable)}.
     * 
     * @param objs the entity instances
     * @param <T> the type
     * @return the saved instances
     */
    public static <T> Map<Key<T>, T> put(Iterable<? extends T> objs) {
        return objectify().put(objs);
    }

    /**
     * See {@link Objectify#delete(Object)}.
     * 
     * @param keyOrEntity the key or entity
     */
    public static void delete(Object keyOrEntity) {
        objectify().delete(keyOrEntity);
    }

    /**
     * See {@link Objectify#delete(Iterable)}.
     * 
     * @param keysOrEntities the keys or entities
     */
    public static void delete(Iterable<?> keysOrEntities) {
        objectify().delete(keysOrEntities);
    }

    /**
     * See {@link Objectify#delete(Class, long)}.
     * 
     * @param clazz the class
     * @param id the id
     * @param <T> the type
     */
    public static <T> void delete(Class<T> clazz, long id) {
        objectify().delete(clazz, id);
    }

    /**
     * See {@link Objectify#delete(Class, String)}.
     * 
     * @param clazz the class
     * @param name the name
     * @param <T> the type
     */
    public static <T> void delete(Class<T> clazz, String name) {
        objectify().delete(clazz, name);
    }

    /**
     * See {@link Objectify#query()}.
     * 
     * @param <T> the type
     * @return the query
     */
    public static <T> Query<T> query() {
        return objectify().query();
    }

    /**
     * See {@link Objectify#query(Class)}.
     *
     * @param clazz the class
     * @param <T> the type
     * @return the query
     */
    public static <T> Query<T> query(Class<T> clazz) {
        return objectify().query(clazz);
    }

    /**
     * Returns the singleton {@link ObjectifyFactory}.
     * 
     * @return the factory
     */
    public static ObjectifyFactory factory() {
        return factory;
    }

    /**
     * Obtains the latest entry in the {@link Objectify} stack, creating the first one if required.
     *  
     * @return the Objectify instance
     */
    public static Objectify objectify() {
        if (stack.isEmpty()) {
            begin();
        }
        return stack.get(0);
    }

    /**
     * Adds a new entry to the {@link Objectify} stack.
     * 
     * @return the Objectify instance
     */
    public static Objectify begin() {
        Objectify objectify = factory().begin();
        stack.add(0, objectify);
        return objectify;
    }

    /**
     * Starts a new transaction and adds a new entry to the {@link Objectify} stack.
     * 
     * @return the Objectify instance with a transaction
     */
    public static Objectify beginTxn() {
        Objectify objectify = factory().beginTransaction();
        stack.add(0, objectify);
        return objectify;
    }

    /**
     * Commits the current transaction.
     */
    public static void commit() {
        closeTxn(false);
    }

    /**
     * Commits all transactions.
     */
    @SuppressWarnings({"ForLoopReplaceableByForEach"})
    public static void commitAll() {
        for (int i = 0; i < stack.size(); i++) {
            closeTxn(false);
        }
    }

    /**
     * Rolls back the current transaction.
     */
    public static void rollback() {
        closeTxn(true);
    }

    /**
     * Rolls back all transactions.
     */
    @SuppressWarnings({"ForLoopReplaceableByForEach"})
    public static void rollbackAll() {
        for (int i = 0; i < stack.size(); i++) {
            closeTxn(true);
        }
    }

    /**
     * Closes the current transaction (commit or rollback) and removes the current
     * entry from the {@link Objectify} stack.
     * 
     * @param rollback true if rollback, commit otherwise
     */
    protected static void closeTxn(boolean rollback) {
        if (!stack.isEmpty()) {
            Objectify objectify = objectify();
            Transaction transaction = objectify.getTxn();
            if (transaction != null && transaction.isActive()) {
                if (rollback) {
                    transaction.rollback();
                }
                else {
                    transaction.commit();
                }
            }
            stack.remove(0);
        }
    }

    /**
     * See {@link ObjectifyFactory#getKeyStr(Object)}.
     *
     * @param keyOrEntity the key or entity
     * @param <T> the type
     * @return the key
     */
    public static <T> Key<T> getKey(Object keyOrEntity) {
        return factory().getKey(keyOrEntity);
    }

    /**
     * Alias to {@link #getKey(Object)}.
     *
     * @param keyOrEntity the key or entity
     * @param <T> the type
     * @return the key
     */
    public static <T> Key<T> key(Object keyOrEntity) {
        return getKey(keyOrEntity);
    }

    /**
     * See {@link ObjectifyFactory#getKey(Object...)}.
     *
     * @param pairs the pairs
     * @param <T> the type
     * @return the key
     */
    public static <T> Key<T> getKey(Object... pairs) {
        return factory().getKey(pairs);
    }

    /**
     * Alias to {@link #getKey(Object...)}.
     *
     * @param pairs the pairs
     * @param <T> the type
     * @return the key
     */
    public static <T> Key<T> key(Object... pairs) {
        return getKey(pairs);
    }

    /**
     * See {@link ObjectifyFactory#getKeyStr(Object)}.
     *
     * @param keyOrEntity the key or entity
     * @return the key as a string
     */
    public static String getKeyStr(Object keyOrEntity) {
        return factory().getKeyStr(keyOrEntity);
    }

    /**
     * Alis to {@link #getKeyStr(Object)}.
     *
     * @param keyOrEntity the key or entity
     * @return the key as a string
     */
    public static String keyStr(Object keyOrEntity) {
        return getKeyStr(keyOrEntity);
    }

    /**
     * Registers a class to be managed by Objectify.
     *
     * @param clazz the class
     */
    public static void register(Class<?> clazz) {
        factory().register(clazz);
    }

    /**
     * Registers a class to be managed by Objectify.
     *
     * @param className the class name
     */
    public static void register(String className) {
        factory().register(loadClass(className));
    }

    /**
     * Loads a class using Play's dynamic classloader.
     *
     * @param clazz the class
     * @param <T> the type
     * @return the loaded class
     */
    @SuppressWarnings({"unchecked"})
    public static <T> Class<T> loadClass(Class<T> clazz) {
        return (Class<T>) loadClass(clazz.getName());
    }

    /**
     * Loads a class using Play's dynamic classloader.
     *
     * @param className the class name
     * @param <T> the type
     * @return the loaded class
     */
    public static <T> Class<T> loadClass(String className) {
        if (className.startsWith("models.")) {
            return ObjectifyFactory.loadClass(className);
        }
        else {
            return ObjectifyFactory.loadClass("models." + className);
        }
    }

}
