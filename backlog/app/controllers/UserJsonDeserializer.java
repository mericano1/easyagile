package controllers;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Type;

import org.apache.commons.beanutils.PropertyUtils;

import play.modules.objectify.ObjectifyModel;

import models.User;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.googlecode.objectify.Key;

/**
 * Class used to deserialize from json 
 * @author asalvadore
 *
 */
public class UserJsonDeserializer<T extends ObjectifyModel<T>> implements JsonDeserializer<T>{
	
	@Override
	public T deserialize(JsonElement jsonElement, Type typeOf, JsonDeserializationContext context) throws JsonParseException {
		
		JsonObject jsonObject = jsonElement.getAsJsonObject();
		JsonElement assigneeElement = jsonObject.get("assignee");
		Key<User> key = null;
		if(assigneeElement != null){
			String userEmail = assigneeElement.getAsString();
			User byEmail = User.findByEmail(userEmail);
			if(byEmail != null){
				key = byEmail.getKey();
			}
			jsonObject.remove("assignee");
		}
		// Need to remove the doneBy or it'll blow trying to convert to date
		clearPropertyIfEmpty(jsonObject,"doneBy");
		T fromJson = Application.gsonDate.fromJson(jsonObject, typeOf);
		if(assigneeElement != null){
			jsonObject.add("assignee", assigneeElement);
			try {
				PropertyUtils.setProperty(fromJson, "assignee", key);
			} catch (Exception e) {
				play.Logger.error("Error while setting the assignee back to the story / task objecy", assigneeElement);
			}
		}
		return fromJson;
	}
	
	
	private void clearPropertyIfEmpty(JsonObject jsonObject, String propName){
		if(jsonObject != null){
			JsonElement jsonElement = jsonObject.get(propName);
			if (jsonElement != null){
				String asString = jsonElement.getAsString();
				if (asString == null || asString.trim().equals("")){
					jsonObject.remove(propName);
				}
			}
		}
		
	}
	
}