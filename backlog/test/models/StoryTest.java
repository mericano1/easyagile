package models;

import java.util.List;

import org.junit.Before;
import org.junit.Test;

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
	public void should_find_story_by_id() {
		Story story = put();
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
		Story story1 = TestModelBuilder.createSimpleStory("story1", "desc1", 4,0), 
		story2 = TestModelBuilder.createSimpleStory("story2","desc2", 4, 0), 
		story3 = TestModelBuilder.createSimpleStory("story3", "desc3", 4, 0);
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
		Story story = TestModelBuilder.createSimpleStory("story1", "desc1", 4,
				0);
		story.save();
		return story;
	}

}
