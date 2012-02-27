package models;

import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.persistence.Id;

import play.data.validation.Required;
import play.modules.objectify.Datastore;
import play.modules.objectify.ObjectifyModel;

import com.google.common.collect.Maps;
import com.google.gson.Gson;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Parent;

public class Task extends ObjectifyModel<Task> {
	@Id 
	public Long id;
    @Required 
    public String name;
    public String description;
    public Integer index;
    public Integer points;
    public Boolean completed;
    public Date doneBy;
    @Required public Key<Story> story;
    public Key<User> assignee;
    
    public static Task findById(Long taskId) {
    	Key<Task> key = Datastore.key(Task.class, taskId);
        return Datastore.find(key);
    }
    
    
    public static Task findById(Key<Task> key) {
        return Datastore.find(key);
    }
    
    
    public Key<Task> save() {
        return Datastore.put(this);
    }
    
    public void delete() {
        Datastore.delete(this);
    }
    
    public static List<Task> findAll() {
       return Datastore.query(Task.class).order("index").list();
    }
    
    public static List<Task> findAllByStory(Long storyId) {
    	if (storyId != null) {
            return Datastore.query(Task.class)
                    .filter("story", Datastore.key(Story.class, storyId))
                    .order("index").list();
        }
        else {
            return null;
        }

    }
    
}
