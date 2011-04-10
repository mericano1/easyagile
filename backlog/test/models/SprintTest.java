package models;

import java.util.Date;

import org.junit.Test;

import com.googlecode.objectify.Key;

import play.test.UnitTest;

public class SprintTest extends UnitTest{
	
	@Test
	public void testSaveAndGetById(){
		Sprint sprint = TestModelBuilder.createSimpleSprint("firstSprint", new Date(), new Date(), true);
		Key<Sprint> save = sprint.save();
		assertNotNull(save);
		Sprint byId = Sprint.findById(save);
		assertNotNull(byId);
	}

	
}
