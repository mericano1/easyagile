package controllers;

import java.util.List;
import java.util.Map;

import models.Story;
import models.Task;

import org.junit.Before;
import org.junit.Test;

import play.modules.objectify.ObjectifyFixtures;
import play.mvc.Http.Cookie;
import play.mvc.Http.Request;
import play.mvc.Http.Response;

import com.google.gson.Gson;

public class TasksTest extends LoggedIn{
	String task1Json = "{\"id\":155,\"name\":\"hi there task\",\"description\":\"task desc\",\"index\":0,\"points\":23,\"story\":{\"kindClassName\":\"models.Story\",\"id\":153},\"div\":{\"0\":{\"jQuery1510011107923171946976\":26},\"length\":1}}",
	task2Json = "{\"id\":156,\"name\":\"story3 - task1\",\"description\":\"tesk1\",\"index\":1,\"points\":23,\"story\":{\"kindClassName\":\"models.Story\",\"id\":152},\"div\":{\"0\":{},\"length\":1}}";
	
	@Before
	public void setup(){
		ObjectifyFixtures.deleteAll();
		clearCookies();
		login();
	}
	
	@Test
	public void testSave(){
		ObjectifyFixtures.load("stories.yml");
		Story firstStory = Story.findAll().get(0);
		String url = "/stories/"+ firstStory.id + "/tasks" ;
		Response response = POST(url,"application/json" , task1Json);
		assertIsOk(response);
		List<Task> byStory = Task.findAllByStory(firstStory.id);
		assertEquals(1, byStory.size());
		assertEquals("hi there task", byStory.get(0).name);
		assertNotNull(byStory.get(0).story);
	}
	
	@Test
	public void testUpdate(){
		ObjectifyFixtures.load("storiesTasks.yml");
		Story firstStory = Story.findByStartName("story1").get(0);
		List<Task> byStory = Task.findAllByStory(firstStory.id);
		Task task = byStory.get(0);
		task.name = "task 1 updated";
		task.description = "task 1 desc updated";
		task.points = 312;
		String url = "/stories/"+ firstStory.id + "/tasks/" + task.id ;
		Request request = newRequest();
		request.cookies = lastCookies();
		Response response = PUT(request, url,"application/json" , new Gson().toJson(task));
		assertIsOk(response);

		Task fromRes = new Gson().fromJson(response.out.toString(), Task.class);
		assertEquals("task 1 updated", fromRes.name);
		assertEquals("task 1 desc updated", fromRes.description); 
		assertEquals((int)312, (int)fromRes.points);
		
		Task fromDb = Task.findById(task.getKey());
		assertEquals("task 1 updated", fromDb.name);
		assertEquals("task 1 desc updated", fromDb.description); 
		assertEquals((int)312, (int)fromDb.points);
		
	}
	
	@Test
	public void testUpdateIndex(){
		ObjectifyFixtures.load("storiesTasks.yml");
		Story firstStory = Story.findAll().get(0);
		List<Task> byStory = Task.findAllByStory(firstStory.id);
		String url = "/stories/"+ firstStory.id + "/tasks" ;
		//swap 2 indexes
		byStory.get(0).index = 1;
		byStory.get(1).index = 0;
		Request request = newRequest();
		request.cookies = lastCookies();
		String json = String.format("[{\"id\":%d, \"index\":%d},{\"id\":%d, \"index\":%d}]", byStory.get(0).id, byStory.get(0).index, 
				byStory.get(1).id, byStory.get(1).index);
		Response post = PUT(request, url, "application/json", json);
		assertIsOk(post);
		Task[] fromJson = new Gson().fromJson(GET(url).out.toString(), Task[].class);
		assertEquals("task2", fromJson[0].name);
		assertEquals("task1", fromJson[1].name);
	}
	
	@Test
	public void testById(){
		ObjectifyFixtures.load("storiesTasks.yml");
		Story firstStory = Story.findAll().get(0);
		List<Task> byStory = Task.findAllByStory(firstStory.id);
		Task task = byStory.get(0);
		String url = "/stories/"+ firstStory.id + "/tasks/" + task.id ;
		Response response = GET(url);
		assertIsOk(response);
		Task fromRes = new Gson().fromJson(response.out.toString(), Task.class);
		
		assertEquals(task.name, fromRes.name);
		assertEquals(task.description, fromRes.description); 
		assertEquals((int)task.points, (int)fromRes.points);
	}
	
	@Test
	public void testDelete(){
		ObjectifyFixtures.load("storiesTasks.yml");
		Story firstStory = Story.findAll().get(0);
		List<Task> byStory = Task.findAllByStory(firstStory.id);
		Task task = byStory.get(0);
		String url = "/stories/"+ firstStory.id + "/tasks/" + task.id ;
		Response response = DELETE(url);
		assertIsOk(response);
		
		assertEquals(byStory.size() -1 , Task.findAllByStory(firstStory.id).size());
	}
	
	@Test
	public void testByStory(){
		ObjectifyFixtures.load("storiesTasks.yml");
		Story firstStory = Story.findAll().get(0);
		String url = "/stories/"+ firstStory.id + "/tasks" ;
		Response response = GET(url);
		Task[] fromRes = new Gson().fromJson(response.out.toString(), Task[].class);
		
		List<Task> byStory = Task.findAllByStory(firstStory.id);
		assertEquals(byStory.size(), fromRes.length);
		int i = 0;
		for (Task task : byStory) {
			assertEquals(task.name, fromRes[i].name);
			assertEquals(task.description, fromRes[i].description);
			assertEquals(task.points, fromRes[i].points);
			i++;
		}
		
	}
	

}
