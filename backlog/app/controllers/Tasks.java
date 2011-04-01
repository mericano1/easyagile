package controllers;

import java.util.List;

import models.Story;
import models.Task;
import play.mvc.Controller;

import com.google.gson.Gson;
import com.googlecode.objectify.Key;

public class Tasks extends Controller{
	
	/**
	 * gets all the tasks for a story
	 * @param storyId
	 */
	public static void byStory(long storyId){
		List<Task> byStory = Task.findAllByStory(storyId);
		renderJSON(byStory);
	}
	
	/**
	 * gets all the tasks for a story
	 * @param storyId
	 */
	public static void add(String json, String storyId){
		Gson gson = new Gson();
		Task task = gson.fromJson(json, Task.class);
		task.story = new Key<Story>(Story.class, Long.valueOf(storyId));
		task.save();
	}

}
