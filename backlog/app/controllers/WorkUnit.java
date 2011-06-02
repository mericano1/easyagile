package controllers;

import java.util.Map.Entry;
import java.util.Set;

import notifiers.Mails;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.PropertyUtils;

import play.exceptions.UnexpectedException;
import play.modules.objectify.ObjectifyModel;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class  WorkUnit <T extends ObjectifyModel<T>> {
	private Gson gson;
	private Set<String> excludeProperties;
	private Class<T> modelClass;
	
	
	
	public WorkUnit(Gson gson, Set<String> excludeProperties,
			Class<T> modelClass) {
		super();
		this.gson = gson;
		this.excludeProperties = excludeProperties;
		this.modelClass = modelClass;
	}

	public void  updateObject(T toUpdate, JsonObject body){
		T source = getGson().fromJson(body, getModelClass());
		Set<Entry<String, JsonElement>> entrySet = body.entrySet();
		for (Entry<String, JsonElement> entry : entrySet) {
			String key = entry.getKey();
			if (key.equals("notify") && entry.getValue() != null && entry.getValue().getAsBoolean()){
				Mails.notifyAssignment(source);
			}
			if (!getExcludeProperties().contains(key)){
				try {
					BeanUtils.copyProperty(toUpdate, key, PropertyUtils.getProperty(source, key));
				}catch (NoSuchMethodException e1){
					play.Logger.warn("Trying to set a property not found: [%s]" , key);
				}catch (Exception e) {
					throw new UnexpectedException("The update failed. Some of the properties could not be persisted:" + key, e);
				}
			}
		}
	}

	public Gson getGson() {
		return gson;
	}

	public void setGson(Gson gson) {
		this.gson = gson;
	}

	public Set<String> getExcludeProperties() {
		return excludeProperties;
	}

	public void setExcludeProperties(Set<String> excludeProperties) {
		this.excludeProperties = excludeProperties;
	}

	public void setModelClass(Class<T> modelClass) {
		this.modelClass = modelClass;
	}
	
	public Class<T> getModelClass() {
		return modelClass;
	}

}
