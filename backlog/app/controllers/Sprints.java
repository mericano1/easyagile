package controllers;

import java.util.List;

import models.Sprint;
import models.Story;
import models.Task;

import client.UserMessage;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import play.Play;
import play.mvc.Controller;
import play.mvc.With;

@With(Application.class)
public class Sprints extends Controller{
	
	/**
	 * Gets the list of all sprints
	 */
	public static void getAll(){
		List<Sprint> findAll = Sprint.findAll();
		renderJSON(findAll);
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
	public static void save(String json){
		Gson gson = new GsonBuilder().setDateFormat(Play.configuration.getProperty("date.format")).create();
		Sprint sprint = gson.fromJson(json, Sprint.class);
		sprint.save();
		renderJSON(sprint);
	}

}
