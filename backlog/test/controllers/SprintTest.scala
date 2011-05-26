package controllers
import play.test.FunctionalTestCase
import play.test.Matchers
import play.modules.objectify.ObjectifyFixtures
import com.google.gson.Gson
import models.Sprint
import org.scalatest.matchers.ShouldMatchers
import org.junit.Before
import org.junit.Test
import play.Play
import com.google.gson.GsonBuilder


class SprintTest extends LoggedIn with ShouldMatchers with Matchers{
  
  @Before def setUp {
    ObjectifyFixtures.deleteAll()
    login
  }
  
  @Test def getAll {
    ObjectifyFixtures.load("sprints.yml");
    val response = GET("/sprints");
    response shouldBeOk()
    response contentTypeShouldBe("application/json")
    val gsonStr = gson.fromJson(response.out.toString, classOf[Array[Sprint]]);
    gsonStr.length should equal (3)
    gsonStr(0).name should equal ("Unassigned")
    gsonStr(1).name should equal ("sprint1")
    gsonStr(2).name should equal ("sprint2")
  }
  
  @Test def update {
    ObjectifyFixtures.load("sprints.yml");
    val sprints = Sprint.findAll
    var sprint1 = sprints.get(0)
    sprint1.name += " updated"
    val gsonStr = gson.toJson(sprint1)
    var request = newRequest();
    request.cookies = lastCookies;
    val res = PUT(request, "/sprints/" + sprint1.id, "application/json", gsonStr)
    res shouldBeOk()
    res contentTypeShouldBe("application/json")
    val dbSprint = Sprint.findById(sprint1.id)
    dbSprint.name should equal(sprint1.name)
  }
  
  @Test def save {
    val res = POST("/sprints", "application/json", """{"name":"first sprint", "startDate" : "12-05-2011" }""");
    res shouldBeOk()
    val sprints = Sprint.findAll
    sprints.size should equal(1)
    val first = sprints.get(0)
    first.name should be("first sprint")
  }
  
  
  
}