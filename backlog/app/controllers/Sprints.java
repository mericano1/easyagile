package controllers;

import java.util.Date;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

import models.Sprint;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.BeanUtilsBean;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.ConvertUtilsBean;
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

@With(Application.class)
public class Sprints extends Controller{
	private static final String DATE_FORMAT = Play.configuration.getProperty("date.format");
	private static final Set<String> EXCLUDE_PROPS = Sets.newHashSet("id");
	private static final Gson gson = new GsonBuilder().setDateFormat(DATE_FORMAT).create();
	static {
		DateConverter dateConverter = new DateConverter();
		dateConverter.setPattern(DATE_FORMAT);
		ConvertUtils.register(dateConverter, Date.class);
	}
	
	/**
	 * Gets the list of all sprints
	 */
	public static void all(){
		List<Sprint> findAll = Sprint.findAll();
		findAll.add(0, new Sprint(0L, "Unassigned"));
		renderJSON(findAll);
	}
	
	/**
	 * Gets the list of all sprints
	 */
	public static void byId(Long sprintId){
		Sprint byId = Sprint.findById(sprintId);
		renderJSON(byId);
	}
	
	/**
	 * Gets the list of all sprints
	 */
	public static void getCurrent(){
		Sprint currentSprint = Sprint.findCurrentSprint();
		renderJSON(currentSprint);
	}
	
	
	/**
	 * Saves a sprint in the persistent layer
	 * @param json a json representation of the sprint
	 */
	public static void save(JsonObject body){
		Sprint sprint = gson.fromJson(body, Sprint.class);
		sprint.save();
		renderJSON(sprint);
	}
	
	
	/**
	 * Gets the list of all sprints
	 */
	public static void delete(Long sprintId){
		Sprint byId = Sprint.findById(sprintId);
		if (byId != null){
			byId.delete();
		}
		renderJSON(UserMessage.SUCCESSFUL);
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

	private static void doUpdate(Long sprintId, JsonObject body){
		Sprint toUpdate = Sprint.findById(sprintId);
		if (toUpdate != null){
			updateObject(toUpdate, body);
			toUpdate.save();
			renderText(new Gson().toJson(toUpdate));
		}
	}
	
	private static void updateObject(Sprint toUpdate, JsonObject body){
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
