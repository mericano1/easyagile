package play.modules.objectify;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;
import play.Logger;
import play.db.Model;
import play.exceptions.UnexpectedException;
import play.libs.I18N;
import play.mvc.Scope;

import javax.persistence.Embedded;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author David Cheong
 * @since 10/10/2010
 */
public class ObjectifyModelLoader implements ObjectifyModel.Factory {

    protected Class<? extends Model> modelClass;

    public void init(Class<? extends Model> modelClass) {
        this.modelClass = modelClass;
    }

    public String keyName() {
        return keyField().getName();
    }

    public Class keyType() {
        return String.class;
    }

    public Object keyValue(Model m) {
        return ((ObjectifyModel) m).getKeyStr();
    }

    protected Field keyField() {
        Class c = modelClass;
        try {
            while (!c.equals(Object.class)) {
                for (Field field : c.getDeclaredFields()) {
                    if (field.isAnnotationPresent(Id.class)) {
                        field.setAccessible(true);
                        return field;
                    }
                }
                c = c.getSuperclass();
            }
        }
        catch (Exception e) {
            throw new UnexpectedException("Error while determining the object @Id for an object of type " + modelClass);
        }
        throw new UnexpectedException("Cannot get the object @Id for an object of type " + modelClass);
    }

    @SuppressWarnings({"unchecked"})
    public Model findById(Object id) {
        Key<?> key = Datastore.key((String) id);
        return (Model) Datastore.find(key, false);
    }

    @SuppressWarnings({"unchecked"})
    public List<Model> fetch(int offset, int length, String orderBy, String orderDirection, List<String> properties, String keywords, String where) {
        return (List<Model>) fetch(keywords, orderBy, orderDirection, offset, length);
    }

    public List<? extends Model> fetch(String keywords, String orderBy, String orderDirection, int offset, int length) {
        Query<? extends Model> query = prepareFetchQuery(keywords, orderBy, orderDirection);
        query.offset(offset);
        query.limit(length);
        return Utils.asList(query);
    }

    public Long count(List<String> properties, String keywords, String where) {
        return count(keywords);
    }

    public Long count(String keywords) {
        Query<? extends Model> query = prepareFetchQuery(keywords, null, null);
        return (long) query.countAll();
    }

