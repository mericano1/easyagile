package models;

import play.*;
import play.db.jpa.*;
import play.modules.objectify.Datastore;
import play.modules.objectify.ObjectifyModel;

import javax.persistence.*;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.googlecode.objectify.Key;

import java.lang.reflect.Type;
import java.util.*;


public class User extends ObjectifyModel<User> {
	@Id
	public Long id;

	public String email;
	public String name;
	public Date created;
	public Date modified;

	public static List<User> getAll() {
		return Datastore.query(User.class).list();
	}

	public static User findByKey(Key<User> key) {
		return Datastore.find(key);
	}
	
	public static User findById(Long id) {
		return Datastore.find(User.class, id);
	}

	public static User findByEmail(String email) {
		return Datastore.query(User.class).filter("email", email).get();
	}
	
	public static List<User> findAll() {
		return Datastore.query(User.class).order("name").list();
	}
	
	public Key<User> save() {
        return Datastore.put(this);
    }

	public User() {}
	
	public User(String email) {
		this.email = email;
	}

	public String toString() {
		return email;
	}

	
}
