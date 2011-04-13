package utils;

import java.io.File;
import java.net.MalformedURLException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import junit.framework.Assert;
import play.mvc.Http.Response;
import play.mvc.Scope;
import play.mvc.Scope.RenderArgs;
import play.test.FunctionalTest;

import com.google.appengine.repackaged.com.google.common.base.Joiner;
import com.google.appengine.repackaged.com.google.common.collect.Lists;

public class TestHelper {
	
	/**
	 * If the given response was redirect (302) then this method will follow the redirect and return
	 * the redirect page.
	 * @param response
	 * @return
	 */
	public static Response followRedirect(Response response) {
		try {
			java.net.URL url = new java.net.URL(response.headers.get("Location").value());
			return FunctionalTest.GET(url.getFile());
		} catch (MalformedURLException e) {
			throw new RuntimeException(e);
		}
	}
	
	/**
	 * Gets the parameter that was passed to render() method.
	 * @param key
	 * @return
	 */
	public static Object getRenderParameter(String key) {
		RenderArgs current = Scope.RenderArgs.current();
		return current.data.get(key);
	}


}
