package models;

import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.googlecode.objectify.Key;

import play.modules.objectify.Datastore;
import play.modules.objectify.ObjectifyFixtures;
import play.test.UnitTest;

public class StoryTest extends UnitTest {
	@Before
	public void setup() {
		ObjectifyFixtures.deleteAll();
	}

	@Test
	public void should_insert_story() {
		Story story = put();
		assertNotNull("story id is null", story.id);
	}
	
	
	@Test
	public void should_find_story_by_sprint2() {
		ObjectifyFixtures.load("stories.yml");
		Sprint sprint = Sprint.findCurrentSprint();
		List<Story> bySprint = Story.findBySprint(sprint.id);
		assertNotNull(bySprint);
		assertEquals(4, bySprint.size());
		Story retrievedStory = bySprint.get(0);
		assertNotNull("story is null", retrievedStory);
		assertNotNull("story id is null", retrievedStory.id);
		assertEquals("story first name not correct", "story1",retrievedStory.name);
	}
	
	
	@Test
	public void should_find_story_by_sprint() {
		Story story = put();
		Sprint sprint = Sprint.findCurrentSprint();
		List<Story> bySprint = Story.findBySprint(sprint.id);
		assertNotNull(bySprint);
		assertEquals(1, bySprint.size());
		Story retrievedStory = bySprint.get(0);
		assertNotNull("story is null", retrievedStory);
		assertNotNull("story id is null", retrievedStory.id);
		assertEquals("story id not correct", story.id, retrievedStory.id);
		assertEquals("story first name not correct", "story1",retrievedStory.name);
	}

	@Test
	public void should_find_story_by_id() {
		Story story = put();
		Sprint sprint = Sprint.findCurrentSprint();
		assertNotNull(sprint);
		assertNotNull(sprint.id);
		Story retrievedStory = Story.findById(story.id);
		assertNotNull("story is null", retrievedStory);
		assertNotNull("story id is null", retrievedStory.id);
		assertEquals("story id not correct", story.id, retrievedStory.id);
		assertEquals("story first name not correct", "story1",
				retrievedStory.name);
	}

	@Test
	public void should_delete() {
		Story story = put();
		Story retrievedStory = Story.findById(story.id);
		assertNotNull("story is null", retrievedStory);
		Datastore.delete(retrievedStory);
		retrievedStory = Story.findById(story.id);
		assertNull("story is not not null", retrievedStory);
	}

	@Test
	public void getAll() {
		Sprint sprint = TestModelBuilder.createSimpleSprint("firstSprint", new Date(), new Date(), true);
		Key<Sprint> key = sprint.save();
		Story story1 = TestModelBuilder.createSimpleStory("story1", "desc1", 4,0, key), 
		story2 = TestModelBuilder.createSimpleStory("story2","desc2", 4, 0, key), 
		story3 = TestModelBuilder.createSimpleStory("story3", "desc3", 4, 0, key);
		story1.save();
		story2.save();
		story3.save();
		
		List<Story> findAll = Story.findAll();
		assertNotNull(findAll);
		assertEquals(3, findAll.size());
		//check order
		assertEquals("story1", findAll.get(0).name);
		assertEquals("story2", findAll.get(1).name);
		assertEquals("story3", findAll.get(2).name);

	}

	private Story put() {
		Sprint sprint = TestModelBuilder.createSimpleSprint("firstSprint", new Date(), new Date(), true);
		Key<Sprint> sprintKey = sprint.save();
		Story story = TestModelBuilder.createSimpleStory("story1", "desc1", 4, 0, sprintKey);
		story.save();
		return story;
	}

}
