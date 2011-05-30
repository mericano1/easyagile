package controllers
import org.junit.Before
import play.modules.objectify.ObjectifyFixtures
import org.junit.Test
import play.test.Matchers
import org.scalatest.matchers.ShouldMatchers
import models.Story
import models.Task



class TasksTest2 extends LoggedIn with ShouldMatchers with Matchers{
 @Before def setUp {
    ObjectifyFixtures.deleteAll()
    login
  }
  
  @Test def updateWithNotExistingAttribute {
    ObjectifyFixtures.load("/storiesTasks.yml");
    val storyId = Story.findAll().get(0).id
    val taskId = Task.findAllByStory(storyId).get(0).id
    
    val request = newRequest();
	request.cookies = lastCookies
	val json = "[{\"id\":%d, \"abcdefg\":%s}]".format(storyId,true)
	val response = PUT(request, "/stories/%d/tasks".format(storyId), "application/json", json);
    response shouldBeOk()
  }
 

}