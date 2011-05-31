package controllers;

import java.util.Date;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

import models.Sprint;
import models.Story;
import models.Task;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.converters.DateConverter;

import play.Play;
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
	private static final String DATE_FORMAT = Play.configuration.getProperty("date.format");
	static {
		DateConverter dateConverter = new DateConverter();
		dateConverter.setPattern(DATE_FORMAT);
		ConvertUtils.register(dateConverter, Date.class);
	}
	private static final Gson gson = new GsonBuilder()
		.setDateFormat(DATE_FORMAT)
		.registerTypeAdapter(Task.class, new UserJsonDeserializer())
		.registerTypeAdapter(Task.class, new UserJsonSerializer())
		.create();
	static final Gson gsonDate = new GsonBuilder()
		.setDateFormat(DATE_FORMAT)
		.create();
	
	
	public static void getAll(){
		List<Story> findAll = Story.findAll();
		renderText(gson.toJson((findAll)));
	}
	
	public static void bySprint(Long sprintId){
		List<Story> findAll = Story.findBySprint(sprintId);
		renderText(gson.toJson((findAll)));
	}
	
	public static void byId(Long storyId){
		Story story = Story.findById(storyId);
		renderText(gson.toJson((story)));
	}
	
	public static void unassigned(){
		List<Story> findAll = Story.findUnassigned();
		renderText(gson.toJson((findAll)));
	}
	
	public static void allocate(Long sprintId, JsonObject body){
		Story story = gson.fromJson(body, Story.class);
		if (sprintId == null || sprintId == 0){
			story.sprint = null;
		} else {
			Key<Sprint> sprintKey = Sprint.findKey(sprintId);
			story.sprint = sprintKey;
		}
		story.index = Story.countStoriesBySprint(sprintId);
		story.save();
		renderJSON(UserMessage.SUCCESSFUL);
	}
	
	public static void save(Long sprintId, JsonObject body){
		Story story = gson.fromJson(body, Story.class);
		if (sprintId != null && sprintId != 0){
			Key<Sprint> sprintKey = Sprint.findKey(sprintId);
			story.sprint = sprintKey;
		}
		story.save();
		renderText(gson.toJson((story)));
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
		JsonElement updateElement =  doUpdate(storyId, body);
		renderJSON(updateElement);
	}
	
	
	

	/**
	 * Updates a single story
	 * @param body the json object message
	 */
	public static void update(JsonObject body){
		JsonElement updateElement =  updateElement(body);
		renderJSON(updateElement);
	}
	
	
	/**
	 * Updates a single story
	 * @param body the json object message
	 */
	public static void updateAll(JsonArray body){
		JsonArray toReturn = new JsonArray();
		for (JsonElement jsonElement : body) {
			JsonElement updateElement = updateElement(jsonElement);
			if (updateElement != null){
				toReturn.add(updateElement);
			}
		}
		renderJSON(toReturn);
	}
	
	
	private static JsonElement updateElement(JsonElement element){
		if (element.isJsonObject()){
			JsonObject jsonObject = element.getAsJsonObject();
			JsonElement jsonElement = jsonObject.get("id");
			if (jsonElement != null){
				return doUpdate(jsonElement.getAsLong(), jsonObject);
			}
		}
		return null;
	}

	private static JsonElement doUpdate(Long storyId, JsonObject body){
		Story toUpdate = Story.findById(storyId);
		if (toUpdate != null){
			updateObject(toUpdate, body);
			toUpdate.save();
		}
		return gson.toJsonTree(toUpdate);
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
					throw new UnexpectedException("The update failed. Some of the properties could not be persisted:" + key, e);
				}
			}
		}
	}
	
	
	

}
