package play.modules.objectify;

import com.googlecode.objectify.Key;
import play.data.binding.BeanWrapper;
import play.data.binding.Binder;
import play.data.validation.Error;
import play.data.validation.Validation;
import play.exceptions.UnexpectedException;

import javax.persistence.Embedded;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.util.*;

/**
 * A simple binder which has a two bind() entry methods which is invoked from their corresponding {@link ObjectifyPlugin} bind() methods
 * to handling binding. Applications wishing to provide custom binding logic may subclass this and provide a reference via the
 * "objectify.binder" property in application.conf.
 *
 * @author David Cheong
 * @since 29/04/2010
 * @see play.modules.objectify.ObjectifyPlugin
 * @see play.modules.objectify.ObjectifyModel
 */
public class ObjectifyBinder {

    /**
     * Invoked when binding HTTP parameters to {@link ObjectifyModel} instances.
     *
     * @param name the param name
     * @param clazz the target class which should be ObjectifyModel
     * @param type the type
     * @param annotations the annotations
     * @param params the params map
     * @return the bound instance or null
     */
    @SuppressWarnings({"unchecked", "UnusedDeclaration"})
    // todo annotations are not currently used
    public Object bind(String name, Class clazz, Type type, Annotation[] annotations, Map<String, String[]> params) {

        if (ObjectifyModel.class.isAssignableFrom(clazz)) {

            String idKey = name + ".id";

            if (params.containsKey(idKey) && params.get(idKey).length > 0 && params.get(idKey)[0] != null && params.get(idKey)[0].trim().length() > 0) {

                String rawId = params.get(idKey)[0];
                params.remove(idKey);
                Class idType = Utils.getKeyType(clazz);

                ObjectifyModel instance = find(clazz, rawId, idType);
                if (instance != null) {
                    return edit(instance, name, params);
                }

            }

            return create(clazz, name, params);

        }

        return null;

    }

    /**
     * Invoked when binding parameters to {@link ObjectifyModel} instances.
     *
     * @param name the param name
     * @param o the instance
     * @param params the params map
     * @return the bound instance of null
     */
    public Object bind(String name, Object o, Map<String, String[]> params) {

        if (ObjectifyModel.class.isAssignableFrom(o.getClass())) {

            String idKey = name + ".id";
            params.remove(idKey);

            return edit(o, name, params);

        }

        return null;

    }

    /**
     * Finds a {@link ObjectifyModel} instance given the entity class, the id as a raw string and
     * the id type. If a {@link Key} cannot be parsed or otherwise resolved properly, this method
     * returns null.
     *
     * @param clazz the entity class
     * @param rawId the id as a raw string
     * @param idType the id type
     * @param <T> the entity type
     * @return the instance or null
     */
    public <T extends ObjectifyModel> T find(Class<T> clazz, String rawId, Class idType) {
        Key<T> key = null;
        if (Utils.isNumeric(rawId)) {
            key = new Key<T>(clazz, Long.parseLong(rawId));
        }
        else if (idType.equals(String.class)) {
            key = new Key<T>(clazz, rawId);
        }
        T instance = null;
        if (key != null) {
            instance = ObjectifyService.find(key, false);
        }
        if (instance == null) {
            try {
                key = ObjectifyService.getKey(rawId);
            }
            catch (IllegalArgumentException e) {
                return null;
            }
            instance = ObjectifyService.find(key, false);
        }
        return instance;
    }

    /**
     * Instantiates a new {@link ObjectifyModel} instance and bind the supplied parameters where appropriate.
     *
     * @param clazz the entity class
     * @param name the param name
     * @param params the params map
     * @param <T> the entity type
     * @return the bound instance
     */
    @SuppressWarnings({"unchecked"})
    public <T extends ObjectifyModel> T create(Class clazz, String name, Map<String, String[]> params) {
        T instance = (T) ObjectifyService.instantiate(clazz);
        return edit(instance, name, params);
    }

