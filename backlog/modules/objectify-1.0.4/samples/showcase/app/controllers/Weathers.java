package controllers;

import models.Weather;
import play.mvc.With;

/**
 * @author David Cheong
 * @since 09/10/2010
 */
@With(Secure.class)
@CRUD.For(Weather.class)
public class Weathers extends CRUD {
}