    protected Query<? extends Model> prepareFetchQuery(String keywords, String orderBy, String orderDirection) {

        Query<? extends Model> query = Datastore.query(modelClass);

        String inequalityFieldName = null;

        if (keywords != null && keywords.length() > 0) {

            String[] keyWordsAsArray = keywords.split(" ");
            List<SearchFieldValue> searchFieldValues = new ArrayList<SearchFieldValue>();
            String key = null;
            String value = "";
            for (String keyword : keyWordsAsArray) {
                if (key == null) {
                    int delim = keyword.indexOf(":");
                    if (delim != -1 && delim > 0 && delim < keyword.length() - 1) {
                        String fieldName = keyword.substring(0, delim);
                        String fieldValue = keyword.substring(delim + 1);
                        if (!fieldValue.startsWith("\"")) {
                            searchFieldValues.add(new SearchFieldValue(fieldName, fieldValue));
                        }
                        else {
                            key = fieldName;
                            if (fieldValue.length() > 1) {
                                if (fieldValue.endsWith("\"")) {
                                    value = fieldValue.substring(1, fieldValue.length() - 1);

                                }
                                else {
                                    value = fieldValue.substring(1);
                                }
                            }
                            else {
                                value = "";
                            }
                        }
                    }
                }
                else {
                    if (keyword.endsWith("\"")) {
                        value += " " + (keyword.length() > 1 ? keyword.substring(0, keyword.length() - 1) : "");
                        searchFieldValues.add(new SearchFieldValue(key, value));
                        key = null;
                        value = "";
                    }
                    else {
                        value += " " + keyword;
                    }
                }
            }
            if (key != null) {
                searchFieldValues.add(new SearchFieldValue(key, value));
            }

            for (SearchFieldValue searchFieldValue : searchFieldValues) {
                String fieldName = searchFieldValue.name;
                String fieldValue = searchFieldValue.value;
                Field field = Utils.findField(modelClass, fieldName);
                if (field != null) {
                    Class<?> type = field.getType();
                    if (type.equals(String.class)) {
                        if (inequalityFieldName == null) {
                            query.filter(fieldName + " >=", fieldValue);
                            query.filter(fieldName + " <", fieldValue + "\uFFFD");
                            inequalityFieldName = fieldName;
                        }
                        else {
                            Logger.warn("Datastore only allows one inequality filter per query, search by '" + fieldName + "' is silently ignored");
                        }
                    }
                    else if (Integer.class.isAssignableFrom(type) || int.class.isAssignableFrom(type)) {
                        query.filter(fieldName, Integer.parseInt(fieldValue));
                    }
                    else if (Long.class.isAssignableFrom(type) || long.class.isAssignableFrom(type)) {
                        query.filter(fieldName, Long.parseLong(fieldValue));
                    }
                    else if (Float.class.isAssignableFrom(type) || float.class.isAssignableFrom(type)) {
                        query.filter(fieldName, Float.parseFloat(fieldValue));
                    }
                    else if (Double.class.isAssignableFrom(type) || double.class.isAssignableFrom(type)) {
                        query.filter(fieldName, Double.parseDouble(fieldValue));
                    }
                    else if (Boolean.class.isAssignableFrom(type) || boolean.class.isAssignableFrom(type)) {
                        query.filter(fieldName, Boolean.valueOf(fieldValue));
                    }
                    else if (Date.class.equals(type)) {
                        try {
                            Date date = new SimpleDateFormat(I18N.getDateFormat()).parse(fieldValue);
                            query.filter(fieldName, date);
                        }
                        catch (ParseException e) {
                            // ignored
                        }
                    }
                    else if (type.isEnum()) {
                        query.filter(fieldName, fieldValue);
                    }
                }
            }

        }

        if (inequalityFieldName != null) {
            if ("DESC".equalsIgnoreCase(orderDirection)) {
                query.order("-" + inequalityFieldName);
            }
            else {
                query.order(inequalityFieldName);
            }
        }

        if (orderBy != null && orderBy.length() > 0) {
            if (!orderBy.equals(inequalityFieldName)) {
                if ("DESC".equalsIgnoreCase(orderDirection)) {
                    query.order("-" + orderBy);
                }
                else {
                    query.order(orderBy);
                }
                if (inequalityFieldName != null) {
                    String msg = "Sorting is by " + inequalityFieldName + " first, then " + orderBy + " (datastore limitation)";
                    Scope.Flash flash = Scope.Flash.current();
                    if (flash != null) {
                        flash.error(msg);
                    }
                    Logger.warn(msg);
                }
            }
        }

        return query;

    }

    @SuppressWarnings({"unchecked"})
    public List<Object> listChoices(String fieldName, Class fieldType) {
        if (ObjectifyModel.class.isAssignableFrom(fieldType)) {
            return listModel(fieldName, fieldType);
        }
        else if (fieldType.isEnum()) {
            return listEnumValues(fieldName, fieldType);
        }
        else {
            return listOther(fieldName, fieldType);
        }
    }

    @SuppressWarnings({"unchecked"})
    protected List<Object> listModel(String fieldName, Class fieldType) {
        Query query = prepareListModelQuery(fieldName, fieldType);
        return (List<Object>) Utils.asList(query);
    }

    @SuppressWarnings({"UnusedDeclaration", "unchecked"})
    protected Query prepareListModelQuery(String fieldName, Class fieldType) {
        return Datastore.query(fieldType);
    }

    @SuppressWarnings({"UnusedDeclaration"})
    protected List<Object> listEnumValues(String fieldName, Class fieldType) {
        return Arrays.asList(fieldType.getEnumConstants());
    }

    @SuppressWarnings({"UnusedDeclaration"})
    protected List<Object> listOther(String fieldName, Class fieldType) {
        return new ArrayList<Object>();
    }

    public void deleteAll() {
        boolean hasOne;
        do {
            hasOne = false;
            Query<? extends Model> query = Datastore
                    .query(modelClass)
                    .limit(50);
            for (Model model : query) {
                Datastore.delete(model);
                hasOne = true;
            }
        } while (hasOne);
    }

