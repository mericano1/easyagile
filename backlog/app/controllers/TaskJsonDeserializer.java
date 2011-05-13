package controllers;

import java.lang.reflect.Type;

import models.Task;
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
public class TaskJsonDeserializer implements JsonDeserializer<Task>{
	@Override
	public Task deserialize(JsonElement jsonElement, Type typeOf, JsonDeserializationContext context) throws JsonParseException {
		
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
		Task fromJson = Tasks.gsonDate.fromJson(jsonObject, Task.class);
		jsonObject.add("assignee", assigneeElement);
		fromJson.assignee = key;
		return fromJson;
	}
	
}