package models;

import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.googlecode.objectify.Key;

import play.modules.objectify.Datastore;
import play.modules.objectify.ObjectifyFixtures;
import play.test.UnitTest;

public class TaskTest extends UnitTest {
	@Before
	public void setup() {
		ObjectifyFixtures.deleteAll();
	}

	@Test
	public void should_insert_task() {
		Task task = put();
		assertNotNull("Task id is null", task.id);
	}

	@Test
	public void should_find_task_by_id() {
		Sprint sprint = TestModelBuilder.createSimpleSprint("firstSprint", new Date(), new Date(), true);
		Key<Sprint> key = sprint.save();
		Story story = TestModelBuilder.createSimpleStory("story1", "desc", 6, 0, key);
		story.save();
		Task task = TestModelBuilder.createSimpleTask("task1", "task desc", 5,0, story.key());
		task.save();
		assertNotNull("Task id is null", task.id);
		Task retrievedTask = Task.findById(story.id,task.id);
		assertNotNull("Task is null" + task.id, retrievedTask);
		assertNotNull("Task id is null", retrievedTask.id);
		assertEquals("Task id not correct", task.id, retrievedTask.id);
		assertEquals("Task first name not correct", "task1", retrievedTask.name);
	}

	@Test
	public void should_find_task_by_Name() {
		Task task = put();
		Task retrievedTask = Datastore.query(Task.class).filter("name", "task1").get();
		assertNotNull("Task is null", retrievedTask);
		assertNotNull("Task id is null", retrievedTask.id);
		assertEquals("Task id not correct", task.id, retrievedTask.id);
	}

	@Test
	public void should_find_task_by_story() {
		Sprint sprint = TestModelBuilder.createSimpleSprint("firstSprint", new Date(), new Date(), true);
		Key<Sprint> key = sprint.save();
		Story story = TestModelBuilder.createSimpleStory("story", "desc", 4, 0, key);
		story.save();
		Task task1 = TestModelBuilder.createSimpleTask("task1", "task1 desc",
				5, 0, story.key());
		Task task2 = TestModelBuilder.createSimpleTask("task2", "task2 desc",
				5, 0, story.key());
		Task task3 = TestModelBuilder.createSimpleTask("task3", "task3 desc",
				5, 0, story.key());
		task1.save();
		task2.save();
		task3.save();
		List<Task> list = Task.findAllByStory(story.id);
		assertNotNull("Task list is null", list);
		assertEquals("Task size is wrong", 3, list.size());
	}

	@Test
	public void should_delete_task() {
		put();
		Task retrievedTask = Datastore.query(Task.class)
				.filter("name", "task1").get();
		assertNotNull("Task is null", retrievedTask);
		retrievedTask.delete();
		retrievedTask = Datastore.query(Task.class).filter("name", "task1").get();
		assertNull("Task is not null", retrievedTask);
	}

	private Task put() {
		Sprint sprint = TestModelBuilder.createSimpleSprint("firstSprint", new Date(), new Date(), true);
		Key<Sprint> key = sprint.save();
		Story story = TestModelBuilder.createSimpleStory("story1", "desc", 6, 0, key);
		story.save();
		Task task = TestModelBuilder.createSimpleTask("task1", "task desc", 5,0, story.key());
		task.save();
		return task;
	}

}