    public List<Model.Property> listProperties() {
        List<Model.Property> properties = new ArrayList<Model.Property>();
        Set<Field> fields = new HashSet<Field>();
        Class<?> tclazz = modelClass;
        while (!tclazz.equals(Object.class)) {
            Collections.addAll(fields, tclazz.getDeclaredFields());
            tclazz = tclazz.getSuperclass();
        }
        for (Field field : fields) {
            Class<?> type = field.getType();
            if (Modifier.isTransient(field.getModifiers())) {
                continue;
            }
            if (field.isAnnotationPresent(Transient.class)) {
                continue;
            }
            if (Collection.class.isAssignableFrom(type) || type.isArray()) {
                Class rawClass = Utils.getManyFieldRawClass(field);
                if (!Key.class.isAssignableFrom(rawClass) && !rawClass.isEnum()) {
                    continue;
                }
            }
            Model.Property mp = buildProperty(field);
            if (mp != null) {
                properties.add(mp);
            }
        }
        return properties;
    }

    protected Model.Property buildProperty(final Field field) {

        final Model.Property modelProperty = new Model.Property();
        final String name = field.getName();
        final Class<?> type = field.getType();

        boolean many = Collection.class.isAssignableFrom(type) || type.isArray();

        modelProperty.type = type;
        modelProperty.field = field;
        modelProperty.name = name;

        if (Model.class.isAssignableFrom(type)) {
            modelProperty.isRelation = true;
            modelProperty.isSearchable = true;
            modelProperty.relationType = type;
            modelProperty.choices = new Model.Choices() {
                @SuppressWarnings("unchecked")
                public List<Object> list() {
                    return listChoices(modelProperty.name, modelProperty.relationType);
                }
            };
        }
        else if (Key.class.isAssignableFrom(type)) {
            modelProperty.isRelation = true;
            modelProperty.isSearchable = false;
            modelProperty.relationType = Utils.getSingleFieldRawClass(field);
            modelProperty.choices = new Model.Choices() {
                @SuppressWarnings("unchecked")
                public List<Object> list() {
                    return listChoices(modelProperty.name, modelProperty.relationType);
                }
            };
        }
        else if (many) {
            modelProperty.isMultiple = true;
            modelProperty.isSearchable = false;
            final Class rawClass = Utils.getManyFieldRawClass(field);
            final Class rawType = Utils.getManyFieldRawType(field);
            if (Key.class.isAssignableFrom(rawClass)) {
                modelProperty.isRelation = true;
                modelProperty.relationType = rawType;
                modelProperty.choices = new Model.Choices() {
                    @SuppressWarnings("unchecked")
                    public List<Object> list() {
                        return listChoices(modelProperty.name, modelProperty.relationType);
                    }
                };
            }
            else if (rawType.isEnum()) {
                modelProperty.isRelation = false;
                modelProperty.relationType = rawType;
                modelProperty.choices = new Model.Choices() {
                    @SuppressWarnings("unchecked")
                    public List<Object> list() {
                        return listChoices(modelProperty.name, modelProperty.relationType);
                    }
                };
            }
            else {
                modelProperty.isRelation = false;
                modelProperty.relationType = rawType;
                // crud api does not make this possible
                throw new UnexpectedException("CRUD does not allow non-Key collections from being managed");
            }
        }
        else if (type.isEnum()) {
            modelProperty.isSearchable = true;
            modelProperty.choices = new Model.Choices() {
                @SuppressWarnings({"unchecked", "RedundantCast"})
                public List<Object> list() {
                    return listChoices(modelProperty.name, type);
                }
            };
        }
        else if (field.getAnnotation(Embedded.class) != null) {
            modelProperty.relationType = field.getType();
            modelProperty.isSearchable = true;
        }
        else if (Utils.isSimpleType(type)) {
            modelProperty.isSearchable = true;
        }

        if (field.isAnnotationPresent(GeneratedValue.class)) {
            modelProperty.isGenerated = true;
            modelProperty.isSearchable = true;
        }

        return modelProperty;

    }

    public static class SearchFieldValue {

        public String name;
        public String value;

        SearchFieldValue(String name, String value) {
            this.name = name;
            this.value = value;
        }

    }

}
