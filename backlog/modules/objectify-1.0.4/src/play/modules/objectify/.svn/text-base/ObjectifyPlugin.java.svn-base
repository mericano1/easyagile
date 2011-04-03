package play.modules.objectify;

import play.Play;
import play.PlayPlugin;
import play.db.Model;
import play.exceptions.UnexpectedException;
import play.modules.gae.GAEPlugin;
import play.mvc.Scope;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

/**
 * The {@link PlayPlugin} to support Objectify on the Google App Engine/J platform. This plugin reads the "objectify.models"
 * property in application.conf to configure Objectify. It invokes a binder ({@link ObjectifyBinder} or subclass identified
 * by "objectify.binder" to handle mapping of HTTP parameters. It invokes a model factory ({@link play.db.Model.Factory}) or
 * subclass identified by "objectify.modelFactory" to handle model retrieval/lookups.
 *
 * @author David Cheong
 * @since 20/04/2010
 */
public class ObjectifyPlugin extends PlayPlugin {

    /**
     * A flag set to true if running on AppSpot, false otherwise
     */
    protected static Boolean prod;

    /**
     * Reads "objectify.models" for the list of Objectify managed entities.
     */
    protected void setup() {
        String models = Play.configuration.getProperty("objectify.models");
        if (models != null) {
            String[] modelsArray = models.split(",");
            for (String model : modelsArray) {
                ObjectifyService.register("models." + model.trim());
            }
        }
    }

    /**
     * Checks if the application is running on the production Google App Engine/J platform or the dev server.
     *
     * @return true if production, false otherwise
     */
    protected boolean isProd() {
        if (prod == null) {
            List<PlayPlugin> plugins = Play.plugins;
            for (PlayPlugin plugin : plugins) {
                if (plugin instanceof GAEPlugin) {
                    prod = ((GAEPlugin) plugin).prodGAE;
                    return prod;
                }
            }
            throw new IllegalStateException("Unable to determine GAE environment as GAEPlugin was not detected");
        }
        else {
            return prod;
        }
    }

    /**
     * Setup the environment if production.
     */
    @Override
    public void onApplicationStart() {
        if (isProd()) {
            setup();
        }
    }

    /**
     * Invoked when binding HTTP parameters to Java instances.
     *
     * @param name the param name
     * @param clazz the target class which should be ObjectifyModel
     * @param type the type
     * @param annotations the annotations array
     * @param params the params map
     * @return the bound instance or null
     * #see resolveBinder
     */
    @Override
    @SuppressWarnings({"unchecked"})
    public Object bind(String name, Class clazz, Type type, Annotation[] annotations, Map<String, String[]> params) {
        ObjectifyBinder binder = resolveBinder();
        Object result = binder.bind(name, clazz, type, annotations, params);
        return result == null ? super.bind(name, clazz, type, annotations, params) : result;
    }

    /**
     * Invoked when binding parameters to Java instances.
     *
     * @param name the param name
     * @param o the object
     * @param params the params map
     * @return the bound instance or null
     * #see resolveBinder
     */
    @Override
    public Object bind(String name, Object o, Map<String, String[]> params) {
        ObjectifyBinder binder = resolveBinder();
        Object result = binder.bind(name, o, params);
        return result == null ? super.bind(name, o, params) : result;
    }

    /**
     * Resolves {@link ObjectifyBinder} or a subclass identified by "objectify.binder" in application.conf.
     *
     * @return the binder instance
     */
    @SuppressWarnings({"unchecked"})
    protected ObjectifyBinder resolveBinder() {
        String binderClassName = Play.configuration.getProperty("objectify.binder", ObjectifyBinder.class.getName());
        try {
            Class<? extends ObjectifyBinder> binderClass = (Class<? extends ObjectifyBinder>) Play.classloader.loadClass(binderClassName);
            return binderClass.newInstance();
        }
        catch (Exception e) {
            throw new UnexpectedException("Unable to bind via binder: " + binderClassName + "," + e.getMessage(), e);
        }
    }

    /**
     * Setup the environment if not production.
     */
    @Override
    public void beforeInvocation() {
        if (!isProd()) {
            setup();
        }
    }

    /**
     * Commits all opened transactions.
     */
    @Override
    public void afterInvocation() {
        ObjectifyService.commitAll();
    }

    /**
     * Exposes the {@link ObjectifyService} to templates under two keys, "Datastore" and "ofy".
     *
     * @param actionMethod the action method
     */
    @Override
    public void beforeActionInvocation(Method actionMethod) {
        Scope.RenderArgs renderArgs = Scope.RenderArgs.current();
        ObjectifyService objectifyService = new ObjectifyService();
        renderArgs.put("Datastore", objectifyService);
        renderArgs.put("ofy", objectifyService);
    }

    @Override
    public void afterActionInvocation() {
    }

    /**
     * Rolls back all opened transactions
     *
     * @param e the error thrown
     */
    @Override
    public void onInvocationException(Throwable e) {
        ObjectifyService.rollbackAll();
    }

    @Override
    public void invocationFinally() {
    }

    /**
     * Invoked when doing model retrieval/lookups. The model factory returned is {@link ObjectifyModelLoader}
     * or a subclass identified by "objectify.modelFactory" in application.conf.
     *
     * @param modelClass the model class
     * @return the model factory
     */
    @SuppressWarnings({"unchecked"})
    public Model.Factory modelFactory(Class<? extends Model> modelClass) {
        try {
            Class<? extends ObjectifyModel.Factory> factoryClass;
            ManagedBy managedBy = modelClass.getAnnotation(ManagedBy.class);
            if (managedBy == null) {
                String factoryClassName = Play.configuration.getProperty("objectify.modelFactory", ObjectifyModelLoader.class.getName());
                factoryClass = (Class<? extends ObjectifyModel.Factory>) Play.classloader.loadClass(factoryClassName);
            }
            else {
                factoryClass = managedBy.value();
            }
            ObjectifyModel.Factory factory = factoryClass.newInstance();
            factory.init(modelClass);
            return factory;
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
