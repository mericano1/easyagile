package controllers
import com.google.gson.{Gson, JsonObject}
import models.{Task, Story}
import org.junit.{Test, Before}
import org.scalatest.matchers.ShouldMatchers
import org.scalatest.prop.Checkers
import play.modules.objectify.ObjectifyFixtures
import play.test.Matchers
import scala.util.parsing.json.JSON
import scalaj.collection.Imports._
import play.libs.Mail.Mock



class TasksTest extends LoggedIn with ShouldMatchers with Matchers {
  val task1Json = "{\"id\":155,\"name\":\"hi there task\",\"description\":\"task desc\",\"index\":0,\"points\":23,\"story\":{\"kindClassName\":\"models.Story\",\"id\":153},\"div\":{\"0\":{\"jQuery1510011107923171946976\":26},\"length\":1}}"
  val task2Json = "{\"id\":156,\"name\":\"story3 - task1\",\"description\":\"tesk1\",\"index\":1,\"points\":23,\"story\":{\"kindClassName\":\"models.Story\",\"id\":152},\"div\":{\"0\":{},\"length\":1}}"

 @Before def setUp {
    ObjectifyFixtures.deleteAll()
    login
  }
  
  @Test def updateWithNotExistingAttribute {
    ObjectifyFixtures.load("/storiesTasks.yml");
    val storyId = Story.findAll().get(0).id
    val taskId = Task.findAllByStory(storyId).get(0).id
    
    val json = "[{\"id\":%d, \"notify\":%s}]".format(storyId,true)
	val response = PUTJson("/stories/%d/tasks".format(storyId), json);
    response shouldBeOk()
  }
  
  @Test
	def testAssignToUserAndDate(){
		ObjectifyFixtures.load("storiesTasks.yml");
		val storyId = Story.findAll().get(0).id
		val task = Task.findAllByStory(storyId).get(0)
    
		val jsonElement = gson.toJsonTree(task)
		jsonElement.asInstanceOf[JsonObject].addProperty("assignee", "bob@gmail.com");
		val response = PUTJson("/stories/%d/tasks/%d".format(storyId, task.id), jsonElement.toString());
		response shouldBeOk()
		
		val byId = GET( "/stories/%d/tasks/%d".format(storyId, task.id));
		
		val assignee = JSON.parseFull(byId.out.toString).get;
		assignee.asInstanceOf[Map[String, Any]]("assignee") should not be(Nil)
		assignee.asInstanceOf[Map[String, Any]]("assignee") should be("bob@gmail.com")
	}
  
  @Test
	def testNotify(){
		ObjectifyFixtures.load("storiesTasks.yml");
		val storyId = Story.findAll().get(0).id
		val task = Task.findAllByStory(storyId).get(0)
    
		val jsonElement = gson.toJsonTree(task)
		jsonElement.asInstanceOf[JsonObject].addProperty("assignee", "bob@gmail.com");
		jsonElement.asInstanceOf[JsonObject].addProperty("notify", "true");
		val response = PUTJson("/stories/%d/tasks/%d".format(storyId, task.id), jsonElement.toString());
		response shouldBeOk()
		
		val byId = GET( "/stories/%d/tasks/%d".format(storyId, task.id));
		
		val assignee = JSON.parseFull(byId.out.toString).get;
		assignee.asInstanceOf[Map[String, Any]]("assignee") should not be(Nil)
		assignee.asInstanceOf[Map[String, Any]]("assignee") should be("bob@gmail.com")
		val email = Mock.getLastMessageReceivedBy("bob@gmail.com");
		email should not be null
	}
  
  @Test
	def testSpecifyDate(){
		ObjectifyFixtures.load("storiesTasks.yml");
		val storyId = Story.findAll().get(0).id
		val task= Task.findAllByStory(storyId).get(0)
    
		val jsonElement = gson.toJsonTree(task)
		jsonElement.getAsJsonObject().addProperty("assignee", "bob@gmail.com");
		jsonElement.getAsJsonObject().addProperty("doneBy", "11-08-2012");
		val response = PUTJson("/stories/%d/tasks/%d".format(storyId, task.id), jsonElement.toString());
		response shouldBeOk()
		
		val byId = GET( "/stories/%d/tasks/%d".format(storyId, task.id));
		
		val assignee= JSON.parseFull(byId.out.toString).get
		val map = assignee.asInstanceOf[Map[String, Any]];
		map("assignee") should not be(Nil)
		map("assignee") should be("bob@gmail.com")
		map("doneBy") should not be(Nil)
		map("doneBy") should be("11-08-2012")
	}
  
	
	
	
	@Test
	def testSave {
		ObjectifyFixtures.load("stories.yml");
		val firstStory = Story.findAll().get(0)
		val url = "/stories/%d/tasks".format(firstStory.id)
		val response = POST(url,"application/json" , task1Json);
		response shouldBeOk()
		val byStory = Task.findAllByStory(firstStory.id)
		byStory.size() should be(1)
		byStory.get(0).name should be("hi there task")
		byStory.get(0).story should not be null
	}
	
