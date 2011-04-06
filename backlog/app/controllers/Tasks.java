package controllers;

import java.util.List;

import models.Story;
import models.Task;
import models.Task.TaskJsonDeserializer;
import models.Task.TaskJsonSerializer;
import play.mvc.Controller;
import play.mvc.With;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.googlecode.objectify.Key;

@With(Application.class)
public class Tasks extends Controller{
	
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
	public static void add(String json, String storyId){
		Task task = getGson().fromJson(json, Task.class);
		task.story = new Key<Story>(Story.class, Long.valueOf(storyId));
		task.save();
	}
	
	private static Gson getGson () {
		Gson gson = new GsonBuilder()
		.registerTypeAdapter(Task.class, new TaskJsonDeserializer())
		.registerTypeAdapter(Task.class, new TaskJsonSerializer())
		.create();
		return gson;
	}

}
