package controllers

import play.mvc.Controller
import com.google.gson.GsonBuilder
import com.google.gson.JsonObject
import scalaj.collection.Imports._
import notifiers.Mails
import org.apache.commons.beanutils.BeanUtils
import org.apache.commons.beanutils.PropertyUtils
import play.exceptions.UnexpectedException
import com.google.gson.Gson

abstract class WorkUnitController extends Controller {
  val EXCLUDE_PROPS = Set[String]()
  def gson : Gson
  type T <: AnyRef
  
  def updateObject(toUpdate: T, body: JsonObject){
		val source = gson.fromJson(body, toUpdate.getClass);
		val entrySet = body.entrySet();
		for (entry <- entrySet) {
			val key = entry.getKey();
			if (key.equals("notify") && entry.getValue() != null && entry.getValue().getAsBoolean()){
				//Mails.notifyAssignment(source);
			}
			if (!EXCLUDE_PROPS.contains(key)){
				try {
					BeanUtils.copyProperty(toUpdate, key, PropertyUtils.getProperty(source, key));
				}catch {
				  case e1: NoSuchMethodException => play.Logger.warn("Trying to set a property not found: [%s]" , key);
				  case e => throw new UnexpectedException("The update failed. Some of the properties could not be persisted:" + key, e);
				}
			}
		}
	}

}