package controllers;

import java.util.List;

import models.Sprint;
import models.Story;
import models.Task;
import models.Task.TaskJsonDeserializer;
import models.Task.TaskJsonSerializer;
import models.User;
import play.mvc.Controller;
import play.mvc.With;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.googlecode.objectify.Key;


@With(Application.class)
public class Stories extends Controller{
	
	public static void bySprint(Long sprintId){
		List<Story> findAll = Story.findBySprint(sprintId);
		renderJSON(findAll);
	}
	
	
	public static void save(String json, Long sprintId){
		JsonElement fromJson = new JsonParser().parse(json.trim());
		processArrayOfElements(fromJson, sprintId);
	}
	
	/**
	 * Process all the story json objects. Can either delete update or add them to the persistence storage
	 * @param fromJson the story json element array
	 * @param sprintId the sprint these stories belong to
	 */
	private static void processArrayOfElements(JsonElement fromJson, Long sprintId){
		if (fromJson.isJsonArray()){
			JsonArray asJsonArray = fromJson.getAsJsonArray();
			for (JsonElement jsonElement : asJsonArray) {
				processElement(jsonElement, sprintId);
			}
		} else {
			processElement(fromJson, sprintId);
		}
	}
	
	
	/**
	 * Process a single story json object. Can either delete update or add it to the persistence storage
	 * @param jsonElement the story json element 
	 * @param sprintId the sprint this story belong to
	 */
	private static void processElement(JsonElement jsonElement, Long sprintId){
		if (jsonElement.isJsonObject()){
			JsonObject jsonObject = jsonElement.getAsJsonObject();
			Story story = new Gson().fromJson(jsonObject, Story.class);
			Key<Sprint> sprintKey = Sprint.findKey(sprintId);
			if (sprintKey != null){
				story.sprint = sprintKey;
				JsonElement deleted = jsonObject.get("deleted");
				if (deleted != null && deleted.getAsBoolean()){
					story.delete();
				} else {
					Key<Story> storyKey = story.save();
					JsonElement tasks = jsonObject.get("tasks");
					if (tasks != null){
						if (tasks.isJsonArray()){
							JsonArray tasksArray = tasks.getAsJsonArray();
							for (JsonElement taskElement : tasksArray) {
								processTaskElement(taskElement,storyKey);
							}
						}else{
							processTaskElement(tasks,storyKey);
						}
					}
				}
			}
		}
		
	}
	
	/**
	 * Process a task element. Can either delete update or add it to the persistence storage
	 * @param taskElement the task json element
	 * @param storyKey the parent story key
	 */
	private static void processTaskElement(JsonElement taskElement, Key<Story> storyKey){
		if (taskElement.isJsonObject()){
			JsonObject taskJsonObject = taskElement.getAsJsonObject();
			Task task = getGson().fromJson(taskJsonObject, Task.class);
			task.story = storyKey;
			JsonElement taskDeleted = taskJsonObject.get("deleted");
			if (taskDeleted != null && taskDeleted.getAsBoolean()){
				task.delete();
			} else {
				//assignUser(task, taskJsonObject);
				task.save();
			}
		}
	}
	
/*	private static void assignUser(Task task, JsonObject jsonTask){
		JsonElement jsonElement = jsonTask.get("assigneeEmail");
		if (jsonElement != null){
			User byEmail = User.findByEmail(jsonElement.getAsString());
			task.assignee = byEmail.getKey(); 
		}
	}*/
	
	
	
	private static Gson getGson () {
		Gson gson = new GsonBuilder()
		.registerTypeAdapter(Task.class, new TaskJsonDeserializer())
		.registerTypeAdapter(Task.class, new TaskJsonSerializer())
		.create();
		return gson;
	}
	
	

}
