package controllers;


import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.Map;

import models.Sprint;
import models.Story;
import models.Task;
import models.TestModelBuilder;

import org.junit.Before;
import org.junit.Test;

import play.modules.objectify.ObjectifyFixtures;
import play.mvc.Http;
import play.mvc.Http.Response;
import play.mvc.Router;
import play.test.FunctionalTest;

import com.google.appengine.repackaged.com.google.common.collect.Maps;
import com.google.gson.Gson;

public class StoriesTest extends FunctionalTest {
	String story1Json = "{\"name\":\"story1\",\"description\":\"story1 desc\",\"points\":4,\"index\":0}",
	story2Json = "{\"id\":19,\"name\":\"story2\",\"description\":\"story2 desc\",\"points\":6,\"index\":1}" ,
	story3Json = "{\"id\":20,\"name\":\"story3\",\"description\":\"story3 desc\",\"points\":8,\"index\":2}" ,
	story4Json = "{\"id\":21,\"name\":\"story4\",\"description\":\"story4 desc\",\"points\":31,\"index\":3}",
	task1Json = "{\"id\":155,\"name\":\"hi there task\",\"description\":\"task desc\",\"index\":0,\"points\":23,\"story\":{\"kindClassName\":\"models.Story\",\"id\":153},\"div\":{\"0\":{\"jQuery1510011107923171946976\":26},\"length\":1}}",
	task2Json = "{\"id\":156,\"name\":\"story3 - task1\",\"description\":\"tesk1\",\"index\":1,\"points\":23,\"story\":{\"kindClassName\":\"models.Story\",\"id\":152},\"div\":{\"0\":{},\"length\":1}}";
	
	
	@Before
	public void setup(){
		ObjectifyFixtures.deleteAll();
		clearCookies();
		//logs in
		String postUrl = Router.reverse("GAEActions.doLogin").url;
		Map<String, String> map = Maps.newHashMap();
		map.put("email", "andrea.salvadore@gmail.com");
		map.put("url", "/");
		map.put("isAdmin", "true");
		Map<String, File> fileMap = Maps.newHashMap();
		POST(postUrl, map, fileMap);
	}
	
	@Test
	public void testGetAll(){
		ObjectifyFixtures.load("stories.yml");
		String url = Router.reverse("Stories.bySprint").url;
		Sprint sprint = Sprint.findCurrentSprint();
		Response get = GET(url + "?sprintId=" + sprint.id);
		String output = get.out.toString();
		Gson gson = new Gson();
		Story[] fromJson = gson.fromJson(output, Story[].class);
		assertEquals(4, fromJson.length);
		assertEquals("story1", fromJson[0].name);
		assertEquals("story4", fromJson[fromJson.length-1].name);
	}
	
	@Test
	public void testSave(){
		String url = Router.reverse("Stories.save").url;
		Sprint sprint = TestModelBuilder.createSimpleSprint("sprint1", new Date(), new Date(), true);
		sprint.save();
		Response response = POST(url+"?json=" + story1Json + "&sprintId=" + sprint.id);
		assertIsOk(response);
		List<Story> findAll = Story.findAll();
		assertEquals(1, findAll.size());
		assertEquals("story1", findAll.get(0).name);
	}
	