    /**
     * Binds the given entity instance with the supplied parameters.
     *
     * @param instance the entity instance
     * @param name the param name
     * @param params the params map
     * @param <T> the entity type
     * @return the bound instance
     */
    @SuppressWarnings({"unchecked", "ConstantConditions"})
    public <T> T edit(T instance, String name, Map<String, String[]> params) {

        try {

            BeanWrapper bw = new BeanWrapper(instance.getClass());

            Set<Field> fields = new HashSet<Field>();
            Class clazz = instance.getClass();
            while (!clazz.equals(Object.class)) {
                Collections.addAll(fields, clazz.getDeclaredFields());
                clazz = clazz.getSuperclass();
            }
            clazz = instance.getClass();

            Set<String> handledFieldPaths = new HashSet<String>();

            for (Field field : fields) {

                field.setAccessible(true);

                Class<?> fieldType = field.getType();
                String fieldName = field.getName();
                String fieldPath = name + "." + fieldName;
                String[] fieldValues = params.get(fieldPath);
                boolean embedded = field.getAnnotation(Embedded.class) != null;
                boolean many = Collection.class.isAssignableFrom(fieldType) || fieldType.isArray();

                if (Key.class.isAssignableFrom(fieldType)) {
                    if (fieldValues == null) {
                        Field keyField = Utils.getKeyField(clazz);
                        fieldPath = fieldPath + "." + keyField.getName();
                        fieldValues = params.get(fieldPath);
                    }
                    if (fieldValues != null && fieldValues.length > 0) {
                        if (!fieldValues[0].equals("")) {
                            params.remove(fieldPath);
                            String rawId = fieldValues[0];
                            Key key = ObjectifyService.getKey(rawId);
                            bw.set(fieldName, instance, key);
                        }
                        else {
                            bw.set(fieldName, instance, null);
                            params.remove(fieldPath);
                        }
                    }
                    handledFieldPaths.add(fieldPath);
                }
                else if (many) {
                    Field keyField = Utils.getKeyField(clazz);
                    String altFieldPath = fieldPath + "." + keyField.getName();
                    String[] altFieldValues = params.get(altFieldPath);
                    if (fieldValues == null && getParamsByKeyPrefix(params, fieldPath + "[0]").size() == 0 &&
                            (altFieldValues == null || altFieldValues.length == 0 || (altFieldValues.length == 1 && "".equals(altFieldValues[0])))) {
                        bw.set(fieldName, instance, null);
                    }
                    else {
                        Class fieldManyRawClass = Utils.getManyFieldRawClass(field);
                        if (fieldManyRawClass != null) {
                            if (Key.class.isAssignableFrom(fieldManyRawClass)) {
                                Collection collection = newCollection(field, fieldPath);
                                if (fieldValues == null) {
                                    handledFieldPaths.add(fieldPath);
                                    fieldPath = altFieldPath;
                                    fieldValues = altFieldValues;
                                }
                                if (fieldValues != null) {
                                    for (String rawId : fieldValues) {
                                        if (rawId != null && rawId.length() > 0) {
                                            Key key = ObjectifyService.getKey(rawId);
                                            collection.add(key);
                                        }
                                    }
                                }
                                Object collectionOrArray = Utils.convertToArrayIfRequired(fieldType, fieldManyRawClass, collection);
                                bw.set(fieldName, instance, collectionOrArray);
                                params.remove(fieldPath);
                            }
                            else if (embedded) {
                                int i = 0;
                                Collection collection = newCollection(field, fieldPath);
                                Map<String, String[]> paramsNested;
                                while (true) {
                                    String fieldPathNested = fieldPath + "[" + i + "]";
                                    paramsNested = getParamsByKeyPrefix(params, fieldPathNested);
                                    if (paramsNested.size() > 0) {
                                        Object fieldValue = ObjectifyService.instantiate(fieldManyRawClass);
                                        fieldValue = edit(fieldValue, fieldPathNested, paramsNested);
                                        collection.add(fieldValue);
                                        i++;
                                    }
                                    else {
                                        break;
                                    }
                                }
                                Object collectionOrArray = Utils.convertToArrayIfRequired(fieldType, fieldManyRawClass, collection);
                                bw.set(fieldName, instance, collectionOrArray);
                            }
                            else if (Utils.isSimpleType(fieldManyRawClass)) {
                                Collection collection = newCollection(field, fieldPath);
                                for (String fieldValue : fieldValues) {
                                    if (fieldValue != null && fieldValue.length() > 0) {
                                        Object convertedFieldValue;
                                        if (fieldManyRawClass.isEnum()) {
                                            convertedFieldValue = getEnumValue(fieldValue, fieldManyRawClass);
                                        }
                                        else {
                                            convertedFieldValue = Binder.directBind(fieldValue, fieldManyRawClass);
                                        }
                                        collection.add(convertedFieldValue);
                                    }
                                }
                                Object collectionOrArray = Utils.convertToArrayIfRequired(fieldType, fieldManyRawClass, collection);
                                bw.set(fieldName, instance, collectionOrArray);
                                params.remove(fieldPath);
                            }
                            else {
                                throw new UnexpectedException("Unable to bind: " + instance.getClass() + ", " + fieldPath + " is a neither Key<T>, @Embedded, Enum or simple collection");
                            }
                        }
                        else {
                            throw new UnexpectedException("Unable to bind: " + instance.getClass() + ", " + fieldPath + " is a non-parametrized collection");
                        }
                    }
                    handledFieldPaths.add(fieldPath);
                }
                else if (embedded) {
                    Object fieldValue = ObjectifyService.instantiate(fieldType);
                    fieldValue = edit(fieldValue, fieldPath, params);
                    bw.set(fieldName, instance, fieldValue);
                    handledFieldPaths.add(fieldPath);
                }

            }

            bw.bind(name, instance.getClass(), params, "", instance, null);

            Validation validation = Validation.current();
            Field errorsField = validation.getClass().getDeclaredField("errors");
            errorsField.setAccessible(true);
            List<Error> errors = (List<Error>) errorsField.get(validation);
            for (int i = errors.size() - 1; i >= 0; i--) {
                Error error = errors.get(i);
                if (handledFieldPaths.contains(error.getKey())) {
                    errors.remove(i);
                }
            }

            return instance;

        }
        catch (Exception e) {
            throw new UnexpectedException("Unable to bind: " + instance.getClass() + ", " + e.getMessage(), e);
        }

    }

