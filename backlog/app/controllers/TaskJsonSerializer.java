package controllers;

import java.lang.reflect.Type;

import models.Task;
import models.User;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

/**
 * Class used to serialize to json 
 * @author asalvadore
 *
 */
public class TaskJsonSerializer implements JsonSerializer<Task>{
	@Override
	public JsonElement serialize(Task task, Type typeOf, JsonSerializationContext context) {
		JsonElement jsonElement = Tasks.gsonDate.toJsonTree(task);
		if (task.assignee != null){
			User user = User.findByKey(task.assignee);
			JsonObject jsonObject = jsonElement.getAsJsonObject();
			jsonObject.remove("assignee");
			jsonObject.addProperty("assignee", user.email);
		}
		return jsonElement;
	}
}