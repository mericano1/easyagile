package controllers;

import play.modules.gae.GAE;
import play.mvc.Before;
import play.mvc.Controller;

/**
 * @author David Cheong
 * @since 14/05/2010
 */
public class Secure extends Controller {

    @Before
    public static void checkLoggedIn() {
        if (!GAE.getUserService().isUserLoggedIn()) {
            Application.login();
        }
    }

    @Before
    public static void renderLoggedInUser() {
        renderArgs.put("user", GAE.getUser());
    }

}