    /**
     * Creates a new {@link Collection} for a given {@link Field}. This method only supports {@link List},
     * {@link Set} and native Java arrays.
     *
     * @param field the field
     * @param fieldPath the field path
     * @return the new Collection
     */
    public static Collection newCollection(Field field, String fieldPath) {
        Class<?> type = field.getType();
        if (List.class.isAssignableFrom(type) || type.isArray()) {
            return new ArrayList();
        }
        else if (Set.class.isAssignableFrom(type)) {
            return new HashSet();
        }
        else {
            throw new UnexpectedException("Unable to instantiate Collection as it is neither List, Set or Array: " + fieldPath + ", " + type.getName());
        }
    }

    /**
     * Obtains the value of a given enum given its String name.
     *
     * @param value the value
     * @param clazz the enum class
     * @return the enum instance
     */
    public static <T extends Enum<T>> T getEnumValue(String value, Class<T> clazz) {
        return Enum.valueOf(clazz, value);
    }

    /**
     * Creates a {@link Map} containing a subset of parameters matching the given key prefix
     * from the supplied parameters.
     *
     * @param params the params map
     * @param keyPrefix the key prefix
     * @return the map containing matching params
     */
    public static Map<String, String[]> getParamsByKeyPrefix(Map<String, String[]> params, String keyPrefix) {
        Map<String, String[]> newParams = new HashMap<String, String[]>();
        Set<Map.Entry<String, String[]>> entries = params.entrySet();
        for (Map.Entry<String, String[]> entry : entries) {
            String key = entry.getKey();
            String[] value = entry.getValue();
            if (key.startsWith(keyPrefix)) {
                newParams.put(key, value);
            }
        }
        return newParams;
    }

}
