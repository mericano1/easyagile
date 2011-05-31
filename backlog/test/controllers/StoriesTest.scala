package controllers
import org.junit.Before
import play.modules.objectify.ObjectifyFixtures
import org.scalatest.matchers.ShouldMatchers
import play.test.Matchers
import org.junit.Test
import models.Sprint
import scalaj.collection.Imports._
import play.mvc.Router
import play.mvc.Http.Response
import com.google.gson.Gson
import models.Story
import models.TestModelBuilder
import java.util.Date
import com.google.gson.JsonObject
import scala.util.parsing.json.JSON

class StoriesTest extends LoggedIn with ShouldMatchers with Matchers {
	val story1Json = """{"name":"story1","description":"story1 desc","points":4,"index":0}"""
	val story2Json = """{"id":19,"name":"story2","description":"story2 desc","points":6,"index":1}""" 
	val story3Json = """{"id":20,"name":"story3","description":"story3 desc","points":8,"index":2}"""
	val story4Json = """{"id":21,"name":"story4","description":"story4 desc","points":31,"index":3}"""
	val task1Json = """{"id":155,"name":"hi there task","description":"task desc","index":0,"points":23,"story":{"kindClassName":"models.Story","id":153},"div":{"0":{"jQuery1510011107923171946976":26},"length":1}}"""
	val task2Json = """{"id":156,"name":"story3 - task1","description":"tesk1","index":1,"points":23,"story":{"kindClassName":"models.Story","id":152},"div":{"0":{},"length":1}}"""
	
	@Before	def setup(){
		ObjectifyFixtures.deleteAll()
		clearCookies()
		login
	}
	
	@Test
	def testGetAll(){
		ObjectifyFixtures.load("stories.yml")
		val sprint = Sprint.findCurrentSprint()
		val url = Router.reverse("Stories.bySprint", Map[String, Object]("sprintId" -> sprint.id).asJava).url
		val get = GET(url)
		val output = get.out.toString()
		val fromJson = gson.fromJson(output, classOf[Array[Story]])
		fromJson.length should be(4)
		fromJson(0).name should be("story1")
		fromJson(fromJson.length-1).name should be("story4")
	}
	
	@Test
	def testUpdateIndex(){
		ObjectifyFixtures.load("stories.yml");
		val sprint = Sprint.findCurrentSprint();
		val url = Router.reverse("Stories.bySprint", Map[String, Object]("sprintId" -> sprint.id).asJava).url;
		val get = GET(url);
		val output = get.out.toString();
		var fromJson = gson.fromJson(output, classOf[Array[Story]]);
		
		//swap 2 indexes
		fromJson(0).index = 1;
		fromJson(1).index = 0;
		val updateIdxUrl = "/stories";
		val request = newRequest();
		request.cookies = lastCookies;
		val json = "[{id: %d, index:%d},{id: %d, index:%d}]".format(fromJson(0).id, fromJson(0).index, fromJson(1).id, fromJson(1).index)
		val  post = PUT(request, updateIdxUrl, "application/json", json);
		post shouldBeOk()
		fromJson = gson.fromJson(GET(url).out.toString(), classOf[Array[Story]]);
		fromJson(0).name should be("story2")
		fromJson(1).name should be("story1")
	}
	
	
	@Test
	def testSave(){
		val sprint = TestModelBuilder.createSimpleSprint("sprint1", new Date(), new Date(), true);
		sprint.save();
		val url = Router.reverse("Stories.save", Map[String, Object]("sprintId"-> sprint.id).asJava).url;
		val response = POST(url, "application/json", story1Json);
		response shouldBeOk
		val findAll = Story.findAll();
		findAll.size should be(1)
		findAll.get(0).name should be("story1")
	}
	
	@Test
	def testSaveNoSprint(){
		val sprint = TestModelBuilder.createSimpleSprint("sprint1", new Date(), new Date(), true);
		sprint.save();
		var url = Router.reverse("Stories.save", Map[String, Object]("sprintId"-> sprint.id).asJava).url;
		var response = POST(url, "application/json", story1Json);
		assertIsOk(response);
		val findAll = Story.findAll();
		findAll.size() should be(1)
		findAll.get(0).name should be("story1")
		
		url = Router.reverse("Stories.save", Map[String, Object]("sprintId"-> 0L.asInstanceOf[Object]).asJava).url;
		response = POST(url, "application/json", story2Json);
		assertIsOk(response);
		Story.findUnassigned().size() should be(1)
		Story.findAll().size() should be(2)
		Story.findUnassigned().get(0).name should be("story2")
	}
	
	@Test
	def testUpdate(){
		ObjectifyFixtures.load("stories.yml");
		val firstStory = Story.findAll().get(0);
		firstStory.name = "story1 updated";
		firstStory.points = 10;
		val jsonUpdated = gson.toJson(firstStory);
		val response = PUTJson("/stories/" + firstStory.id, jsonUpdated);
		response shouldBeOk()
		val retrieved = Story.findById(firstStory.key());
		retrieved.name should be("story1 updated")
		retrieved.points should be(10)
	}
	
	@Test
	def testById(){
		ObjectifyFixtures.load("stories.yml")
		val firstStory = Story.findAll().get(0)
		val response = GET("/stories/" + firstStory.id);
		response shouldBeOk()
		val retrieved = gson.fromJson(response.out.toString(), classOf[Story]);
		retrieved.name should be("story1")
		retrieved.points should be(4)
	}
	
	
	@Test
	def testDelete(){
		ObjectifyFixtures.load("stories.yml");
		val firstStory = Story.findAll().get(0);
		val response = DELETE("/stories/" + firstStory.id);
		response shouldBeOk()
		val retrieved = Story.findById(firstStory.key());
		retrieved should be(null)
		Story.findAll().size() should be(3)
	}
	
	@Test
	def testAssignToUser(){
		ObjectifyFixtures.load("stories.yml");
		val firstStory = Story.findAll().get(0);
		val jsonElement = gson.toJsonTree(firstStory)
		jsonElement.asInstanceOf[JsonObject].addProperty("assignee", "bob@gmail.com");
		val response = PUTJson("/stories/" + firstStory.id, jsonElement.toString);
		response shouldBeOk()
		
		val byId = GET("/stories/" + firstStory.id);
		
		val assignee = JSON.parseFull(byId.out.toString) match {
		  case Some(x) => {
		    val obj = x.asInstanceOf[Map[String, Any]]
		    obj("assignee")
		  }
		  case None => Nil
		}
		
		assignee should not be(Nil)
	}
	
}