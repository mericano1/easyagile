package controllers;

import java.util.List;

import models.Story;
import play.mvc.Controller;

import com.google.gson.Gson;

public class Stories extends Controller{
	
	public static void getAll(){
		List<Story> findAll = Story.findAll();
		renderJSON(findAll);
	}
	
	
	public static void add(String json){
		Gson gson = new Gson();
		Story story = gson.fromJson(json, Story.class);
		story.save();
	}

}
