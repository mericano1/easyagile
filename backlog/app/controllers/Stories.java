package controllers;

import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

import models.Sprint;
import models.Story;
import models.Task;
import models.Task.TaskJsonDeserializer;
import models.Task.TaskJsonSerializer;

import org.apache.commons.beanutils.BeanUtils;

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
public class Stories extends Controller{
	private static final Set<String> EXCLUDE_PROPS = Sets.newHashSet("id", "sprint");
	
	public static void getAll(){
		List<Story> findAll = Story.findAll();
		renderJSON(findAll);
	}
	
	public static void bySprint(Long sprintId){
		List<Story> findAll = Story.findBySprint(sprintId);
		renderJSON(findAll);
	}
	
	public static void byId(Long storyId){
		Story story = Story.findById(storyId);
		renderJSON(story);
	}
	
	public static void unassigned(){
		List<Story> findAll = Story.findUnassigned();
		renderJSON(findAll);
	}
	
	public static void assignStory(String json, Long sprintId){
		Story story = new Gson().fromJson(json, Story.class);
		if (sprintId == null){
			story.sprint = null;
		} else {
			Key<Sprint> sprintKey = Sprint.findKey(sprintId);
			story.sprint = sprintKey;
		}
	
		story.save();
	}
	
	public static void save(Long sprintId, JsonObject body){
		Story story = new Gson().fromJson(body, Story.class);
		if (sprintId != null && sprintId != 0){
			Key<Sprint> sprintKey = Sprint.findKey(sprintId);
			story.sprint = sprintKey;
		}
		story.save();
		renderJSON(story);
	}
	
	public static void delete(Long storyId){
		Story toDelete = Story.findById(storyId);
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
	public static void update(Long storyId, JsonObject body){
		doUpdate(storyId, body);
	}
	
	/**
	 * Updates a single task data
	 * @param storyId
	 * @param taskId
	 * @param body
	 */
	public static void updateIndexes(JsonArray body){
		//id:index
		for (JsonElement jsonElement : body) {
			if (jsonElement.isJsonObject()){
				JsonObject jsonObject = jsonElement.getAsJsonObject();
				long storyId = jsonObject.get("id").getAsLong();
				int storyIndex = jsonObject.get("index").getAsInt();
				Story story = Story.findById(storyId);
				if (story != null){
					story.index = storyIndex;
					story.save();
				}
			} 
		}
	}
	

	/**
	 * Updates a single or an array of tasks for a given story
	 * @param storyId
	 * @param taskId
	 * @param body
	 */
	public static void update(JsonObject body){
		if (body.isJsonObject()){
			updateElement(body);
		}
		if (body.isJsonArray()){
			JsonArray jsonArray = body.getAsJsonArray();
			for (JsonElement jsonElement : jsonArray) {
				updateElement(jsonElement);
			}
			
		}
		renderJSON(UserMessage.SUCCESSFUL);
	}
	
	
	
	private static void updateElement(JsonElement element){
		if (element.isJsonObject()){
			JsonObject jsonObject = element.getAsJsonObject();
			JsonElement jsonElement = jsonObject.get("id");
			if (jsonElement != null){
				doUpdate(jsonElement.getAsLong(), jsonObject);
			}
		}
	}

	private static void doUpdate(Long storyId, JsonObject body){
		Story toUpdate = Story.findById(storyId);
		if (toUpdate != null){
			updateObject(toUpdate, body);
			toUpdate.save();
			renderText(getGson().toJson(toUpdate));
		}
	}
	
	private static void updateObject(Story toUpdate, JsonObject body){
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
	
	

}
