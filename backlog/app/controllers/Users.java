package controllers;

import java.util.List;

import models.User;
import play.mvc.Controller;
import play.mvc.With;

@With(Application.class)
public class Users extends Controller {

	public static void all(){
		List<User> findAll = User.findAll();
		renderJSON(findAll);
	}

}