	@Test
	def testUpdate {
		ObjectifyFixtures.load("storiesTasks.yml");
		val firstStory = Story.findByStartName("story1").get(0);
		val byStory = Task.findAllByStory(firstStory.id);
		val task = byStory.get(0);
		task.name = "task 1 updated";
		task.description = "task 1 desc updated";
		task.points = 312;
		val url = "/stories/%d/tasks/%d".format(firstStory.id ,task.id);
		val response = PUTJson(url, new Gson().toJson(task));
		response shouldBeOk()

		val fromRes = new Gson().fromJson(response.out.toString(), classOf[Task]);
		fromRes.name should be("task 1 updated")
		fromRes.description should be("task 1 desc updated"); 
		fromRes.points should be(312)
		
		val fromDb = Task.findById(task.getKey());
		fromDb.name should be("task 1 updated")
		fromDb.description should be("task 1 desc updated") 
		fromDb.points should be(312)
		
	}
	
	@Test
	def testUpdateIndex(){
		ObjectifyFixtures.load("storiesTasks.yml");
		val firstStory = Story.findAll().get(0);
		val byStory = Task.findAllByStory(firstStory.id);
		val url = "/stories/%d/tasks".format(firstStory.id) ;
		//swap 2 indexes
		byStory.get(0).index = 1;
		byStory.get(1).index = 0;
		val json = "[{\"id\":%d, \"index\":%d},{\"id\":%d, \"index\":%d}]".format(byStory.get(0).id, byStory.get(0).index, 
				byStory.get(1).id, byStory.get(1).index);
		val post = PUTJson( url, json);
		post shouldBeOk()
		val fromJson = new Gson().fromJson(GET(url).out.toString(), classOf[Array[Task]]);
		fromJson(0).name should be("task2")
		fromJson(1).name should be("task1")
	}
	
	@Test
	def testById(){
		ObjectifyFixtures.load("storiesTasks.yml");
		val firstStory = Story.findAll().get(0);
		val byStory = Task.findAllByStory(firstStory.id);
		val task = byStory.get(0);
		val url = "/stories/%d/tasks/%d".format(firstStory.id ,task.id);
		val response = GET(url);
		response shouldBeOk()
		val fromRes = new Gson().fromJson(response.out.toString(), classOf[Task]);
		
		fromRes.name should be(task.name)
		fromRes.description should be(task.description); 
		fromRes.points should be(task.points);
	}
	
	@Test
	def testDelete(){
		ObjectifyFixtures.load("storiesTasks.yml");
		val firstStory = Story.findAll().get(0);
		val byStory = Task.findAllByStory(firstStory.id);
		val task = byStory.get(0);
		val url = "/stories/%d/tasks/%d".format(firstStory.id ,task.id);
		val response = DELETE(url);
		response shouldBeOk();
		Task.findAllByStory(firstStory.id).size() should be(byStory.size() -1)
	}
	
	@Test
	def testByStory(){
		ObjectifyFixtures.load("storiesTasks.yml");
		val firstStory = Story.findAll().get(0)
		val url = "/stories/%d/tasks".format(firstStory.id) 
		val response = GET(url)
		val fromRes = new Gson().fromJson(response.out.toString(), classOf[Array[Task]])
		
		val byStory = Task.findAllByStory(firstStory.id)
		fromRes.length should be(byStory.size())
		
		def checkTask (task: Task, otherTask: Task){
			otherTask.name should be(task.name)
			otherTask.description should be(task.description)
			otherTask.points should be(task.points)
		  
		}
		for (i <- 0 to fromRes.length -1){
		    checkTask(byStory.get(i), fromRes(i))
		}
		
	}
 

}