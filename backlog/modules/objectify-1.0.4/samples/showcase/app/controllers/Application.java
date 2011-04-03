package controllers;

import com.google.appengine.api.users.User;
import play.modules.gae.GAE;
import play.mvc.*;

public class Application extends Controller {

    public static void index() {
        Secure.renderLoggedInUser();
        render();
    }

    public static void login() {
        GAE.login("Application.index");
    }

    public static void logout() {
        GAE.logout("Application.index");
    }

    public static String getUserEmail() {
        User user = GAE.getUser();
        if (user != null) {
            return user.getEmail();
        }
        return null;
    }

}