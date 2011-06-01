package controllers;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Type;

import org.apache.commons.beanutils.PropertyUtils;

import play.modules.objectify.ObjectifyModel;

import models.Task;
import models.User;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.googlecode.objectify.Key;

/**
 * Class used to serialize to json 
 * @author asalvadore
 *
 */
public class UserJsonSerializer<T extends ObjectifyModel<T>> implements JsonSerializer<T>{
	@Override
	public JsonElement serialize(T task, Type typeOf, JsonSerializationContext context) {
		JsonElement jsonElement = Application.gsonDate.toJsonTree(task);
		Object property = null;
		try {
			property = PropertyUtils.getProperty(task, "assignee");
		} catch (Exception e) {
			play.Logger.error("Error while getting the assignee back to the story / task objecy", task);
		}
		if (property != null){
			User user = User.findByKey((Key<User>)property);
			JsonObject jsonObject = jsonElement.getAsJsonObject();
			jsonObject.remove("assignee");
			jsonObject.addProperty("assignee", user.email);
		}
		return jsonElement;
	}
}