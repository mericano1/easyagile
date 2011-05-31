package controllers;

import java.util.Date;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;

import models.Story;
import models.Task;
import notifiers.Mails;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.beanutils.converters.DateConverter;

import play.exceptions.UnexpectedException;
import play.mvc.Controller;
import play.mvc.With;
import client.UserMessage;

import com.google.common.collect.Sets;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.googlecode.objectify.Key;

@With(Application.class)
public class Tasks extends Controller{
	private static final Set<String> EXCLUDE_PROPS = Sets.newHashSet("id", "story");
	static {
		DateConverter dateConverter = new DateConverter();
		dateConverter.setPattern(Application.DATE_FORMAT);
		ConvertUtils.register(dateConverter, Date.class);
	}
	private static final Gson gson = new GsonBuilder()
		.setDateFormat(Application.DATE_FORMAT)
		.registerTypeAdapter(Task.class, new UserJsonDeserializer())
		.registerTypeAdapter(Task.class, new UserJsonSerializer())
		.create();

	
	/**
	 * gets all the tasks for a story
	 * @param storyId
	 */
	public static void byStory(long storyId){
		List<Task> byStory = Task.findAllByStory(storyId);
		renderText(gson.toJson(byStory));
	}
	
	/**
	 * gets all the tasks for a story
	 * @param storyId
	 */
	public static void byId(long storyId, long taskId){
		Task byId = Task.findById(storyId, taskId);
		renderText(gson.toJson(byId));
	}
	
	/**
	 * Saves a task
	 * @param storyId
	 */
	public static void save(String storyId, JsonObject body){
		Task task = gson.fromJson(body, Task.class);
		task.story = new Key<Story>(Story.class, Long.valueOf(storyId));
		task.save();
		renderText(gson.toJson(task));
	}
	
	/**
	 * Delete a task
	 * @param storyId
	 * @param taskId
	 */
	public static void delete(Long storyId,long taskId){
		Task toDelete = Task.findById(storyId, taskId);
		if (toDelete != null){
			toDelete.delete();
		}
		renderJSON(UserMessage.SUCCESSFUL);
	}
	
	
	
	/**
	 * Updates a single task data
	 * @param storyId
	 * @param taskId
	 * @param body
	 */
	public static void update(Long storyId, Long taskId, JsonObject body){
		Task toUpdate = Task.findById(storyId, taskId);
		doUpdate(toUpdate, body);
		renderText(gson.toJson(toUpdate));
	}
	
	
	//This is actually performing the update and save the object
	private static void doUpdate(Task toUpdate, JsonObject body){
		if (toUpdate != null){
			updateObject(toUpdate, body);
			toUpdate.save();
		}
	}
	

	
	/**
	 * Updates an array of tasks for a given story
	 * @param body
	 */
	public static void updateAll(Long storyId, JsonArray body){
		JsonArray jsonArray = body.getAsJsonArray();
		for (JsonElement jsonElement : jsonArray) {
			updateElement(storyId, jsonElement);
		}
		renderJSON(UserMessage.SUCCESSFUL);
	}

	
	
	private static void updateElement(Long storyId, JsonElement element){
		if (element.isJsonObject()){
			JsonObject jsonObject = element.getAsJsonObject();
			JsonElement jsonElement = jsonObject.get("id");
			if (jsonElement != null){
				Task toUpdate = Task.findById(storyId, jsonElement.getAsLong());
				doUpdate(toUpdate, jsonObject);
			}
		}
	}
	
	
	

	
	private static void updateObject(Task toUpdate, JsonObject body){
		Task source = gson.fromJson(body, Task.class);
		Set<Entry<String, JsonElement>> entrySet = body.entrySet();
		for (Entry<String, JsonElement> entry : entrySet) {
			String key = entry.getKey();
			if (key.equals("notify") && entry.getValue() != null && entry.getValue().getAsBoolean()){
				Mails.notifyAssignment(source);
			}
			if (!EXCLUDE_PROPS.contains(key)){
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
	
	
	
	private static void renderError(Object...args){
		play.Logger.error(UUID.randomUUID() + ":The json message is not recognized", args);
		throw new UnexpectedException(UUID.randomUUID() + ":The json message is not recognized. Please report this issue");
	}
	

}
