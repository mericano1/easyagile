package controllers;

import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.Map.Entry;
import java.util.UUID;

import org.apache.commons.beanutils.BeanUtils;

import models.Story;
import models.Task;
import models.Task.TaskJsonDeserializer;
import models.Task.TaskJsonSerializer;
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
	
	/**
	 * gets all the tasks for a story
	 * @param storyId
	 */
	public static void byStory(long storyId){
		List<Task> byStory = Task.findAllByStory(storyId);
		renderText(getGson().toJson(byStory));
	}
	
	/**
	 * gets all the tasks for a story
	 * @param storyId
	 */
	public static void byId(long storyId, long taskId){
		Task byId = Task.findById(storyId, taskId);
		renderText(getGson().toJson(byId));
	}
	
	/**
	 * Saves a task
	 * @param storyId
	 */
	public static void save(String storyId, JsonObject body){
		Task task = getGson().fromJson(body, Task.class);
		task.story = new Key<Story>(Story.class, Long.valueOf(storyId));
		task.save();
		renderText(getGson().toJson(task));
	}
	
	
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
		String doUpdate = doUpdate(toUpdate, body);
		if (doUpdate == null){renderError("storyId:" + storyId, "task id:" + taskId, body);	}
		renderText(doUpdate);
	}
	
	
	private static String doUpdate(Task toUpdate, JsonObject body){
		if (toUpdate != null){
			updateObject(toUpdate, body);
			toUpdate.save();
			return getGson().toJson(toUpdate);
		}
		return null;
	}
	

	/**
	 * Updates a single or an array of tasks for a given story
	 * @param storyId
	 * @param taskId
	 * @param body
	 */
	public static void update(Long storyId, JsonObject body){
		if (body.isJsonObject()){
			renderText(updateElement(storyId, body));
		}
		if (body.isJsonArray()){
			JsonArray jsonArray = body.getAsJsonArray();
			StringBuilder builder = new StringBuilder();
			for (JsonElement jsonElement : jsonArray) {
				String element = updateElement(storyId, jsonElement);
				if (element != null){
					builder.append(element + ",");
				}
			}
			String res = builder.toString();
			renderText("[" + res.substring(0, res.length() -1) + "]");
		}
		renderError("storyId:" + storyId, body);
	}
	
	
	private static String updateElement(Long storyId, JsonElement element){
		if (element.isJsonObject()){
			JsonObject jsonObject = element.getAsJsonObject();
			JsonElement jsonElement = jsonObject.get("id");
			if (jsonElement != null){
				Task toUpdate = Task.findById(storyId, jsonElement.getAsLong());
				return doUpdate(toUpdate, jsonObject);
			}
		}
		return null;
	}
	
	/**
	 * Updates a single task data
	 * @param storyId
	 * @param body
	 */
	public static void updateIndexes(long storyId, JsonArray body) {
		for (JsonElement jsonElement : body) {
			if (jsonElement.isJsonObject()) {
				JsonObject jsonObject = jsonElement.getAsJsonObject();
				long taskId = jsonObject.get("id").getAsLong();
				int taskIndex = jsonObject.get("index").getAsInt();
				Task task = Task.findById(storyId, taskId);
				task.index = taskIndex;
				task.save();
			}
		}
	}
	
	
	
	
	
	
	
	
	private static void updateObject(Task toUpdate, JsonObject body){
		Set<Entry<String, JsonElement>> entrySet = body.entrySet();
		for (Entry<String, JsonElement> entry : entrySet) {
			String key = entry.getKey();
			JsonElement value = entry.getValue();
			if (!EXCLUDE_PROPS.contains(key)){
				try {
					BeanUtils.copyProperty(toUpdate, key, value.getAsString());
				} catch (Exception e) {
					throw new UnexpectedException("The update failed. Some of the properties could not be persisted");
				}
			}
		}
	}
	
	
	private static Gson getGson () {
		Gson gson = new GsonBuilder()
		.registerTypeAdapter(Task.class, new TaskJsonDeserializer())
		.registerTypeAdapter(Task.class, new TaskJsonSerializer())
		.create();
		return gson;
	}
	
	private static void renderError(Object...args){
		play.Logger.error(UUID.randomUUID() + ":The json message is not recognized", args);
		throw new UnexpectedException(UUID.randomUUID() + ":The json message is not recognized. Please report this issue");
	}

}
