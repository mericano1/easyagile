package controllers;

import java.util.Date;
import java.util.Set;

import com.google.common.collect.Sets;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import models.User;
import play.Play;
import play.modules.gae.GAE;
import play.mvc.Before;
import play.mvc.Controller;


public class Application extends Controller {
	static final Set<String> emails = Sets.newHashSet(
			"andrea.salvadore@gmail.com",
			"mdenieffe@gmail.com",
			"michael.k.baxter@gmail.com",
			"ftrilnik@gmail.com");
	static final String DATE_FORMAT = Play.configuration.getProperty("date.format");
	
	public static final Gson gsonDate = new GsonBuilder()
		.setDateFormat(DATE_FORMAT)
		.create();
	
	@Before
    static void checkConnected() {
        if(Auth.getUser() == null) {
        	GAE.login("Application.index");
        } else {
            renderArgs.put("user", Auth.getEmail());
        }
    }
	
    public static void index() {
    	if(Auth.isLoggedIn()) {
    		User user = User.findByEmail(Auth.getEmail());
            if(null == user) {
                user = new User();
                user.email = Auth.getEmail();
                user.name = Auth.getUser().getNickname();
                user.created = new Date();
                user.save();
            }
            if (emails.contains(Auth.getEmail())){
            	render();
            }else{
            	forbidden("Not authorized");
            }
        }
    	//login();
    }
        
    

}