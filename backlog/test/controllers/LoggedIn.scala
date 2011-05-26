package controllers
import java.io.File
import play.mvc.Http.Cookie
import play.mvc.Router
import play.test.{FunctionalTestCase, FunctionalTest}
import scala.collection.mutable.HashMap
import scalaj.collection.Imports._
import play.Play
import com.google.gson.GsonBuilder

abstract class LoggedIn extends FunctionalTestCase {
  
  var lastCookies: java.util.Map[String, Cookie] = null
  val DATE_FORMAT = Play.configuration.getProperty("date.format")
  val gson = new GsonBuilder().setDateFormat(DATE_FORMAT).create()
  
  def login {
		val postUrl = Router.reverse("GAEActions.doLogin").url;
		val map = Map("email" -> "andrea.salvadore@gmail.com", 
		    "url"-> "/", 
		    "isAdmin"-> "true");
		val fileMap = new HashMap[String, File];
		val post = POST(postUrl, map.asJava, fileMap.asJava);
		lastCookies = post.cookies;
  }

}