	@Test
	public void testSaveArray(){
		String url = Router.reverse("Stories.save").url;
		Sprint sprint = TestModelBuilder.createSimpleSprint("sprint1", new Date(), new Date(), true);
		sprint.save();
		Response response = POST(url+"?json=[" + story1Json + "," + story2Json + "]&sprintId="+ sprint.id);
		sprint.save();
		assertEquals((Integer)Http.StatusCode.OK,(Integer) response.status);
		List<Story> findAll = Story.findAll();
		assertEquals(2, findAll.size());
		assertEquals("story1", findAll.get(0).name);
		assertEquals("story2", findAll.get(1).name);
	}
	
	
	@Test
	public void testSaveStoryAndTask(){
		String url = Router.reverse("Stories.save").url;
		String json = appendPropertyToJson(story1Json, "tasks", task1Json);
		Sprint sprint = TestModelBuilder.createSimpleSprint("sprint1", new Date(), new Date(), true);
		sprint.save();
		Response response = POST(url+"?json=" + json + "&sprintId="+ sprint.id);
		assertIsOk(response);
		List<Story> findAll = Story.findAll();
		assertEquals(1, findAll.size());
		assertEquals("story1", findAll.get(0).name);
		List<Task> tasks = Task.findAllByStory(findAll.get(0).id);
		assertEquals(1, tasks.size());
		assertEquals("hi there task", tasks.get(0).name);
		
	}
	
	
	@Test
	public void testSaveStoryAndTaskArray1(){
		String url = Router.reverse("Stories.save").url;
		Sprint sprint = TestModelBuilder.createSimpleSprint("sprint1", new Date(), new Date(), true);
		sprint.save();
		String json = appendPropertyToJson(story1Json, "tasks", "["+task1Json+"]");
		Response response = POST(url+"?json=" + json + "&sprintId="+ sprint.id);
		assertEquals((Integer)Http.StatusCode.OK,(Integer) response.status);
		List<Story> findAll = Story.findAll();
		assertEquals(1, findAll.size());
		assertEquals("story1", findAll.get(0).name);
		List<Task> tasks = Task.findAllByStory(findAll.get(0).id);
		assertEquals(1, tasks.size());
		assertEquals("hi there task", tasks.get(0).name);
		
	}
	
	@Test
	public void testSaveStoryAndTaskArray2(){
		String url = Router.reverse("Stories.save").url;
		Sprint sprint = TestModelBuilder.createSimpleSprint("sprint1", new Date(), new Date(), true);
		sprint.save();
		String json = appendPropertyToJson(story1Json, "tasks", "["+task1Json+","+ task2Json +"]");
		Response response = POST(url+"?json=" + json+ "&sprintId="+ sprint.id);
		assertEquals((Integer)Http.StatusCode.OK,(Integer) response.status);
		List<Story> findAll = Story.findAll();
		assertEquals(1, findAll.size());
		assertEquals("story1", findAll.get(0).name);
		List<Task> tasks = Task.findAllByStory(findAll.get(0).id);
		assertEquals(2, tasks.size());
		assertEquals("hi there task", tasks.get(0).name);
		assertEquals("story3 - task1", tasks.get(1).name);
		
	}
	
	
	@Test
	public void testUpdate(){
		ObjectifyFixtures.load("stories.yml");
		String url = Router.reverse("Stories.save").url;

		Sprint sprint = Sprint.findCurrentSprint();
		Story firstStory = Story.findAll().get(0);
		firstStory.name = "story1 updated";
		firstStory.points = 10;
		Gson gson = new Gson();
		String jsonUpdated = gson.toJson(firstStory);
		Response response = POST(url+"?json=" + jsonUpdated + "&sprintId=" + sprint.id);
		assertEquals((Integer)Http.StatusCode.OK,(Integer) response.status);
		Story retrieved = Story.findById(firstStory.key());
		assertEquals("story1 updated", retrieved.name);
		assertEquals((Integer)10, (Integer)retrieved.points);
	}
	
	
	@Test
	public void testDelete(){
		ObjectifyFixtures.load("stories.yml");
		String url = Router.reverse("Stories.save").url;

		Sprint sprint = Sprint.findCurrentSprint();
		Story firstStory = Story.findAll().get(0);
		firstStory.name = "story1 updated";
		firstStory.points = 10;
		Gson gson = new Gson();
		
		String jsonUpdated = gson.toJson(firstStory);
		//adds the deleted = true
		jsonUpdated = appendPropertyToJson(jsonUpdated, "deleted", "\"true\"");
		Response response = POST(url+"?json=" + jsonUpdated + "&sprintId=" + sprint.id);
		assertEquals((Integer)Http.StatusCode.OK,(Integer) response.status);
		Story retrieved = Story.findById(firstStory.key());
		assertNull(retrieved);
		assertEquals(3, Story.findAll().size());
	}
	
	
	private String appendPropertyToJson(String json, String name, String value){
		int length = json.length();
		return json.substring(0, length -1) + ",\""+ name +"\":" + value + " }";
		
	}

}
