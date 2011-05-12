package controllers;


import java.io.File;
import java.io.InputStreamReader;
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
import play.mvc.Http.Request;
import play.mvc.Http.Response;
import play.mvc.Router;
import play.test.FunctionalTest;
import utils.TestHelper;

import com.google.common.collect.Maps;
import com.google.gson.Gson;

public class StoriesTest extends FunctionalTest {
	String story1Json = "{\"name\":\"story1\",\"description\":\"story1 desc\",\"points\":4,\"index\":0}",
	story2Json = "{\"id\":19,\"name\":\"story2\",\"description\":\"story2 desc\",\"points\":6,\"index\":1}" ,
	story3Json = "{\"id\":20,\"name\":\"story3\",\"description\":\"story3 desc\",\"points\":8,\"index\":2}" ,
	story4Json = "{\"id\":21,\"name\":\"story4\",\"description\":\"story4 desc\",\"points\":31,\"index\":3}",
	task1Json = "{\"id\":155,\"name\":\"hi there task\",\"description\":\"task desc\",\"index\":0,\"points\":23,\"story\":{\"kindClassName\":\"models.Story\",\"id\":153},\"div\":{\"0\":{\"jQuery1510011107923171946976\":26},\"length\":1}}",
	task2Json = "{\"id\":156,\"name\":\"story3 - task1\",\"description\":\"tesk1\",\"index\":1,\"points\":23,\"story\":{\"kindClassName\":\"models.Story\",\"id\":152},\"div\":{\"0\":{},\"length\":1}}";
	
	private static Map<String, Http.Cookie> lastCookies;
	@Before
	public void setup(){
		ObjectifyFixtures.deleteAll();
		clearCookies();
		login();
	}
	
	public void login(){
		String postUrl = Router.reverse("GAEActions.doLogin").url;
		Map<String, String> map = Maps.newHashMap();
		map.put("email", "andrea.salvadore@gmail.com");
		map.put("url", "/");
		map.put("isAdmin", "true");
		Map<String, File> fileMap = Maps.newHashMap();
		Response post = POST(postUrl, map, fileMap);
		lastCookies = post.cookies;
	}
	
	public Map<String, Object> getArgsMap(String name, Long value){
		Map<String, Object> map = Maps.newHashMap();
		map.put(name, value);
		return map;
	}
	
	@Test
	public void testGetAll(){
		ObjectifyFixtures.load("stories.yml");
		Sprint sprint = Sprint.findCurrentSprint();
		String url = Router.reverse("Stories.bySprint",getArgsMap("sprintId", sprint.id)).url;
		Response get = GET(url);
		String output = get.out.toString();
		Gson gson = new Gson();
		Story[] fromJson = gson.fromJson(output, Story[].class);
		assertEquals(4, fromJson.length);
		assertEquals("story1", fromJson[0].name);
		assertEquals("story4", fromJson[fromJson.length-1].name);
	}
	
	@Test
	public void testUpdateIndex(){
		ObjectifyFixtures.load("stories.yml");
		Sprint sprint = Sprint.findCurrentSprint();
		String url = Router.reverse("Stories.bySprint", getArgsMap("sprintId", sprint.id)).url;
		Response get = GET(url);
		String output = get.out.toString();
		Gson gson = new Gson();
		Story[] fromJson = gson.fromJson(output, Story[].class);
		
		//swap 2 indexes
		fromJson[0].index = 1;
		fromJson[1].index = 0;
		String updateIdxUrl = "/stories";
		Request request = newRequest();
		request.cookies = lastCookies;
		String json = String.format("[{id: %d, index:%d},{id: %d, index:%d}]",fromJson[0].id, fromJson[0].index, fromJson[1].id, fromJson[1].index);
		Response post = PUT(request, updateIdxUrl, "application/json", json);
		assertIsOk(post);
		fromJson = gson.fromJson(GET(url).out.toString(), Story[].class);
		assertEquals("story2", fromJson[0].name);
		assertEquals("story1", fromJson[1].name);
	}
	
	
	@Test
	public void testSave(){
		Sprint sprint = TestModelBuilder.createSimpleSprint("sprint1", new Date(), new Date(), true);
		sprint.save();
		String url = Router.reverse("Stories.save", getArgsMap("sprintId", sprint.id)).url;
		Response response = POST(url, "application/json", story1Json);
		assertIsOk(response);
		List<Story> findAll = Story.findAll();
		assertEquals(1, findAll.size());
		assertEquals("story1", findAll.get(0).name);
	}
	
	@Test
	public void testSaveNoSprint(){
		Sprint sprint = TestModelBuilder.createSimpleSprint("sprint1", new Date(), new Date(), true);
		sprint.save();
		String url = Router.reverse("Stories.save", getArgsMap("sprintId", sprint.id)).url;
		Response response = POST(url, "application/json", story1Json);
		assertIsOk(response);
		List<Story> findAll = Story.findAll();
		assertEquals(1, findAll.size());
		assertEquals("story1", findAll.get(0).name);
		
		url = Router.reverse("Stories.save", getArgsMap("sprintId", 0L)).url;
		response = POST(url, "application/json", story2Json);
		assertIsOk(response);
		assertEquals(1, Story.findUnassigned().size());
		assertEquals(2, Story.findAll().size());
		assertEquals("story2", Story.findUnassigned().get(0).name);
	}
	
	@Test
	public void testUpdate(){
		ObjectifyFixtures.load("stories.yml");
		Story firstStory = Story.findAll().get(0);
		firstStory.name = "story1 updated";
		firstStory.points = 10;
		Gson gson = new Gson();
		String jsonUpdated = gson.toJson(firstStory);
		Request request = newRequest();
		request.cookies = lastCookies;
		Response response = PUT(request, "/stories/" + firstStory.id, "application/json", jsonUpdated);
		assertIsOk(response);
		Story retrieved = Story.findById(firstStory.key());
		assertEquals("story1 updated", retrieved.name);
		assertEquals((Integer)10, (Integer)retrieved.points);
	}
	
	@Test
	public void testById(){
		ObjectifyFixtures.load("stories.yml");
		Story firstStory = Story.findAll().get(0);
		Gson gson = new Gson();
		Response response = GET("/stories/" + firstStory.id);
		assertIsOk(response);
		Story retrieved = gson.fromJson(response.out.toString(), Story.class);
		assertEquals("story1", retrieved.name);
		assertEquals((Integer)4, (Integer)retrieved.points);
	}
	
	
	@Test
	public void testDelete(){
		ObjectifyFixtures.load("stories.yml");
		Story firstStory = Story.findAll().get(0);
		Response response = DELETE("/stories/" + firstStory.id);
		assertIsOk(response);
		Story retrieved = Story.findById(firstStory.key());
		assertNull(retrieved);
		assertEquals(3, Story.findAll().size());
	}

	
	
}
