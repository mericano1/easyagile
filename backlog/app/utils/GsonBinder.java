package utils;

import java.lang.annotation.*;
import java.lang.reflect.Type;

import com.google.gson.*;

import play.data.binding.*;

@Global
public class GsonBinder implements TypeBinder<JsonObject> {

    @Override
    public Object bind(String name, Annotation[] antns, String value, Class clazz) throws Exception {
    	 return new JsonParser().parse(value);
    }
}